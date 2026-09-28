import React from "react";
import { FilterState } from "@/lib/types";
import { Search, X, ShieldAlert, Sparkles, Filter } from "lucide-react";

interface FilterBarProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  industries: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChange,
  industries
}) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value });
  };

  const handleTier = (tier: string) => {
    onChange({ ...filters, tier: filters.tier === tier ? "" : tier });
  };

  const handleIndustry = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, industry: e.target.value });
  };

  const handleSignal = (sig: string) => {
    onChange({
      ...filters,
      selectedSignalType: filters.selectedSignalType === sig ? "" : sig
    });
  };

  const resetFilters = () => {
    onChange({
      search: "",
      tier: "",
      industry: "",
      minScore: 0,
      selectedSignalType: ""
    });
  };

  const hasActiveFilters = Boolean(
    filters.search || filters.tier || filters.industry || filters.selectedSignalType
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3.5 transition-colors">
        {/* Search & Industry Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Field */}
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search companies, domains, tech stack (e.g. AWS, Kubernetes)..."
              value={filters.search}
              onChange={handleSearch}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-10 py-2 text-xs md:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:outline-none focus:border-sky-500 dark:focus:border-sky-500 focus:ring-0 focus-visible:outline-none transition-colors duration-150"
            />
            {filters.search && (
              <button
                onClick={() => onChange({ ...filters, search: "" })}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Industry Filter Selector */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={filters.industry}
                onChange={handleIndustry}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300 outline-none focus:outline-none focus:border-sky-500 dark:focus:border-sky-500 focus:ring-0 focus-visible:outline-none transition-colors duration-150 cursor-pointer"
              >
                <option value="">All Industries</option>
                {industries.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-medium transition-colors active:scale-95"
                title="Reset all active filters"
              >
                <X className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Priority Segment Tabs & Specific Intent Chips (Zero Emojis) */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          {/* Priority Segment Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
              Priority:
            </span>

            <button
              onClick={() => onChange({ ...filters, tier: "" })}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors duration-150 active:scale-[0.97] outline-none focus:outline-none ${
                filters.tier === ""
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold border-slate-900 dark:border-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border-transparent"
              }`}
            >
              All
            </button>

            <button
              onClick={() => handleTier("TIER_1_CRITICAL")}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors duration-150 active:scale-[0.97] outline-none focus:outline-none ${
                filters.tier === "TIER_1_CRITICAL"
                  ? "bg-rose-600 text-white font-semibold border-rose-600 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border-transparent"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
              <span>High Priority (Tier 1)</span>
            </button>

            <button
              onClick={() => handleTier("TIER_2_MODERATE")}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors duration-150 active:scale-[0.97] outline-none focus:outline-none ${
                filters.tier === "TIER_2_MODERATE"
                  ? "bg-amber-600 text-white font-semibold border-amber-600 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border-transparent"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
              <span>Moderate (Tier 2)</span>
            </button>

            <button
              onClick={() => handleTier("TIER_3_LOW")}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors duration-150 active:scale-[0.97] outline-none focus:outline-none ${
                filters.tier === "TIER_3_LOW"
                  ? "bg-sky-600 text-white font-semibold border-sky-600 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border-transparent"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-sky-500"></span>
              <span>Low (Tier 3)</span>
            </button>

            <button
              onClick={() => handleTier("DISQUALIFIED")}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors duration-150 active:scale-[0.97] outline-none focus:outline-none ${
                filters.tier === "DISQUALIFIED"
                  ? "bg-slate-600 text-white font-semibold border-slate-600 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border-transparent"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
              <span>Disqualified</span>
            </button>
          </div>

          {/* Buying Intent Triggers */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1 hidden md:inline">
              Triggers:
            </span>

            <button
              onClick={() => handleSignal("SECURITY_DEBT_DISPARITY")}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs border transition-colors duration-150 active:scale-[0.97] outline-none focus:outline-none ${
                filters.selectedSignalType === "SECURITY_DEBT_DISPARITY"
                  ? "bg-blue-600 text-white font-semibold border-blue-600"
                  : "bg-slate-100 dark:bg-slate-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-700 border-transparent"
              }`}
            >
              <ShieldAlert className="h-3 w-3" />
              <span>Dev Growth + 0 SecOps</span>
            </button>

            <button
              onClick={() => handleSignal("COMPLIANCE_DEADLINE")}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs border transition-colors duration-150 active:scale-[0.97] outline-none focus:outline-none ${
                filters.selectedSignalType === "COMPLIANCE_DEADLINE"
                  ? "bg-emerald-600 text-white font-semibold border-emerald-600"
                  : "bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-slate-700 border-transparent"
              }`}
            >
              <Sparkles className="h-3 w-3" />
              <span>Upcoming Audit / Mandate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
