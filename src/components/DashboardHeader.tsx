import React, { useState, useRef, useEffect } from "react";
import { Sun, Moon, UploadCloud, BarChart2, Download, Sliders, ChevronDown, CheckCircle2, Shield, BookOpen, Key, Settings } from "lucide-react";

interface HeaderProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenUpload: () => void;
  onOpenEvals: () => void;
  onOpenObservability?: () => void;
  onExportCsv?: () => void;
  onOpenDocs?: () => void;
  onOpenSettings?: () => void;
}

export const DashboardHeader: React.FC<HeaderProps> = ({
  darkMode,
  onToggleTheme,
  onOpenUpload,
  onOpenEvals,
  onOpenObservability,
  onExportCsv,
  onOpenDocs,
  onOpenSettings
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F17] sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand & Workspace Identity */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0.5 shrink-0 flex items-center justify-center">
            <img
              src="/logo.png"
              alt="CyberIntel Logo"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                Cyber<span className="text-sky-600 dark:text-sky-400 font-semibold">Intel</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                Live Territory
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              B2B Cybersecurity Prospecting & Real-Time Buying Intent
            </p>
          </div>
        </div>

        {/* Action Controls & Progressive Disclosure Menu */}
        <div className="flex items-center gap-2.5">
          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className="h-9 w-9 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
          </button>

          {/* Quick Import Button (Primary SDR tool) */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 h-9 px-4 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold transition-all shadow-sm active:scale-[0.98]"
          >
            <UploadCloud className="h-3.5 w-3.5" />
            <span>Import CSV</span>
          </button>

          {/* Interactive Documentation & Interviewer Guide Button */}
          {onOpenDocs && (
            <button
              onClick={onOpenDocs}
              className="flex items-center gap-1.5 h-9 px-3.5 rounded-full border border-sky-500/30 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 text-xs font-semibold transition-all shadow-sm active:scale-[0.98]"
              title="Open Technical Documentation, Architecture & Formulas"
            >
              <BookOpen className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
              <span>Docs</span>
            </button>
          )}

          {/* API Key & Quota Settings Button (1-Click Header Access) */}
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 h-9 px-3 rounded-full border border-amber-500/30 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 text-xs font-semibold transition-all shadow-sm active:scale-[0.98]"
              title="Configure Personal OpenRouter API Key & View Quota"
            >
              <Key className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline">API Key</span>
            </button>
          )}

          {/* Secondary Tools & Settings Dropdown Menu (Hick's Law - Keep Clean) */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-1.5 h-9 px-3 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition-all duration-150 active:scale-[0.98]"
              aria-expanded={menuOpen}
            >
              <Sliders className="h-3.5 w-3.5 text-slate-500" />
              <span>Tools</span>
              <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-modal-enter">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800/80 mb-1">
                  AI Engineering & Utilities
                </div>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenEvals();
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <BarChart2 className="h-4 w-4 text-sky-500" />
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">AI Scoring Accuracy</p>
                      <p className="text-[11px] text-slate-400">95% Precision Benchmark</p>
                    </div>
                  </div>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                </button>

                {onOpenObservability && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenObservability();
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2 transition-colors"
                  >
                    <Sliders className="h-4 w-4 text-emerald-500" />
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Traces &amp; Cost Cockpit</p>
                      <p className="text-[11px] text-slate-400">Telemetry logs • $1.57/10k math</p>
                    </div>
                  </button>
                )}

                {onExportCsv && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onExportCsv();
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2 transition-colors"
                  >
                    <Download className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Export Filtered Leads</p>
                      <p className="text-[11px] text-slate-400">Download CSV format</p>
                    </div>
                  </button>
                )}

                <div className="border-t border-slate-100 dark:border-slate-800/80 my-1"></div>

                <div className="px-3.5 py-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>Model: GPT-4o-mini Hybrid</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
