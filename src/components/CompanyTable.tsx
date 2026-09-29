import React, { useState } from "react";
import { Company } from "@/lib/types";
import { Send, ChevronRight, ChevronLeft, AlertCircle, MapPin, Sparkles, ShieldAlert, ArrowUpRight } from "lucide-react";

interface TableProps {
  companies: Company[];
  onSelectCompany: (company: Company) => void;
  onOpenOutreach: (company: Company) => void;
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
}

export const CompanyTable: React.FC<TableProps> = ({
  companies,
  onSelectCompany,
  onOpenOutreach,
  currentPage = 1,
  totalPages = 1,
  totalCount = companies.length,
  pageSize = 20,
  onPageChange
}) => {
  const [jumpPage, setJumpPage] = useState("");
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
                const topSignal = company.buying_signals?.[0];
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
                            {topSignal.type === "CVE_VULNERABILITY" ? (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-900/40 truncate max-w-xs">
                                <ShieldAlert className="h-3 w-3 shrink-0 text-rose-500" />
                                <span className="truncate">{topSignal.headline}</span>
                              </span>
                            ) : topSignal.type === "EXPIRED_SSL" ? (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-900/40 truncate max-w-xs">
                                <Sparkles className="h-3 w-3 shrink-0 text-amber-500" />
                                <span className="truncate">{topSignal.headline}</span>
                              </span>
                            ) : topSignal.type === "DATABASE_EXPOSURE" ? (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/60 px-2 py-0.5 rounded-md border border-orange-200 dark:border-orange-900/40 truncate max-w-xs">
                                <ShieldAlert className="h-3 w-3 shrink-0 text-orange-500" />
                                <span className="truncate">{topSignal.headline}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 px-2 py-0.5 rounded-md border border-sky-200/70 dark:border-sky-900/40 truncate max-w-xs">
                                <Sparkles className="h-3 w-3 shrink-0 text-sky-500" />
                                <span className="truncate">{topSignal.headline}</span>
                              </span>
                            )}
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

        {/* Smooth Pagination Bar: Limit 20 per page */}
        {totalPages > 1 && onPageChange && (
          <div className="border-t border-slate-200 dark:border-slate-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/30">
            {/* Account count summary */}
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {((currentPage - 1) * pageSize) + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {Math.min(currentPage * pageSize, totalCount)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900 dark:text-white font-mono">
                {totalCount.toLocaleString()}
              </span>{" "}
              accounts (20 per page)
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Previous Page Button */}
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Previous page"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Prev</span>
              </button>

              {/* Page Number Buttons */}
              {(() => {
                if (totalPages <= 7) {
                  return Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => onPageChange(p)}
                      className={`min-w-8 h-8 px-2 rounded-lg text-xs font-medium transition-colors ${
                        currentPage === p
                          ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-sm"
                          : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {p}
                    </button>
                  ));
                }

                const pages: (number | string)[] = [];
                pages.push(1);
                if (currentPage > 3) pages.push("ellipsis-1");
                const start = Math.max(2, currentPage - 1);
                const end = Math.min(totalPages - 1, currentPage + 1);
                for (let i = start; i <= end; i++) {
                  pages.push(i);
                }
                if (currentPage < totalPages - 2) pages.push("ellipsis-2");
                pages.push(totalPages);

                return pages.map((p, idx) => {
                  if (typeof p === "string") {
                    return (
                      <span key={`dots-${idx}`} className="px-1 text-slate-400 text-xs">
                        ...
                      </span>
                    );
                  }
                  return (
                    <button
                      key={p}
                      onClick={() => onPageChange(p)}
                      className={`min-w-8 h-8 px-2 rounded-lg text-xs font-medium transition-colors ${
                        currentPage === p
                          ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-sm"
                          : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {p}
                    </button>
                  );
                });
              })()}

              {/* Next Page Button */}
              <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage >= totalPages}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Next page"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>

              {/* Quick Jump Input */}
              {totalPages > 5 && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const p = parseInt(jumpPage, 10);
                    if (!isNaN(p) && p >= 1 && p <= totalPages) {
                      onPageChange(p);
                      setJumpPage("");
                    }
                  }}
                  className="flex items-center gap-1 ml-2"
                >
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    placeholder="Go to"
                    value={jumpPage}
                    onChange={(e) => setJumpPage(e.target.value)}
                    className="w-14 h-8 px-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="submit"
                    className="h-8 px-2 text-xs rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                  >
                    Go
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
