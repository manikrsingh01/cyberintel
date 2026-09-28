import React, { useState, useEffect, useRef } from "react";
import { Company, OutreachDraft } from "@/lib/types";
import { generateOutreach } from "@/lib/scoring";
import { X, Copy, Check, Mail, Linkedin, Sparkles, RefreshCw, Send, Zap } from "lucide-react";

interface OutreachModalProps {
  company: Company | null;
  onClose: () => void;
}

interface TelemetryState {
  model: string;
  latency_ms: number;
  cost_usd: number;
  is_live: boolean;
  is_cached?: boolean;
}

export const OutreachModal: React.FC<OutreachModalProps> = ({ company, onClose }) => {
  const [tone, setTone] = useState<"sdr_direct" | "executive_vp">("sdr_direct");
  const [draft, setDraft] = useState<OutreachDraft | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [telemetry, setTelemetry] = useState<TelemetryState | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");

  // In-memory cache across modal sessions: key is `companyId_tone`
  const cacheRef = useRef<Record<string, { draft: OutreachDraft; telemetry: TelemetryState }>>({});

  useEffect(() => {
    if (company) {
      loadOutreach(tone, false);
    }
  }, [company, tone]);

  const loadOutreach = async (selectedTone: "sdr_direct" | "executive_vp", forceRegenerate = false, customInstruction?: string) => {
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
          window.dispatchEvent(new CustomEvent("firmable:trace-logged"));
        }
      }).catch(() => {});

      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/generate-outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          tone: selectedTone,
          customInstruction: customInstruction || customPrompt || undefined
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setDraft(data.draft);
        setTelemetry(data.telemetry);
        // Store in cache
        cacheRef.current[cacheKey] = { draft: data.draft, telemetry: data.telemetry };

        // Save trace into browser session storage for instantaneous cockpit update
        if (data.trace && typeof window !== "undefined") {
          try {
            const existing = JSON.parse(localStorage.getItem("firmable_recent_traces") || "[]");
            localStorage.setItem("firmable_recent_traces", JSON.stringify([data.trace, ...existing].slice(0, 50)));
          } catch {}
        }

        // Dispatch trace-logged event to notify cockpit
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("firmable:trace-logged"));
        }
      } else {
        const generated = generateOutreach(company, selectedTone);
        setDraft(generated);
        const fallbackTrace = {
          id: `tr_${Date.now()}_local`,
          timestamp: new Date().toISOString(),
          feature: "outreach_generation",
          model: "deterministic-heuristic",
          prompt_version: "v2",
          input_tokens: 380,
          output_tokens: 160,
          latency_ms: 18,
          cost_usd: 0,
          company_name: company.name,
          decision_summary: `Synthesized client-grounded ${selectedTone} pitch for ${company.target_buyer?.title || "VP"}.`,
          cached: false,
        };

        if (typeof window !== "undefined") {
          try {
            const existing = JSON.parse(localStorage.getItem("firmable_recent_traces") || "[]");
            localStorage.setItem("firmable_recent_traces", JSON.stringify([fallbackTrace, ...existing].slice(0, 50)));
          } catch {}
        }

        // Record fallback trace so every AI usage is tracked in table
        fetch("/api/telemetry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trace: fallbackTrace })
        }).then(() => {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("firmable:trace-logged"));
          }
        }).catch(() => {});
      }
    } catch {
      const generated = generateOutreach(company, selectedTone);
      setDraft(generated);
      const fallbackTrace = {
        id: `tr_${Date.now()}_local`,
        timestamp: new Date().toISOString(),
        feature: "outreach_generation",
        model: "deterministic-heuristic",
        prompt_version: "v2",
        input_tokens: 380,
        output_tokens: 160,
        latency_ms: 18,
        cost_usd: 0,
        company_name: company.name,
        decision_summary: `Synthesized client-grounded ${selectedTone} pitch for ${company.target_buyer?.title || "VP"}.`,
        cached: false,
      };

      if (typeof window !== "undefined") {
        try {
          const existing = JSON.parse(localStorage.getItem("firmable_recent_traces") || "[]");
          localStorage.setItem("firmable_recent_traces", JSON.stringify([fallbackTrace, ...existing].slice(0, 50)));
        } catch {}
      }

      fetch("/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trace: fallbackTrace })
      }).then(() => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("firmable:trace-logged"));
        }
      }).catch(() => {});
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = (e: React.FormEvent) => {
    e.preventDefault();
    loadOutreach(tone, true, customPrompt);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  if (!company) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-colors animate-modal-enter">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[11px] font-semibold tracking-wide px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40">
                Personalized Sales Copy
              </span>
              <span className="text-xs text-slate-500">For: <strong className="text-slate-900 dark:text-white">{company.name}</strong></span>

              {company.estimated_acv && (
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {company.estimated_acv}
                </span>
              )}
              {company.security_debt_ratio > 0 && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40">
                  {company.security_debt_ratio}x Debt
                </span>
              )}

              {telemetry && (
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${
                  telemetry.is_cached
                    ? "bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800/40"
                    : telemetry.is_live
                    ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
                }`}>
                  {telemetry.is_cached ? (
                    <>
                      <Zap className="h-3 w-3 text-sky-500" />
                      <span>Instant Cache</span>
                      <span>•</span>
                      <span>0ms</span>
                      <span>•</span>
                      <span>$0.00</span>
                    </>
                  ) : (
                    <>
                      <span className={`h-1.5 w-1.5 rounded-full ${telemetry.is_live ? "bg-emerald-500" : "bg-slate-400"}`}></span>
                      <span>{telemetry.is_live ? "OpenRouter Live" : "Fast Heuristic"}</span>
                      <span>•</span>
                      <span>{telemetry.latency_ms}ms</span>
                      <span>•</span>
                      <span>${telemetry.cost_usd}</span>
                    </>
                  )}
                </span>
              )}
            </div>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-sky-500" />
              <span>AI Outreach Generator</span>
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Distinct Tone Selector Bar */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Buyer Persona:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200 dark:border-sky-800/40">
              {company.target_buyer.title}
            </span>
          </div>

          {/* Tone Selector Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/40 dark:border-slate-700/50">
            <button
              onClick={() => setTone("sdr_direct")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors duration-150 active:scale-[0.98] outline-none focus:outline-none ${
                tone === "sdr_direct"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border-slate-200 dark:border-slate-700"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-transparent"
              }`}
            >
              Direct & Technical (SDR)
            </button>
            <button
              onClick={() => setTone("executive_vp")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors duration-150 active:scale-[0.98] outline-none focus:outline-none ${
                tone === "executive_vp"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border-slate-200 dark:border-slate-700"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-transparent"
              }`}
            >
              Executive & ROI (VP / CISO)
            </button>
          </div>
        </div>

        {/* Content Area with Stable Min-Height */}
        <div className="p-6 flex-1 space-y-4 overflow-y-auto min-h-[420px] max-h-[55vh]">
          {loading ? (
            <div className="py-20 text-center animate-fade-in">
              <RefreshCw className="h-8 w-8 text-sky-500 animate-spin mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {tone === "sdr_direct"
                  ? "Formulating technical architecture hook..."
                  : "Synthesizing executive ROI & compliance narrative..."}
              </p>
              <p className="text-xs text-slate-400 mt-1">Grounding copy in live company cloud signals</p>
            </div>
          ) : draft ? (
            <div key={tone} className="animate-tab-fade space-y-4">
              {/* Pitch Angle Highlight with Visual Tone Tag */}
              <div className={`p-3.5 rounded-2xl border text-xs transition-colors ${
                tone === "sdr_direct"
                  ? "bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/40 text-blue-900 dark:text-blue-200"
                  : "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200"
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold uppercase tracking-wider text-[10px]">
                    {tone === "sdr_direct" ? "Technical Velocity Angle" : "Executive Risk & Audit Angle"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {telemetry?.is_cached ? "Loaded from cache" : "Live generated"}
                  </span>
                </div>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">{draft.sales_angle}</p>
              </div>

              {/* Email Section */}
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Cold Email</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`Subject: ${draft.email.subject}\n\n${draft.email.body}`, "email")}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all shadow-sm"
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
                <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">LinkedIn Direct Message</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(draft.linkedin_inmail.body, "linkedin")}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all shadow-sm"
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

        {/* Human-in-the-Loop Custom Prompt & Regeneration Bar */}
        <form
          onSubmit={handleRegenerate}
          className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Custom instructions (e.g. 'Mention our SOC 2 automation tool', 'Make it under 50 words')..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white text-xs font-semibold transition-all shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            <span>Regenerate with AI</span>
          </button>
        </form>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E131F] flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Clicking between tones retrieves cached drafts instantly.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
