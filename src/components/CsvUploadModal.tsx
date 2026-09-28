import React, { useState } from "react";
import { Company } from "@/lib/types";
import { X, UploadCloud, FileText } from "lucide-react";

interface CsvUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onIngestCompanies: (companies: Partial<Company>[]) => void;
}

export const CsvUploadModal: React.FC<CsvUploadProps> = ({
  isOpen,
  onClose,
  onIngestCompanies
}) => {
  const [activeTab, setActiveTab] = useState<"manual" | "file">("manual");

  // Form State
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [industry, setIndustry] = useState("Fintech & Payments");
  const [headcount, setHeadcount] = useState(150);
  const [cloud, setCloud] = useState("AWS (Multi-Region) + Kubernetes");
  const [techStack, setTechStack] = useState("AWS, Kubernetes, PostgreSQL");
  const [compliance, setCompliance] = useState("SOC 2 Type II, PCI-DSS");
  const [growth, setGrowth] = useState(35);
  const [secHeadcount, setSecHeadcount] = useState(0);
  const [triggers, setTriggers] = useState("Series B closed; scaling developer headcount; upcoming SOC 2 audit.");

  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !domain) return;

    const newCompany: Partial<Company> = {
      name,
      domain,
      industry,
      headcount: Number(headcount),
      location: "San Francisco / Remote",
      annual_revenue: "$20M+",
      cloud_environment: cloud,
      tech_stack: techStack.split(",").map(s => s.trim()),
      compliance_mandates: compliance ? compliance.split(",").map(s => s.trim()) : [],
      engineering_growth_6m_pct: Number(growth),
      security_headcount: Number(secHeadcount),
      recent_triggers: triggers
    };

    onIngestCompanies([newCompany]);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").filter(l => l.trim().length > 0);
      if (lines.length <= 1) return;

      const parsed: Partial<Company>[] = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(",");
        if (parts.length >= 3) {
          parsed.push({
            name: parts[1]?.trim() || `Company ${i}`,
            domain: parts[2]?.trim() || `company${i}.com`,
            industry: parts[3]?.trim() || "Technology",
            headcount: Number(parts[4]) || 120,
            location: parts[5]?.trim() || "Global",
            annual_revenue: parts[6]?.trim() || "$15M",
            cloud_environment: parts[7]?.trim() || "AWS",
            tech_stack: (parts[8] || "AWS, Docker").split(";").map(s => s.trim()),
            compliance_mandates: (parts[9] || "").split(";").map(s => s.trim()).filter(Boolean),
            engineering_growth_6m_pct: Number(parts[10]) || 20,
            security_headcount: Number(parts[11]) || 0,
            recent_triggers: parts[14]?.trim() || "Scaling dev team"
          });
        }
      }

      if (parsed.length > 0) {
        onIngestCompanies(parsed);
        onClose();
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-colors animate-modal-enter">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UploadCloud className="h-5 w-5 text-sky-500" />
              <span>Import Prospect Accounts</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Add a single company or upload a CSV file
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex gap-2">
          <button
            onClick={() => setActiveTab("manual")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === "manual"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            Single Company
          </button>
          <button
            onClick={() => setActiveTab("file")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === "file"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            Upload CSV
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {activeTab === "file" ? (
            <div className="space-y-4">
              <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-sky-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-900/50">
                <FileText className="h-10 w-10 text-sky-500 mb-2" />
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Click or drag CSV file here</span>
                <span className="text-xs text-slate-400 mt-1">Accepts standard company spreadsheet exports</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-300 font-semibold block mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Acme HealthTech"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-300 font-semibold block mb-1">Domain *</label>
                  <input
                    type="text"
                    required
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="e.g. acmehealth.io"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-300 font-semibold block mb-1">Industry</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="Fintech & Payments">Fintech & Payments</option>
                    <option value="Digital Health / Healthcare">Digital Health</option>
                    <option value="Enterprise SaaS">Enterprise SaaS</option>
                    <option value="E-Commerce & Retail">E-Commerce</option>
                    <option value="Logistics & Supply Chain">Logistics</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 dark:text-slate-300 font-semibold block mb-1">Headcount</label>
                  <input
                    type="number"
                    value={headcount}
                    onChange={(e) => setHeadcount(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-slate-600 dark:text-slate-300 font-semibold block mb-1">Security Staff</label>
                  <input
                    type="number"
                    value={secHeadcount}
                    onChange={(e) => setSecHeadcount(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-300 font-semibold block mb-1">Dev Growth % (6m)</label>
                  <input
                    type="number"
                    value={growth}
                    onChange={(e) => setGrowth(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-300 font-semibold block mb-1">Compliance Frameworks</label>
                  <input
                    type="text"
                    value={compliance}
                    onChange={(e) => setCompliance(e.target.value)}
                    placeholder="SOC 2, HIPAA, PCI-DSS"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-300 font-semibold block mb-1">Recent Company News / Triggers</label>
                <textarea
                  rows={2}
                  value={triggers}
                  onChange={(e) => setTriggers(e.target.value)}
                  placeholder="e.g. Raised Series B; scaling merchant API; 60 days to SOC 2 audit."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-sky-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-all shadow-sm hover:scale-105"
              >
                Add Account & Calculate Score
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
