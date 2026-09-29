import React, { useState, useEffect, useRef } from "react";
import { Company, OutreachDraft } from "@/lib/types";
import { generateOutreach } from "@/lib/scoring";
import { 
  X, Copy, Check, Mail, Linkedin, Sparkles, RefreshCw, 
  Send, Zap, Key, ShieldAlert, ArrowRight 
} from "lucide-react";
import { 
  getCustomApiKey, 
  hasCustomApiKey, 
  isTrialExhausted, 
  getTrialRemaining, 
  incrementTrialUsed, 
  getTimeUntilReset,
  TRIAL_LIMIT 
} from "@/lib/apiKeyManager";

interface OutreachModalProps {
  company: Company | null;
  onClose: () => void;
  onOpenSettings?: () => void;
}

interface TelemetryState {
  model: string;
  latency_ms: number;
  cost_usd: number;
  is_live: boolean;
  is_cached?: boolean;
}

export const OutreachModal: React.FC<OutreachModalProps> = ({ company, onClose, onOpenSettings }) => {
  const [tone, setTone] = useState<"sdr_direct" | "executive_vp">("sdr_direct");
  const [draft, setDraft] = useState<OutreachDraft | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [telemetry, setTelemetry] = useState<TelemetryState | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [appliedPrompt, setAppliedPrompt] = useState<string | null>(null);
  const [isQuotaLocked, setIsQuotaLocked] = useState<boolean>(false);
  const [quotaReason, setQuotaReason] = useState<"trial_exhausted" | "api_quota_exceeded" | null>(null);
  const [trialRemaining, setTrialRemaining] = useState<number>(TRIAL_LIMIT);
  const [timeUntilReset, setTimeUntilReset] = useState<string | null>(null);
  const [userHasKey, setUserHasKey] = useState<boolean>(false);

  // In-memory cache across modal sessions: key is `companyId_tone_customInstruction`
  const cacheRef = useRef<Record<string, { draft: OutreachDraft; telemetry: TelemetryState }>>({});

  useEffect(() => {
    setTrialRemaining(getTrialRemaining());
    setTimeUntilReset(getTimeUntilReset());
    setUserHasKey(hasCustomApiKey());
  }, [company]);

  useEffect(() => {
    if (company) {
      loadOutreach(tone, false, appliedPrompt || undefined);
    }
  }, [company, tone]);

  const loadOutreach = async (
    selectedTone: "sdr_direct" | "executive_vp", 
    forceRegenerate = false, 
    customInstruction?: string
  ) => {
    if (!company) return;

    const cacheKey = `${company.id}_${selectedTone}${customInstruction ? `_${customInstruction}` : ""}`;

    // 1. Check in-memory cache first if not forced regeneration
    if (!forceRegenerate && cacheRef.current[cacheKey]) {
      const cached = cacheRef.current[cacheKey];
      setDraft(cached.draft);
      setTelemetry({
        ...cached.telemetry,
        is_cached: true,
        latency_ms: 0,
      });
      setIsQuotaLocked(false);
      setQuotaReason(null);

      // Record cache hit trace into persistent telemetry store
      fetch("/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trace: {
            feature: "outreach_generation",
            model: cached.telemetry?.model || "openai/gpt-4o-mini",
            prompt_version: "v2",
            input_tokens: 0,
            output_tokens: 0,
            latency_ms: 0,
            cost_usd: 0,
            company_name: company.name,
            decision_summary: `Served cached ${selectedTone} outreach draft for ${company.name} from client memory.`,
            cached: true,
          }
        })
      }).then(() => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("cyberintel:trace-logged"));
        }
      }).catch(() => {});

      return;
    }

    const customKey = getCustomApiKey();
    const hasKey = Boolean(customKey.trim());
    const isExhausted = !hasKey && isTrialExhausted();

    // If trial limit reached without personal key, lock AI output directly
    if (isExhausted) {
      setIsQuotaLocked(true);
      setQuotaReason("trial_exhausted");
      setDraft(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setIsQuotaLocked(false);
    setQuotaReason(null);

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (customKey) {
        headers["x-openrouter-key"] = customKey;
      }

      const res = await fetch("/api/generate-outreach", {
        method: "POST",
        headers,
        body: JSON.stringify({
          company,
          tone: selectedTone,
          customInstruction: customInstruction || undefined,
          apiKey: customKey || undefined
        }),
      });

      if (res.ok) {
        const data = await res.json();

        if (data.quotaExceeded) {
          setIsQuotaLocked(true);
          setQuotaReason(hasKey ? "api_quota_exceeded" : "trial_exhausted");
          setDraft(null);
          setLoading(false);
          return;
        }

        setDraft(data.draft);
        setTelemetry(data.telemetry);
        setIsQuotaLocked(false);
        setQuotaReason(null);

        if (data.telemetry?.is_live && !hasKey) {
          incrementTrialUsed();
          setTrialRemaining(getTrialRemaining());
        }

        // Store in cache
        cacheRef.current[cacheKey] = { draft: data.draft, telemetry: data.telemetry };

        // Save trace into browser session storage for instantaneous cockpit update
        if (data.trace && typeof window !== "undefined") {
          try {
            const existing = JSON.parse(localStorage.getItem("cyberintel_recent_traces") || "[]");
            localStorage.setItem("cyberintel_recent_traces", JSON.stringify([data.trace, ...existing].slice(0, 50)));
          } catch {}
        }

        // Dispatch trace-logged event to notify cockpit
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("cyberintel:trace-logged"));
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        if (errJson.quotaExceeded) {
          setIsQuotaLocked(true);
          setQuotaReason(hasKey ? "api_quota_exceeded" : "trial_exhausted");
          setDraft(null);
          return;
        }

        // Local fallback
        const generated = generateOutreach(company, selectedTone);
        setDraft(generated);
        setTelemetry({
          model: "deterministic-heuristic",
          latency_ms: 18,
          cost_usd: 0,
          is_live: false,
        });
      }
    } catch {
      // Network or unexpected failure
      const generated = generateOutreach(company, selectedTone);
      setDraft(generated);
      setTelemetry({
        model: "deterministic-heuristic",
        latency_ms: 18,
        cost_usd: 0,
        is_live: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (isQuotaLocked) return;

    const instruction = customPrompt.trim();
    if (instruction) {
      setAppliedPrompt(instruction);
      setCustomPrompt(""); // Remove prompt text after submitting so it doesn't linger
      loadOutreach(tone, true, instruction);
    } else {
      loadOutreach(tone, true, appliedPrompt || undefined);
    }
  };

  const handleClearAppliedPrompt = () => {
    setAppliedPrompt(null);
    setCustomPrompt("");
    loadOutreach(tone, true, undefined);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  if (!company) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-colors animate-modal-enter">
        
        {/* Header - Fixed Height & Flex-Centered to Keep Close Icon Perfectly Positioned */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40 shrink-0">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                Personalized Sales Copy
              </span>
              <span className="text-xs text-slate-500">For: <strong className="text-slate-900 dark:text-white">{company.name}</strong></span>

              {company.estimated_acv && (
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {company.estimated_acv}
                </span>
              )}

              {userHasKey ? (
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1"
                  title="Personal OpenRouter Key Active"
                >
                  <Key className="h-3 w-3 text-emerald-500" />
                  <span>Key Active</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1"
                  title="Click to configure OpenRouter API Key"
                >
                  <Key className="h-3 w-3 text-slate-400" />
                  <span>Trial: {trialRemaining} / {TRIAL_LIMIT} left</span>
                </button>
              )}
            </div>

            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-sky-500 shrink-0" />
              <span>AI Outreach Generator</span>
            </h2>
          </div>

          {/* Close button with shrink-0 and permanent alignment */}
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tone Selector & Buyer Persona Bar */}
        <div className="px-6 py-3 bg-slate-50/70 dark:bg-slate-950/70 border-b border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Buyer Persona:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-800">
              {company.target_buyer?.title || "VP of Engineering"}
            </span>
          </div>

          {/* Tone Selector Pills */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-200/60 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <button
              onClick={() => {
                if (isQuotaLocked) return;
                setTone("sdr_direct");
              }}
              disabled={isQuotaLocked}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors outline-none focus:outline-none disabled:opacity-50 ${
                tone === "sdr_direct"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Direct &amp; Technical (SDR)
            </button>
            <button
              onClick={() => {
                if (isQuotaLocked) return;
                setTone("executive_vp");
              }}
              disabled={isQuotaLocked}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors outline-none focus:outline-none disabled:opacity-50 ${
                tone === "executive_vp"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Executive &amp; ROI (VP / CISO)
            </button>
          </div>
        </div>

        {/* Content Area with Stable Dimensions */}
        <div className="p-6 flex-1 space-y-4 overflow-y-auto min-h-[380px] max-h-[52vh]">
          {loading ? (
            <div className="py-24 text-center animate-fade-in flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="h-6 w-6 text-slate-400 animate-spin" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {appliedPrompt
                  ? "Synthesizing custom instructions with live signals..."
                  : tone === "sdr_direct"
                  ? "Formulating technical architecture cold outreach..."
                  : "Structuring executive ROI & compliance narrative..."}
              </p>
              <p className="text-[11px] text-slate-400 font-mono">Running prompt v2 inference via OpenRouter</p>
            </div>
          ) : isQuotaLocked ? (
            /* Premium Monochrome Quota Locked State - Clean & Production Grade */
            <div className="py-14 px-4 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4 animate-fade-in">
              <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 shadow-sm">
                <Key className="h-5 w-5" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {quotaReason === "api_quota_exceeded" ? "OpenRouter Quota or Credit Limit Reached" : "AI Trial Quota Reached"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {quotaReason === "api_quota_exceeded"
                    ? "Your personal OpenRouter API key has exceeded its credit balance or rate limit. Update your key or top up balance in OpenRouter."
                    : `You have completed all ${TRIAL_LIMIT} complimentary trial generations for today.${timeUntilReset ? ` Quota automatically resets in ${timeUntilReset}.` : " Quota automatically replenishes every 24 hours."} Connect your personal OpenRouter API key in Settings for immediate unlimited generation.`}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-2.5">
                {onOpenSettings && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenSettings();
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <Key className="h-3.5 w-3.5" />
                    <span>Open API Key Settings</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : draft ? (
            <div key={tone} className="animate-tab-fade space-y-4">
              
              {/* Strategic Pitch Angle Highlight */}
              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 dark:text-slate-400">
                    {tone === "sdr_direct" ? "Technical Velocity Angle" : "Executive Risk & Audit Angle"}
                  </span>
                  <div className="flex items-center gap-2">
                    {appliedPrompt && (
                      <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-full border border-sky-200 dark:border-sky-800/40">
                        Custom prompt applied
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 font-mono">
                      {telemetry?.is_cached ? "From cache" : "Live generated"}
                    </span>
                  </div>
                </div>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">{draft.sales_angle}</p>
              </div>

              {/* Email Section */}
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-3 bg-slate-50/70 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Cold Email</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`Subject: ${draft.email.subject}\n\n${draft.email.body}`, "email")}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 transition-all shadow-sm"
                  >
                    {copiedType === "email" ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Email</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 space-y-3">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Subject:</span>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{draft.email.subject}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Body:</span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed mt-1">
                      {draft.email.body}
                    </p>
                  </div>
                </div>
              </div>

              {/* LinkedIn InMail Section */}
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-3 bg-slate-50/70 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">LinkedIn Direct Message</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(draft.linkedin_inmail.body, "linkedin")}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 transition-all shadow-sm"
                  >
                    {copiedType === "linkedin" ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Message</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4">
                  <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                    {draft.linkedin_inmail.body}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Applied Custom Instruction Badge (if active) */}
        {appliedPrompt && !isQuotaLocked && (
          <div className="px-6 py-2 bg-slate-100 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <Sparkles className="h-3.5 w-3.5 text-sky-500 shrink-0" />
              <span className="text-slate-500 shrink-0">Active Prompt:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200 truncate">&ldquo;{appliedPrompt}&rdquo;</span>
            </div>
            <button
              type="button"
              onClick={handleClearAppliedPrompt}
              className="text-[11px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium shrink-0 flex items-center gap-1"
              title="Clear custom prompt"
            >
              <X className="h-3 w-3" />
              <span>Reset to default</span>
            </button>
          </div>
        )}

        {/* Human-in-the-Loop Custom Prompt & Regeneration Bar */}
        <form
          onSubmit={handleRegenerate}
          className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0"
        >
          <div className="relative flex-1">
            <input
              type="text"
              disabled={isQuotaLocked || loading}
              placeholder={
                isQuotaLocked
                  ? "AI limit reached • Enter API key in Settings to continue..."
                  : "Custom instructions (e.g. 'Emphasize Kubernetes CVEs', 'Keep under 50 words')..."
              }
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/20 focus:border-slate-400 disabled:opacity-50"
            />
          </div>

          {isQuotaLocked ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSettings?.();
              }}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold transition-all shadow-sm shrink-0"
            >
              <Key className="h-3.5 w-3.5" />
              <span>Add API Key</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold transition-all shadow-sm disabled:opacity-50 shrink-0"
            >
              {loading ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              <span>Regenerate with AI</span>
            </button>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#0E131F] flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">
            Click between tones to preview different buyer perspectives
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
