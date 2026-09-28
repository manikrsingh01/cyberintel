import React from "react";
import { Company } from "@/lib/types";
import { Send, ChevronRight, AlertCircle, MapPin, Sparkles, ShieldAlert, ArrowUpRight } from "lucide-react";

interface TableProps {
  companies: Company[];
  onSelectCompany: (company: Company) => void;
  onOpenOutreach: (company: Company) => void;
}

export const CompanyTable: React.FC<TableProps> = ({
  companies,
  onSelectCompany,
  onOpenOutreach
}) => {
  if (companies.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 shadow-sm">
          <AlertCircle className="h-9 w-9 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No matching accounts found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, priority tier, or specific intent trigger.
          </p>
        </div>
      </div>
    );
  }

  const getTierBadge = (tier: Company["risk_tier"], score: number) => {
    switch (tier) {
      case "TIER_1_CRITICAL":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/40">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
            Tier 1 ({score})
          </span>
        );
      case "TIER_2_MODERATE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-900/40">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
            Tier 2 ({score})
          </span>
        );
      case "TIER_3_LOW":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 border border-sky-200/80 dark:border-sky-900/40">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500"></span>
            Tier 3 ({score})
          </span>
        );
      case "DISQUALIFIED":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
            Disqualified
          </span>
        );
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .slice(0, 2)
      .map(w => w[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-12">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E131F] overflow-hidden shadow-sm transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <tr>
                <th className="py-3.5 px-5">Account</th>
                <th className="py-3.5 px-4">Propensity</th>
                <th className="py-3.5 px-4">Why Reach Out Now? (Trigger Signals)</th>
                <th className="py-3.5 px-4">Cloud & Compliance</th>
                <th className="py-3.5 px-4">Est. ACV & Security Debt</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {companies.map((company) => {
                const topSignal = company.buying_signals[0];
                return (
                  <tr
                    key={company.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectCompany(company)}
                  >
                    {/* Account Name & Location */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                          {getInitials(company.name)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                            {company.name}
                          </p>
                          <p className="text-xs text-slate-400 font-mono">{company.domain}</p>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            <span>{company.location}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Cyber Fit Score & Tier Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {getTierBadge(company.risk_tier, company.cyber_risk_score)}
                    </td>

                    {/* Key Detected Buying Signals & Audit Countdown */}
                    <td className="py-4 px-4 max-w-sm">
                      <div className="flex flex-col gap-1.5">
                        {company.audit_countdown_label && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200/80 dark:border-amber-900/40 w-fit">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            {company.audit_countdown_label}
                          </span>
                        )}
                        {topSignal ? (
                          <div>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 px-2 py-0.5 rounded-md border border-sky-200/70 dark:border-sky-900/40 truncate max-w-xs">
                              <Sparkles className="h-3 w-3 shrink-0 text-sky-500" />
                              <span className="truncate">{topSignal.headline}</span>
                            </span>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 leading-normal mt-0.5">
                              {topSignal.description}
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">No acute warning signal</span>
                        )}
                      </div>
                    </td>

                    {/* Cloud & Compliance */}
                    <td className="py-4 px-4">
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{company.cloud_environment}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {company.compliance_mandates.slice(0, 2).map((m, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Deal Value & Security Debt */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                          {company.estimated_acv}
                        </span>
                        {company.security_debt_ratio > 0 && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                            company.security_debt_ratio >= 25
                              ? "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border-rose-200 dark:border-rose-900/40"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                          }`}>
                            {company.security_debt_ratio}x Debt
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                        +{company.engineering_growth_6m_pct}% dev growth
                      </p>
                      {company.security_headcount === 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded mt-0.5">
                          <ShieldAlert className="h-3 w-3 text-rose-600" />
                          0 SecOps hires
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          {company.security_headcount} SecOps staff
                        </span>
                      )}
                    </td>

                    {/* Action: Clean Outreach Action */}
                    <td className="py-4 px-5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onOpenOutreach(company)}
                          disabled={company.risk_tier === "DISQUALIFIED"}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            company.risk_tier === "DISQUALIFIED"
                              ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                              : "bg-sky-600 hover:bg-sky-500 text-white shadow-sm"
                          }`}
                        >
                          <Send className="h-3 w-3" />
                          <span>Reach Out</span>
                        </button>

                        <button
                          onClick={() => onSelectCompany(company)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                          title="View Details"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
