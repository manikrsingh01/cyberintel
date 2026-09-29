import React from "react";
import { Company, FilterCounts } from "@/lib/types";
import { Building2, AlertTriangle, ShieldCheck, Scale } from "lucide-react";

interface MetricsProps {
  companies: Company[];
  counts?: FilterCounts;
}

export const MetricsSummary: React.FC<MetricsProps> = ({ companies, counts }) => {
  const total = counts?.total || companies.length;
  const tier1Count = counts?.tier1 !== undefined ? counts.tier1 : companies.filter(c => c.risk_tier === "TIER_1_CRITICAL").length;
  const avgScore = companies.length > 0
    ? Math.round(companies.reduce((acc, c) => acc + c.cyber_risk_score, 0) / companies.length)
    : 0;
  const compliancePressureCount = companies.filter(c => c.compliance_mandates.length > 0).length;

  return (
    <div className="max-w-7xl mx-auto px-6 pt-6 pb-2">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Total Monitored Accounts */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Accounts</span>
            <div className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
              <Building2 className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">{total}</span>
            <span className="text-[11px] text-slate-500 font-medium">in territory</span>
          </div>
        </div>

        {/* Metric 2: Tier 1 Immediate Outreach */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0E131F] border border-rose-200/80 dark:border-rose-950/60 shadow-sm transition-all hover:border-rose-300 dark:hover:border-rose-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">Immediate Outreach</span>
            <div className="h-7 w-7 rounded-lg bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <AlertTriangle className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400 font-mono">{tier1Count}</span>
            <span className="text-[11px] text-rose-600/80 dark:text-rose-400/80 font-medium">Tier 1 urgency</span>
          </div>
        </div>

        {/* Metric 3: Avg Cyber Risk Score */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Avg Propensity</span>
            <div className="h-7 w-7 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              {avgScore}
              <span className="text-xs text-slate-400 font-normal"> / 100</span>
            </span>
            <span className="text-[11px] text-slate-500 font-medium">intent index</span>
          </div>
        </div>

        {/* Metric 4: Compliance Audits Pressure */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Compliance Catalysts</span>
            <div className="h-7 w-7 rounded-lg bg-sky-50 dark:bg-sky-950/50 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Scale className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">{compliancePressureCount}</span>
            <span className="text-[11px] text-slate-500 font-medium">mandated accounts</span>
          </div>
        </div>
      </div>
    </div>
  );
};
