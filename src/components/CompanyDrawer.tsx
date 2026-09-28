import React, { useState, useEffect } from "react";
import { Company } from "@/lib/types";
import { X, Users, Send, AlertTriangle, ShieldCheck, Lock, ExternalLink, DollarSign, Zap, Swords, Clock } from "lucide-react";

interface DrawerProps {
  company: Company | null;
  onClose: () => void;
  onDraftOutreach: (company: Company) => void;
}

export const CompanyDrawer: React.FC<DrawerProps> = ({
  company,
  onClose,
  onDraftOutreach
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [activeCompany, setActiveCompany] = useState<Company | null>(company);

  useEffect(() => {
    if (company) {
      setActiveCompany(company);
      setIsClosing(false);
    }
  }, [company]);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
      setActiveCompany(null);
    }, 290); // 290ms allows 280ms cubic-bezier(0.32, 0, 0.67, 0) animation to complete smoothly
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && (activeCompany || company) && !isClosing) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeCompany, company, isClosing]);

  const currentComp = activeCompany || company;
  if (!currentComp && !isClosing) return null;
  if (!currentComp) return null;

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-50 overflow-hidden bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm flex justify-end ${
        isClosing ? "animate-fade-out" : "animate-fade-in"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-xl bg-white dark:bg-[#0E131F] border-l border-slate-200 dark:border-slate-800 h-full overflow-y-auto shadow-2xl flex flex-col transition-colors ${
          isClosing ? "animate-drawer-slide-out" : "animate-drawer-slide"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                currentComp.risk_tier === "TIER_1_CRITICAL"
                  ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40"
                  : currentComp.risk_tier === "TIER_2_MODERATE"
                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              }`}>
                {currentComp.risk_tier.replace("_", " ")}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Score: <strong className="text-slate-900 dark:text-white font-mono">{currentComp.cyber_risk_score}/100</strong>
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{currentComp.name}</h2>
            <a
              href={`https://${currentComp.domain}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 font-mono mt-0.5"
            >
              <span>{currentComp.domain}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 space-y-6">
          {/* Real Sales Outcome: Deal Size & Urgency Bar */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Est. ACV</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">{currentComp.estimated_acv || "$28,000 / yr"}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Security Debt</span>
              <span className="text-sm font-bold text-rose-600 dark:text-rose-400 font-mono">
                {currentComp.security_debt_ratio ? `${currentComp.security_debt_ratio}x Debt` : "Low"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Urgency SLA</span>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 line-clamp-1">
                {currentComp.audit_countdown_label || "24h SLA"}
              </span>
            </div>
          </div>

          {/* Sales Battlecard: Objection Killer (Innovative Hook) */}
          {currentComp.sales_battlecard && (
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40">
              <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Swords className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span>Sales Battlecard: Objection Killer</span>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-amber-800 dark:text-amber-400/90 font-semibold block text-[11px]">Anticipated Buyer Objection:</span>
                  <p className="text-slate-800 dark:text-slate-200 italic font-serif mt-0.5">
                    {currentComp.sales_battlecard.primary_objection}
                  </p>
                </div>
                <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/40">
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold block text-[11px]">Winning Counter Hook:</span>
                  <p className="text-slate-700 dark:text-slate-300 mt-0.5 font-medium leading-relaxed">
                    {currentComp.sales_battlecard.counter_hook}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Executive Rationale Box */}
          <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/40">
            <div className="flex items-center gap-2 text-sky-800 dark:text-sky-300 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              <span>Assessment Summary</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {currentComp.rationale || "Scored based on cloud infrastructure complexity, headcount growth without dedicated security staff, and compliance observation windows."}
            </p>
          </div>

          {/* Detected Buying Signals */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span>Observed Buying Signals ({currentComp.buying_signals.length})</span>
            </h3>

            {currentComp.buying_signals.length > 0 ? (
              <div className="space-y-2.5">
                {currentComp.buying_signals.map((signal, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{signal.headline}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        signal.severity === "CRITICAL"
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40"
                      }`}>
                        {signal.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-0.5">
                      {signal.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No acute buying signals observed.</p>
            )}
          </div>

          {/* Target Buyer & Key Pain Point */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>Recommended Target Decision-Maker</span>
            </h3>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{currentComp.target_buyer.title}</p>
            <div className="mt-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-blue-600 dark:text-blue-400 font-semibold block mb-0.5">Primary Pain Point:</span>
              {currentComp.target_buyer.pain_point}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-400 block mb-0.5">Industry Sector</span>
              <span className="font-semibold text-slate-900 dark:text-white">{currentComp.industry}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-400 block mb-0.5">Estimated Revenue</span>
              <span className="font-semibold text-slate-900 dark:text-white">{currentComp.annual_revenue}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-400 block mb-0.5">Engineering Growth</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">+{currentComp.engineering_growth_6m_pct}% in 6 mos</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-400 block mb-0.5">Internal Security Headcount</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">
                {currentComp.security_headcount === 0 ? "0 (Severe Disparity)" : `${currentComp.security_headcount} staff`}
              </span>
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Cloud & Tech Stack
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {currentComp.tech_stack.map((tech, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Compliance Frameworks */}
          {currentComp.compliance_mandates.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-sky-500" />
                <span>Compliance & Audit Regimes</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {currentComp.compliance_mandates.map((m, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-xs font-medium border border-sky-200 dark:border-sky-900/40"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors outline-none focus:outline-none active:scale-95"
          >
            Close
          </button>

          <button
            onClick={() => {
              handleClose();
              setTimeout(() => onDraftOutreach(currentComp), 120);
            }}
            disabled={currentComp.risk_tier === "DISQUALIFIED"}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Draft Tailored Outreach</span>
          </button>
        </div>
      </div>
    </div>
  );
};
