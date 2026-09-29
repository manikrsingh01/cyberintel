import React, { useState, useEffect } from "react";
import { 
  X, Key, ShieldCheck, Check, AlertCircle, ExternalLink, 
  Trash2, Eye, EyeOff, Sparkles, RefreshCw, Zap, Server
} from "lucide-react";
import { 
  getCustomApiKey, 
  setCustomApiKey, 
  clearCustomApiKey, 
  getTrialUsed, 
  getTrialRemaining, 
  getTimeUntilReset,
  TRIAL_LIMIT,
  hasCustomApiKey 
} from "@/lib/apiKeyManager";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onKeySaved
}) => {
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [savedKey, setSavedKey] = useState("");
  const [trialUsed, setTrialUsed] = useState(0);
  const [trialRemaining, setTrialRemaining] = useState(TRIAL_LIMIT);
  const [resetCountdown, setResetCountdown] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifiedLabel, setVerifiedLabel] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const current = getCustomApiKey();
      setSavedKey(current);
      setApiKeyInput(current);
      setTrialUsed(getTrialUsed());
      setTrialRemaining(getTrialRemaining());
      setResetCountdown(getTimeUntilReset());
      setSavedSuccess(false);
      setVerifyError(null);
      setIsVerifying(false);
    }
  }, [isOpen]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanKey = apiKeyInput.trim();

    if (!cleanKey) {
      setVerifyError("Please enter an OpenRouter API key.");
      return;
    }

    setIsVerifying(true);
    setVerifyError(null);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/verify-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: cleanKey }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.valid) {
        // Key is working & verified! Save to client storage
        setCustomApiKey(cleanKey);
        setSavedKey(cleanKey);
        setVerifiedLabel(data.label || "Verified");
        setSavedSuccess(true);
        setVerifyError(null);
        if (onKeySaved) onKeySaved();
      } else {
        // Key failed verification - DO NOT SAVE!
        setVerifyError(data.error || "API key does not work. Please check your credentials and try again.");
        setSavedSuccess(false);
      }
    } catch (err: any) {
      setVerifyError(err?.message || "Failed connecting to verification service. Please try again.");
      setSavedSuccess(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClear = () => {
    clearCustomApiKey();
    setSavedKey("");
    setApiKeyInput("");
    setSavedSuccess(false);
    setVerifyError(null);
    setVerifiedLabel(null);
    if (onKeySaved) onKeySaved();
  };

  if (!isOpen) return null;

  const hasKey = Boolean(savedKey.trim());
  const trialExhausted = !hasKey && trialRemaining <= 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-colors animate-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>AI Inference &amp; API Key Settings</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure verified OpenRouter credentials or monitor trial quota
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close settings"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Active Provider Status Card */}
          <div className={`p-4 rounded-2xl border transition-all ${
            hasKey
              ? "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700"
              : trialExhausted
              ? "bg-slate-50 dark:bg-slate-900/60 border-slate-300 dark:border-slate-700"
              : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800"
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${
                    hasKey ? "bg-emerald-500 animate-pulse" : trialExhausted ? "bg-amber-500" : "bg-sky-500 animate-pulse"
                  }`}></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {hasKey ? "Personal Key Active & Verified" : trialExhausted ? "Trial Quota Exhausted" : "Edge Trial Mode"}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {hasKey
                    ? "Inference runs directly via your verified OpenRouter account with no platform generation caps."
                    : trialExhausted
                    ? `You have used all ${TRIAL_LIMIT} daily complimentary generations.${resetCountdown ? ` Quota resets in ${resetCountdown}.` : " Quota automatically replenishes every 24 hours."} Connect your OpenRouter key below for unlimited generation.`
                    : `Running on complimentary edge trial quota. ${trialRemaining} of ${TRIAL_LIMIT} daily generations remaining.${resetCountdown ? ` (Resets in ${resetCountdown})` : " (Resets every 24h)"}`}
                </p>
              </div>

              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded-full shrink-0 ${
                hasKey
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                  : trialExhausted
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                  : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
              }`}>
                {hasKey ? "UNLIMITED" : `${trialRemaining} LEFT`}
              </span>
            </div>

            {/* Trial progress bar (if using default trial) */}
            {!hasKey && (
              <div className="mt-3.5 space-y-1.5">
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>Trial Usage: {trialUsed} / {TRIAL_LIMIT} used</span>
                  <span>{Math.round((trialUsed / TRIAL_LIMIT) * 100)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-500 rounded-full bg-slate-600 dark:bg-slate-400"
                    style={{ width: `${Math.min(100, (trialUsed / TRIAL_LIMIT) * 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* API Key Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <span>OpenRouter API Key</span>
                </label>
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline flex items-center gap-1 font-medium"
                >
                  <span>Get OpenRouter Key</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={apiKeyInput}
                  disabled={isVerifying}
                  onChange={(e) => {
                    setApiKeyInput(e.target.value);
                    if (verifyError) setVerifyError(null);
                  }}
                  placeholder="sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3.5 py-2.5 pr-20 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all disabled:opacity-50"
                />

                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    title={showKey ? "Hide key" : "Show key"}
                  >
                    {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>

                  {hasKey && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Clear custom key"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Key will be tested against OpenRouter before saving to ensure active status.
              </p>
            </div>

            {/* Verification Error Box */}
            {verifyError && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-300 animate-fade-in">
                <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">API Key Verification Failed</p>
                  <p className="text-[11px] text-rose-700 dark:text-rose-400 mt-0.5 leading-relaxed">{verifyError}</p>
                </div>
              </div>
            )}

            {/* Verification Success Box */}
            {savedSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300 animate-fade-in">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <div>
                  <p className="font-semibold">API Key Verified &amp; Saved Successfully</p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                    Connected to OpenRouter {verifiedLabel ? `(${verifiedLabel})` : ""}. Unlimited inference is active.
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <div>
                {hasKey && (
                  <button
                    type="button"
                    onClick={handleClear}
                    disabled={isVerifying}
                    className="px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                  >
                    Revert to Trial Default
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isVerifying || !apiKeyInput.trim() || apiKeyInput.trim() === savedKey}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-1.5"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Verifying with OpenRouter...</span>
                    </>
                  ) : (
                    <>
                      <Key className="h-3.5 w-3.5" />
                      <span>Verify &amp; Save Key</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Privacy & Edge Security Guarantees */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Local Storage &amp; Zero Disk Logging</span>
            </div>
            <ul className="text-slate-500 dark:text-slate-400 space-y-1.5 leading-relaxed text-[11px]">
              <li>• <strong>Browser Storage Only:</strong> Your verified key is stored strictly inside your browser&apos;s <code className="font-mono text-[10px]">localStorage</code>.</li>
              <li>• <strong>Stateless Forwarding:</strong> Custom keys are passed as an encrypted HTTPS header (<code className="font-mono text-[10px]">x-openrouter-key</code>) directly to the upstream LLM gateway.</li>
              <li>• <strong>Zero Persistence:</strong> Your key is never logged to server logs, database, or analytics traces.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Server className="h-3.5 w-3.5 text-slate-400" />
            <span>Gateway: OpenRouter API v1</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
