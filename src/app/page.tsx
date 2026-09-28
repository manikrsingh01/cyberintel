"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Company, FilterState } from "@/lib/types";
import { initialCompanies } from "@/lib/mockData";
import { scoreCompanyHybrid } from "@/lib/scoring";
import { DashboardHeader } from "@/components/DashboardHeader";
import { MetricsSummary } from "@/components/MetricsSummary";
import { FilterBar } from "@/components/FilterBar";
import { CompanyTable } from "@/components/CompanyTable";
import { CompanyDrawer } from "@/components/CompanyDrawer";
import { OutreachModal } from "@/components/OutreachModal";
import { EvalModal } from "@/components/EvalModal";
import { ObservabilityModal } from "@/components/ObservabilityModal";
import { CsvUploadModal } from "@/components/CsvUploadModal";

export default function DashboardPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [outreachCompany, setOutreachCompany] = useState<Company | null>(null);

  // Modals state
  const [isEvalOpen, setIsEvalOpen] = useState(false);
  const [isObservabilityOpen, setIsObservabilityOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    tier: "",
    industry: "",
    minScore: 0,
    selectedSignalType: ""
  });

  // Theme synchronization with root HTML
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  // Extract unique industries for dropdown
  const industries = useMemo(() => {
    return Array.from(new Set(companies.map(c => c.industry))).filter(Boolean);
  }, [companies]);

  // Filtered & Sorted companies
  const filteredCompanies = useMemo(() => {
    return companies
      .filter((company) => {
        // Search filter
        if (filters.search) {
          const q = filters.search.toLowerCase();
          const matchName = company.name.toLowerCase().includes(q);
          const matchDomain = company.domain.toLowerCase().includes(q);
          const matchTech = company.tech_stack.some(t => t.toLowerCase().includes(q));
          const matchSignals = company.buying_signals.some(s => s.headline.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
          if (!matchName && !matchDomain && !matchTech && !matchSignals) {
            return false;
          }
        }

        // Tier filter
        if (filters.tier && company.risk_tier !== filters.tier) {
          return false;
        }

        // Industry filter
        if (filters.industry && company.industry !== filters.industry) {
          return false;
        }

        // Specific signal type filter
        if (filters.selectedSignalType) {
          const hasSignal = company.buying_signals.some(s => s.type === filters.selectedSignalType);
          if (!hasSignal) return false;
        }

        return true;
      })
      .sort((a, b) => b.cyber_risk_score - a.cyber_risk_score);
  }, [companies, filters]);

  // Ingestion handler with Optimistic Scoring & Async Live LLM Refinement
  const handleIngestCompanies = async (newRawCompanies: Partial<Company>[]) => {
    const scoredList = newRawCompanies.map(c => scoreCompanyHybrid(c));
    setCompanies(prev => [...scoredList, ...prev]);

    // If a single company is added, refine with live OpenRouter LLM scoring
    if (newRawCompanies.length === 1) {
      try {
        const res = await fetch("/api/score-account", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ company: newRawCompanies[0] }),
        });
        if (res.ok) {
          const { company: liveScored } = await res.json();
          setCompanies(prev => prev.map(c => c.id === scoredList[0].id ? liveScored : c));
        }
      } catch (e) {
        console.warn("Background live LLM scoring fallback maintained:", e);
      }
    }
  };

  // CSV Export utility
  const handleExportCsv = () => {
    const headers = ["Company", "Domain", "Industry", "Score", "Tier", "Headcount", "Growth %", "Security Staff", "Top Signal"];
    const rows = filteredCompanies.map(c => [
      `"${c.name}"`,
      `"${c.domain}"`,
      `"${c.industry}"`,
      c.cyber_risk_score,
      `"${c.risk_tier}"`,
      c.headcount,
      c.engineering_growth_6m_pct,
      c.security_headcount,
      `"${(c.buying_signals[0]?.headline || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `cyberintel_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Navigation Header with Light/Dark Mode Switch & Tools Dropdown */}
      <DashboardHeader
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenEvals={() => setIsEvalOpen(true)}
        onOpenObservability={() => setIsObservabilityOpen(true)}
        onExportCsv={handleExportCsv}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* KPI Metrics Summary */}
        <MetricsSummary companies={companies} />

        {/* Search, Tier & Signal Filters */}
        <FilterBar
          filters={filters}
          onChange={setFilters}
          industries={industries}
        />

        {/* Interactive Pipeline Accounts Table */}
        <CompanyTable
          companies={filteredCompanies}
          onSelectCompany={(comp) => setSelectedCompany(comp)}
          onOpenOutreach={(comp) => setOutreachCompany(comp)}
        />
      </main>

      {/* Clean, Simple Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0B0F17] py-6 px-6 text-center text-xs text-slate-500 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Firmable Take-Home Submission • AI Sales Intelligence Platform</p>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>Real-time Sales Intelligence Active</span>
          </div>
        </div>
      </footer>

      {/* Slide-out Company Detail Drawer */}
      <CompanyDrawer
        company={selectedCompany}
        onClose={() => setSelectedCompany(null)}
        onDraftOutreach={(comp) => {
          setSelectedCompany(null);
          setOutreachCompany(comp);
        }}
      />

      {/* AI Outreach Copilot Modal */}
      <OutreachModal
        company={outreachCompany}
        onClose={() => setOutreachCompany(null)}
      />

      {/* Evaluation Benchmark Scorecard Modal */}
      <EvalModal
        isOpen={isEvalOpen}
        onClose={() => setIsEvalOpen(false)}
      />

      {/* Observability, Telemetry & Cost Cockpit Modal */}
      <ObservabilityModal
        isOpen={isObservabilityOpen}
        onClose={() => setIsObservabilityOpen(false)}
      />

      {/* Ingestion & CSV Upload Modal */}
      <CsvUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onIngestCompanies={handleIngestCompanies}
      />
    </div>
  );
}
