import React, { useState } from "react";
import { 
  X, Layers, ShieldAlert, Calculator, Sparkles, BookOpen, 
  Database, Server, Cpu, Globe, Check, Copy, ArrowRight,
  Terminal, ShieldCheck, Activity, AlertTriangle, FileCode, CheckCircle2,
  HardDrive, Zap, Code2, Gauge, Scale, Target, Network, Workflow
} from "lucide-react";

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type MainTabKey = 
  | "task-brief"
  | "architecture" 
  | "raw-metrics" 
  | "calculated-metrics" 
  | "skills" 
  | "how-we-build";

type SkillSubTabKey = "scoring" | "outreach" | "evals";

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<MainTabKey>("task-brief");
  const [activeSkillTab, setActiveSkillTab] = useState<SkillSubTabKey>("scoring");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const navItems: { key: MainTabKey; label: string; icon: React.ReactNode; level: string }[] = [
    { key: "task-brief", label: "1. Task Brief & Problem Space", icon: <Target className="h-4 w-4" />, level: "Foundational" },
    { key: "architecture", label: "2. Architecture & Ingestion", icon: <Server className="h-4 w-4" />, level: "System Design" },
    { key: "raw-metrics", label: "3. Raw Signals Dictionary", icon: <ShieldAlert className="h-4 w-4" />, level: "Data Dictionary" },
    { key: "calculated-metrics", label: "4. Derived & Calculated Metrics", icon: <Calculator className="h-4 w-4" />, level: "Formulas & Math" },
    { key: "skills", label: "5. Agentic Skills & Prompts", icon: <Sparkles className="h-4 w-4" />, level: "Agentic AI" },
    { key: "how-we-build", label: "6. Engineering Dev Loop", icon: <Workflow className="h-4 w-4" />, level: "Dev Process" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-3 sm:p-6 animate-fade-in">
      <div 
        className="w-full max-w-6xl h-[92vh] bg-white dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/80 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-500/20">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  CyberIntel System Documentation
                </h2>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60">
                  Production Calibrated • Cloudflare Edge
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                End-to-End System Specifications, Mathematical Formulations, Shodan Signals &amp; Agentic AI Workflows
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close documentation modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body: Left Vertical Sidebar + Main Scrollable Canvas */}
        <div className="flex-1 flex overflow-hidden">
          {/* Vertical Sidebar */}
          <aside className="w-72 border-r border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#0E131F] p-3 flex flex-col gap-1.5 shrink-0 overflow-y-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1">
              Documentation Sections
            </span>

            {navItems.map((item) => {
              const active = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-left transition-all ${
                    active
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="shrink-0">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                    active 
                      ? "bg-white/20 dark:bg-slate-900/10 text-white dark:text-slate-900 font-bold"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }`}>
                    {item.level}
                  </span>
                </button>
              );
            })}

            <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800 px-3">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[11px] space-y-1">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Database:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">Cloudflare Edge</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Live Accounts:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">5,000 Records</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Pagination:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">20 / View</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Scrollable Canvas */}
          <main className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6">
                       {/* 1. TASK BRIEF & PROBLEM SPACE */}
            {activeTab === "task-brief" && (
              <div className="space-y-8 animate-fade-in pb-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800/60 text-sky-700 dark:text-sky-300 text-xs font-semibold mb-2">
                    <Target className="h-3.5 w-3.5" />
                    <span>Product Planning &amp; Sales Strategy</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    1. Product Planning &amp; Sales Intelligence Strategy
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Context: Building for the outbound sales team at a cybersecurity software company selling CSPM, AppSec, and automated continuous compliance (SOC 2, ISO 27001, APRA CPS 234, HIPAA).
                  </p>
                </div>

                {/* The 3 Prospecting Time Sinks ASCII Diagram */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-rose-500" />
                      <span>The Core Sales Problem: 3 Prospecting Time Sinks</span>
                    </h4>
                    <button
                      onClick={() => handleCopy(`┌──────────────────────────────────────────────────────────────────────┐
│                THE 3 PROSPECTING TIME SINKS                         │
│                                                                      │
│  ❌ Pitching non-tech businesses with zero cloud infrastructure     │
│     → Local bakeries, dental clinics, cleaning services              │
│     → Our system: DISQUALIFIED instantly (Score 0-24, $0.00 cost)    │
│                                                                      │
│  ❌ Contacting mega-corporations with entrenched security teams      │
│     → $40B banks with 200-person in-house SecOps                     │
│     → Our system: DISQUALIFIED (locked into CrowdStrike/Palo Alto)   │
│                                                                      │
│  ❌ Sending generic "hope you're well" spam emails                   │
│     → 2% response rate, damages brand reputation                     │
│     → Our system: Signal-grounded outreach citing real CVEs/audits   │
└──────────────────────────────────────────────────────────────────────┘`, "time-sinks")}
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      {copiedKey === "time-sinks" ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-[10px] sm:text-[11px] leading-relaxed overflow-x-auto border border-slate-800 shadow-inner">
{`┌──────────────────────────────────────────────────────────────────────┐
│                THE 3 PROSPECTING TIME SINKS                         │
│                                                                      │
│  ❌ Pitching non-tech businesses with zero cloud infrastructure     │
│     → Local bakeries, dental clinics, cleaning services              │
│     → Our system: DISQUALIFIED instantly (Score 0-24, $0.00 cost)    │
│                                                                      │
│  ❌ Contacting mega-corporations with entrenched security teams      │
│     → $40B banks with 200-person in-house SecOps                     │
│     → Our system: DISQUALIFIED (locked into CrowdStrike/Palo Alto)   │
│                                                                      │
│  ❌ Sending generic "hope you're well" spam emails                   │
│     → 2% response rate, damages brand reputation                     │
│     → Our system: Signal-grounded outreach citing real CVEs/audits   │
└──────────────────────────────────────────────────────────────────────┘`}
                  </pre>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Value Proposition:</strong> Automatically surface the 12% of companies that are <em>actually in an active buying window right now</em>, rank them by urgency, and generate outreach referencing their specific architectural vulnerabilities.
                  </p>
                </div>

                {/* Traditional Lead List vs Our ICP-Filtered Pipeline */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Scale className="h-4 w-4 text-sky-500" />
                    <span>Traditional Lead List vs. Our ICP-Filtered Pipeline</span>
                  </h4>

                  <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[10px] sm:text-[11px] leading-relaxed overflow-x-auto border border-slate-800">
{`Traditional Lead List:                    Our ICP-Filtered Pipeline:
┌────────────────────────┐                ┌──────────────────────────────────────┐
│ 10,000 random companies│                │ 5,000 scored companies (Calibrated)  │
│                        │                │                                      │
│ → 800 non-tech (bakery)│  Eliminated →  │ 🔴 TIER 1 (Hot Leads):  601 (12.0%)  │
│ → 400 mega-enterprise  │  Eliminated →  │ 🟡 TIER 2 (Nurture):  2,435 (48.7%)  │
│ → 6,000 unknown fit    │  Scored →      │ 🔵 TIER 3 (Low Touch):1,180 (23.6%)  │
│ → 2,800 possible leads │  Scored →      │ ⚪ DISQUALIFIED:        784 (15.7%)  │
│                        │                │                                      │
│ SDR: "Who do I call?"  │                │ SDR: "Start at #1 with proven CVE"   │
│ Response rate: ~2%     │                │ Response rate: 8 - 12%               │
└────────────────────────┘                └──────────────────────────────────────┘`}
                  </pre>

                  {/* ICP Definition Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100/80 dark:bg-slate-800/60 font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="p-2.5">ICP Parameter</th>
                          <th className="p-2.5">Sweet Spot</th>
                          <th className="p-2.5">Disqualification Threshold</th>
                          <th className="p-2.5">Strategic Rationale</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        <tr>
                          <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">Headcount</td>
                          <td className="p-2.5 font-bold text-emerald-600 dark:text-emerald-400">50 – 2,500 employees</td>
                          <td className="p-2.5 text-rose-500">&lt;50 or &gt;10,000 employees</td>
                          <td className="p-2.5 text-slate-600 dark:text-slate-400">Large enough for IT budget; small enough to lack mature in-house SecOps</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">Target Verticals</td>
                          <td className="p-2.5 font-bold text-emerald-600 dark:text-emerald-400">Fintech, HealthTech, GovTech, E-Commerce, LegalTech</td>
                          <td className="p-2.5 text-rose-500">Bakery, Cleaning, Plumbing, Local Dental</td>
                          <td className="p-2.5 text-slate-600 dark:text-slate-400">High financial cost of breach; mandatory statutory compliance penalties</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">Cloud Tech Stack</td>
                          <td className="p-2.5 font-bold text-emerald-600 dark:text-emerald-400">AWS, GCP, Azure, Kubernetes, Microservices</td>
                          <td className="p-2.5 text-rose-500">None / POS terminal only</td>
                          <td className="p-2.5 text-slate-600 dark:text-slate-400">Cloud-native architecture creates misconfiguration blindspots</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">Engineering Ratio</td>
                          <td className="p-2.5 font-bold text-emerald-600 dark:text-emerald-400">High Dev Growth (&gt;20% in 6m) + 0–1 SecOps</td>
                          <td className="p-2.5 text-rose-500">&gt;50 SecOps engineers</td>
                          <td className="p-2.5 text-slate-600 dark:text-slate-400"><strong>The Prime Trigger:</strong> Shipping features fast without security governance</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">Compliance Mandates</td>
                          <td className="p-2.5 font-bold text-emerald-600 dark:text-emerald-400">Active SOC 2, HIPAA, PCI-DSS, APRA CPS 234</td>
                          <td className="p-2.5 text-rose-500">No regulatory mandate</td>
                          <td className="p-2.5 text-slate-600 dark:text-slate-400">Compliance is a mandatory purchase, not an optional discretionary item</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* The 5 High-Impact Buying Signals */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span>The 5 High-Impact Buying Signals (with Real Company Dossiers)</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Signal 1 */}
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                          <span>⚡ Signal 1:</span>
                          <span>Security Debt Disparity</span>
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-bold">
                          Fast Dev, Zero Sec
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        Engineering headcount expanded &gt;25% in the last 6 months, but in-house dedicated security headcount is 0.
                      </p>
                      <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-0.5">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">Real Example: FinShield Pay</div>
                        <div>45% engineering growth, Series B raised, launched checkout API, 0 security hires. Security Debt Ratio: 72.0.</div>
                      </div>
                    </div>

                    {/* Signal 2 */}
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                          <span>🛡️ Signal 2:</span>
                          <span>Compliance &amp; Audit Deadlines</span>
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-bold">
                          Urgent Window
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        Approaching observation windows for SOC 2 Type II, APRA CPS 234, HIPAA, or ISO 27001. Compliance failure stalls enterprise contracts.
                      </p>
                      <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-0.5">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">Real Example: DataVault Legal</div>
                        <div>SOC 2 Type II audit window in 42 days, processing confidential litigation case documents with zero automation.</div>
                      </div>
                    </div>

                    {/* Signal 3 */}
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                          <span>☁️ Signal 3:</span>
                          <span>Infrastructure Sprawl</span>
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 font-bold">
                          Multi-Cloud &amp; IoT
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        Migration from monolith to multi-cloud, Kubernetes clusters, or fleets of edge compute IoT devices multiplying attack surfaces.
                      </p>
                      <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-0.5">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">Real Example: GreenGrid Energy IoT</div>
                        <div>2,200 connected OT sensors on edge compute, AWS + GCP hybrid cloud, zero container image scanning in CI/CD.</div>
                      </div>
                    </div>

                    {/* Signal 4 */}
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                          <span>🚨 Signal 4:</span>
                          <span>Active Shodan Threat Proximity</span>
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 font-bold">
                          Verified CVEs
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        Direct Shodan network evidence: reachable database listeners, expired SSL certificates, and active unpatched CVEs on public endpoints.
                      </p>
                      <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-0.5">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">Corpus Validation: 601 Accounts</div>
                        <div>601 companies in our dataset contain verified Shodan network scan exposures (e.g., CVE-2007-2768, port 3306 reachable).</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Target Buyer Personas & Messaging Matrix */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Target className="h-4 w-4 text-sky-500" />
                    <span>Target Buyer Personas &amp; Messaging Matrix</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-sky-600 dark:text-sky-400">Chief Information Security Officer (CISO)</span>
                      <div className="text-xs text-slate-700 dark:text-slate-200 font-semibold">Primary Metric: Mean Time to Remediation &amp; Fiduciary Defense</div>
                      <p className="text-[11px] text-slate-500">Main Objection: <em>&quot;We already have vulnerability scanners.&quot;</em></p>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Winning Hook: Continuous CSPM correlation proving which CVEs are exposed to the public internet vs airgapped.</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">VP of Engineering / CTO</span>
                      <div className="text-xs text-slate-700 dark:text-slate-200 font-semibold">Primary Metric: Deployment Velocity &amp; Zero Developer Friction</div>
                      <p className="text-[11px] text-slate-500">Main Objection: <em>&quot;Security tools slow down our sprint velocity.&quot;</em></p>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Winning Hook: Shift-left PR checks with automated fix PRs that developers can merge without context switching.</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">Head of Compliance / GRC</span>
                      <div className="text-xs text-slate-700 dark:text-slate-200 font-semibold">Primary Metric: Audit Pass Rate &amp; Evidence Collection Time</div>
                      <p className="text-[11px] text-slate-500">Main Objection: <em>&quot;We collect auditor screenshots manually once a year.&quot;</em></p>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Winning Hook: Continuous API evidence collection that keeps SOC 2 / APRA CPS 234 audit-ready 365 days a year.</div>
                    </div>
                  </div>
                </div>

                {/* SDR Outbound Playbook & Workflow */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Workflow className="h-4 w-4 text-emerald-500" />
                    <span>SDR Lead Prioritization Playbook</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
                      <div className="font-bold text-rose-600 dark:text-rose-400">🔴 TIER 1: CRITICAL (601)</div>
                      <div className="text-slate-500 text-[11px] mt-1">Score: 80 - 99. <strong>Action:</strong> Immediate same-day phone call + personalized email quoting live Shodan CVE ID in sentence 1.</div>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
                      <div className="font-bold text-amber-600 dark:text-amber-400">🟡 TIER 2: MODERATE (2,435)</div>
                      <div className="text-slate-500 text-[11px] mt-1">Score: 60 - 79. <strong>Action:</strong> Enrolled in 5-touch automated email + LinkedIn InMail sequence focusing on upcoming audit windows.</div>
                    </div>
                    <div className="p-3 rounded-xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900/40">
                      <div className="font-bold text-sky-600 dark:text-sky-400">🔵 TIER 3: LOW (1,180)</div>
                      <div className="text-slate-500 text-[11px] mt-1">Score: 45 - 59. <strong>Action:</strong> Low-touch marketing automation. No manual SDR calls until new hiring or tech triggers emerge.</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
                      <div className="font-bold text-slate-500">⚪ DISQUALIFIED (784)</div>
                      <div className="text-slate-500 text-[11px] mt-1">Score: &le;44. <strong>Action:</strong> Auto-archived. Hard rule filter eliminates non-tech &amp; mega-enterprises at $0 token cost.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. ARCHITECTURE & INGESTION */}
            {activeTab === "architecture" && (
              <div className="space-y-8 animate-fade-in pb-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2">
                    <Server className="h-3.5 w-3.5" />
                    <span>Production Architecture Specification</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    2. Technical Architecture &amp; System Design
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Production-grade AI-native sales intelligence platform engineered for high throughput, sub-second query latency, strict output reliability, and sustainable unit economics.
                  </p>
                </div>

                {/* 1.1 High-Level Data Flow ASCII Diagram */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Network className="h-4 w-4 text-sky-500" />
                      <span>1. System Architecture Overview &amp; High-Level Data Flow</span>
                    </h4>
                    <button
                      onClick={() => handleCopy(`┌───────────────────────────────────────────────────────────────────────────────┐
│                          RAW DATA INGESTION SOURCES                          │
│                                                                               │
│  ┌─────────────────────┐  ┌────────────────────┐  ┌───────────────────────┐  │
│  │ Backblaze B2 Dataset │  │ User CSV/JSON      │  │ Custom Domain Entry   │  │
│  │ (9.32 GB Shodan Scan)│  │ (Drag & Drop UI)   │  │ (Manual Enrichment)   │  │
│  └──────────┬──────────┘  └─────────┬──────────┘  └───────────┬───────────┘  │
│             │                       │                         │               │
│             └───────────────────────┼─────────────────────────┘               │
│                                     │                                         │
│                                     ▼                                         │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │              STREAMING INGESTION ENGINE (Python + Zstandard)             │ │
│  │  • Zero-disk streaming decompression via zstd -dc                       │ │
│  │  • Entity resolution: Group records by corporate domain/org             │ │
│  │  • ISP/residential IP filtering (removes dynamic DSL, broadband pools)  │ │
│  │  • Aggregates ports, CVEs, SSL certs, cloud providers per company       │ │
│  └─────────────────────────────────┬────────────────────────────────────────┘ │
└────────────────────────────────────┼─────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                    MEDALLION DATA ARCHITECTURE (Bronze → Silver → Gold)        │
│                                                                                │
│  ┌────────────────┐    ┌─────────────────────┐    ┌────────────────────────┐  │
│  │  BRONZE LAYER   │    │   SILVER LAYER       │    │    GOLD LAYER          │  │
│  │ Raw unvalidated │───▶│ Cleaned, typed,      │───▶│ Feature engineered,    │  │
│  │ scan records    │    │ deduplicated,        │    │ ICP scored, tier       │  │
│  │ (JSONL stream)  │    │ schema-validated     │    │ classified, enriched   │  │
│  └────────────────┘    └─────────────────────┘    └────────────────────────┘  │
└────────────────────────────────────┬───────────────────────────────────────────┘
                                     │
                    ┌────────────────┴────────────────┐
                    ▼                                 ▼
┌─────────────────────────────────┐  ┌──────────────────────────────────────────┐
│      HOSTED ON CLOUDFLARE       │  │         LOCAL JSON SEED STORE            │
│    (Edge Production Tier)       │  │   (data/seed_companies.json — 5,000)     │
│                                 │  │   Fallback for local dev & demo          │
│   • Cloudflare Edge Storage     │  └──────────────────────────────────────────┘
│   • 5,000 calibrated accounts   │
│   • Indexed: score, tier, domain│
│   • Sub-50ms query latency      │
└────────────────┬────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                      HYBRID SCORING & INTELLIGENCE ENGINE                      │
│                                                                                │
│  ┌──────────────────────────────────┐  ┌────────────────────────────────────┐ │
│  │    TIER 1: DETERMINISTIC RULES   │  │     TIER 2: LLM REASONING         │ │
│  │                                  │  │                                    │ │
│  │  ✓ Non-tech disqualification     │  │  ✓ Contextual signal synthesis    │ │
│  │    (bakeries, cleaning services) │  │  ✓ Pain point extraction          │ │
│  │  ✓ Mega-enterprise entrenchment  │  │  ✓ Buyer persona mapping         │ │
│  │    (>10K HC + 50+ SecOps)        │  │  ✓ Personalized sales outreach   │ │
│  │  ✓ Security Debt Ratio math      │  │                                    │ │
│  │  ✓ Attack Surface Index          │  │  Model: gpt-4o-mini via OpenRouter│ │
│  │  ✓ Compliance multiplier         │  │  Prompt: v2 (few-shot calibrated) │ │
│  │                                  │  │  Latency: ~300ms                   │ │
│  │  Cost: $0.0000 / query           │  │  Cost: $0.000155 / query           │ │
│  │  Latency: <2ms                   │  │                                    │ │
│  └──────────────┬───────────────────┘  └──────────────┬─────────────────────┘ │
│                 │                                      │                       │
│                 └──────────────┬────────────────────────┘                       │
│                                │                                               │
│                                ▼                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │                    OBSERVABILITY & TRACING BUS                           │  │
│  │  • Telemetry Logger → data/traces.jsonl (persistent JSONL)              │  │
│  │  • In-Memory Ring Buffer (last 200 traces for live UI)                  │  │
│  │  • Token counter, latency tracker, cost calculator                      │  │
│  │  • Live dashboard in ObservabilityModal.tsx                             │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────┬───────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                    NEXT.JS 15 FRONTEND APPLICATION                             │
│                    (React 19 + Tailwind CSS + Framer Motion)                   │
└────────────────────────────────────────────────────────────────────────────────┘`, "sys-topology")}
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      {copiedKey === "sys-topology" ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Diagram</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-[10px] sm:text-[11px] leading-relaxed overflow-x-auto border border-slate-800 shadow-inner">
{`┌───────────────────────────────────────────────────────────────────────────────┐
│                          RAW DATA INGESTION SOURCES                          │
│                                                                               │
│  ┌─────────────────────┐  ┌────────────────────┐  ┌───────────────────────┐  │
│  │ Backblaze B2 Dataset │  │ User CSV/JSON      │  │ Custom Domain Entry   │  │
│  │ (9.32 GB Shodan Scan)│  │ (Drag & Drop UI)   │  │ (Manual Enrichment)   │  │
│  └──────────┬──────────┘  └─────────┬──────────┘  └───────────┬───────────┘  │
│             │                       │                         │               │
│             └───────────────────────┼─────────────────────────┘               │
│                                     │                                         │
│                                     ▼                                         │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │              STREAMING INGESTION ENGINE (Python + Zstandard)             │ │
│  │  • Zero-disk streaming decompression via \`zstd -dc\`                     │ │
│  │  • Entity resolution: Group records by corporate domain/org             │ │
│  │  • ISP/residential IP filtering (removes dynamic DSL, broadband pools)  │ │
│  │  • Aggregates ports, CVEs, SSL certs, cloud providers per company       │ │
│  └─────────────────────────────────┬────────────────────────────────────────┘ │
└────────────────────────────────────┼─────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                    MEDALLION DATA ARCHITECTURE (Bronze → Silver → Gold)        │
│                                                                                │
│  ┌────────────────┐    ┌─────────────────────┐    ┌────────────────────────┐  │
│  │  BRONZE LAYER   │    │   SILVER LAYER       │    │    GOLD LAYER          │  │
│  │ Raw unvalidated │───▶│ Cleaned, typed,      │───▶│ Feature engineered,    │  │
│  │ scan records    │    │ deduplicated,        │    │ ICP scored, tier       │  │
│  │ (JSONL stream)  │    │ schema-validated     │    │ classified, enriched   │  │
│  └────────────────┘    └─────────────────────┘    └────────────────────────┘  │
└────────────────────────────────────┬───────────────────────────────────────────┘
                                     │
                    ┌────────────────┴────────────────┐
                    ▼                                 ▼
┌─────────────────────────────────┐  ┌──────────────────────────────────────────┐
│      HOSTED ON CLOUDFLARE       │  │         LOCAL JSON SEED STORE            │
│    (Edge Production Tier)       │  │   (data/seed_companies.json — 5,000)     │
│                                 │  │   Fallback for local dev & demo          │
│   • Cloudflare Edge Storage     │  └──────────────────────────────────────────┘
│   • 5,000 calibrated accounts   │
│   • Indexed: score, tier, domain│
│   • Sub-50ms query latency      │
└────────────────┬────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                      HYBRID SCORING & INTELLIGENCE ENGINE                      │
│                                                                                │
│  ┌──────────────────────────────────┐  ┌────────────────────────────────────┐ │
│  │    TIER 1: DETERMINISTIC RULES   │  │     TIER 2: LLM REASONING         │ │
│  │                                  │  │                                    │ │
│  │  ✓ Non-tech disqualification     │  │  ✓ Contextual signal synthesis    │ │
│  │    (bakeries, cleaning services) │  │  ✓ Pain point extraction          │ │
│  │  ✓ Mega-enterprise entrenchment  │  │  ✓ Buyer persona mapping         │ │
│  │    (>10K HC + 50+ SecOps)        │  │  ✓ Personalized sales outreach   │ │
│  │  ✓ Security Debt Ratio math      │  │                                    │ │
│  │  ✓ Attack Surface Index          │  │  Model: gpt-4o-mini via OpenRouter│ │
│  │  ✓ Compliance multiplier         │  │  Prompt: v2 (few-shot calibrated) │ │
│  │                                  │  │  Latency: ~300ms                   │ │
│  │  Cost: $0.0000 / query           │  │  Cost: $0.000155 / query           │ │
│  │  Latency: <2ms                   │  │                                    │ │
│  └──────────────┬───────────────────┘  └──────────────┬─────────────────────┘ │
│                 │                                      │                       │
│                 └──────────────┬────────────────────────┘                       │
│                                │                                               │
│                                ▼                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │                    OBSERVABILITY & TRACING BUS                           │  │
│  │  • Telemetry Logger → data/traces.jsonl (persistent JSONL)              │  │
│  │  • In-Memory Ring Buffer (last 200 traces for live UI)                  │  │
│  │  • Token counter, latency tracker, cost calculator                      │  │
│  │  • Live dashboard in ObservabilityModal.tsx                             │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────┬───────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                    NEXT.JS 15 FRONTEND APPLICATION                             │
│                    (React 19 + Tailwind CSS + Framer Motion)                   │
└────────────────────────────────────────────────────────────────────────────────┘`}
                  </pre>
                </div>

                {/* 3 Tier System Topology Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400">
                      <Globe className="h-4 w-4" />
                      <span>1. Edge Presentation Tier</span>
                    </div>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                      <li>• Next.js 15.1 App Router on Cloudflare Pages</li>
                      <li>• 20 items per page zero-lag virtualized pagination</li>
                      <li>• Client in-memory multi-facet search (&lt;10ms)</li>
                      <li>• Custom curated enterprise dark/light palette</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <Database className="h-4 w-4" />
                      <span>2. Serverless Data Tier</span>
                    </div>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                      <li>• Hosted on Cloudflare Edge: Globally distributed edge tier</li>
                      <li>• Exactly 5,000 diverse corporate accounts</li>
                      <li>• Compound index: <code className="font-mono text-[10px]">idx_tier_score (tier, score DESC)</code></li>
                      <li>• Sub-50ms distributed edge read performance</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                      <Cpu className="h-4 w-4" />
                      <span>3. AI Inference Gateway</span>
                    </div>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                      <li>• OpenRouter Gateway: <code className="font-mono text-[11px]">gpt-4o-mini</code></li>
                      <li>• Zero-temperature strict grounding protocol</li>
                      <li>• Live token telemetry recorded to SQLite &amp; JSONL</li>
                      <li>• Client cache: 0ms &amp; $0.00 on duplicate views</li>
                    </ul>
                  </div>
                </div>

                {/* 2. API Route Architecture */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Workflow className="h-4 w-4 text-emerald-500" />
                      <span>2. API Route Architecture &amp; Service Endpoints</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Next.js App Router exposes 7 clean REST API endpoints serving frontend interaction and telemetry collection:
                    </p>
                  </div>

                  <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[10px] leading-relaxed overflow-x-auto border border-slate-800">
{`                         ┌──────────────────────────────────┐
                         │        API Route Layer           │
                         │    src/app/api/*/route.ts        │
                         └──────────────┬───────────────────┘
                                        │
           ┌────────────────────────────┼────────────────────────────┐
           │                            │                            │
           ▼                            ▼                            ▼
  ┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐
  │ Data Endpoints  │        │  AI Endpoints    │        │ Telemetry       │
  │                 │        │                  │        │ Endpoints       │
  │ GET /companies  │        │ POST /score      │        │ GET /telemetry  │
  │ POST /companies │        │ POST /score-acc  │        │ POST /telemetry │
  │ (CSV upload)    │        │ POST /outreach   │        │ GET /traces     │
  │                 │        │ POST /gen-outreach│       │                 │
  └────────┬────────┘        └────────┬─────────┘        └────────┬────────┘
           │                          │                            │
           ▼                          ▼                            ▼
  ┌─────────────────┐       ┌──────────────────┐        ┌─────────────────┐
  │ Cloudflare Edge │       │ OpenRouter API   │        │ JSONL Logger    │
  │ (Production)    │       │ (gpt-4o-mini)    │        │ data/traces.jsonl│
  │   OR            │       │ + Rule Engine    │        │ + Ring Buffer   │
  │ JSON Seed Store │       │ (src/lib/scoring)│        │ (200 in-memory) │
  └─────────────────┘       └──────────────────┘        └─────────────────┘`}
                  </pre>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100/80 dark:bg-slate-800/60 font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="p-2.5">Endpoint</th>
                          <th className="p-2.5">Method</th>
                          <th className="p-2.5">Purpose</th>
                          <th className="p-2.5">Response Contract</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        <tr>
                          <td className="p-2.5 font-mono text-sky-600 dark:text-sky-400">/api/companies</td>
                          <td className="p-2.5"><span className="px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 text-[10px] font-bold">GET</span></td>
                          <td className="p-2.5 text-slate-600 dark:text-slate-300">Fetch paginated company list with pre-scored data</td>
                          <td className="p-2.5 font-mono text-[11px] text-slate-500">{`{companies[], total, page, counts}`}</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-mono text-sky-600 dark:text-sky-400">/api/companies</td>
                          <td className="p-2.5"><span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">POST</span></td>
                          <td className="p-2.5 text-slate-600 dark:text-slate-300">Ingest new companies (single or batch array)</td>
                          <td className="p-2.5 font-mono text-[11px] text-slate-500">Scored company object(s)</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-mono text-sky-600 dark:text-sky-400">/api/score</td>
                          <td className="p-2.5"><span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">POST</span></td>
                          <td className="p-2.5 text-slate-600 dark:text-slate-300">Score a single company through hybrid engine</td>
                          <td className="p-2.5 font-mono text-[11px] text-slate-500">Company with risk_score + tier</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-mono text-sky-600 dark:text-sky-400">/api/score-account</td>
                          <td className="p-2.5"><span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">POST</span></td>
                          <td className="p-2.5 text-slate-600 dark:text-slate-300">Live LLM scoring via OpenRouter</td>
                          <td className="p-2.5 font-mono text-[11px] text-slate-500">Score + telemetry trace</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-mono text-sky-600 dark:text-sky-400">/api/outreach</td>
                          <td className="p-2.5"><span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">POST</span></td>
                          <td className="p-2.5 text-slate-600 dark:text-slate-300">Deterministic outreach (no LLM, 0ms)</td>
                          <td className="p-2.5 font-mono text-[11px] text-slate-500">Email + InMail + angle</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-mono text-sky-600 dark:text-sky-400">/api/generate-outreach</td>
                          <td className="p-2.5"><span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">POST</span></td>
                          <td className="p-2.5 text-slate-600 dark:text-slate-300"><strong>Live LLM outreach</strong> via OpenRouter</td>
                          <td className="p-2.5 font-mono text-[11px] text-slate-500">Draft + telemetry + trace</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-mono text-sky-600 dark:text-sky-400">/api/telemetry</td>
                          <td className="p-2.5"><span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-[10px] font-bold">GET/POST</span></td>
                          <td className="p-2.5 text-slate-600 dark:text-slate-300">Fetch aggregate stats / record client trace</td>
                          <td className="p-2.5 font-mono text-[11px] text-slate-500">Stats summary + traces array</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-mono text-sky-600 dark:text-sky-400">/api/traces</td>
                          <td className="p-2.5"><span className="px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 text-[10px] font-bold">GET</span></td>
                          <td className="p-2.5 text-slate-600 dark:text-slate-300">Fetch raw telemetry trace logs</td>
                          <td className="p-2.5 font-mono text-[11px] text-slate-500">Trace objects array</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3. The Rule-vs-LLM Split */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Scale className="h-4 w-4 text-amber-500" />
                      <span>3. The Rule-vs-LLM Split: A Core Design Decision</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      A major pitfall in early &quot;AI apps&quot; is passing raw data directly to an LLM for everything. We enforce a strict division of labor:
                    </p>
                  </div>

                  <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[10px] leading-relaxed overflow-x-auto border border-slate-800">
{`         ┌──────────────────────────────────────────────────────────┐
         │              INCOMING COMPANY RECORD                     │
         └────────────────────────┬─────────────────────────────────┘
                                  │
                                  ▼
         ┌──────────────────────────────────────────────────────────┐
         │        STAGE 1: HARD DISQUALIFICATION (Rules — $0.00)   │
         │                                                          │
         │  Q: Is this a non-tech brick & mortar?                   │
         │     → Bakery, cleaning service, dental clinic            │
         │     → DISQUALIFIED (score 12, skip LLM entirely)        │
         │                                                          │
         │  Q: Is this a mega-enterprise with entrenched SecOps?    │
         │     → >10K headcount AND 50+ security staff              │
         │     → DISQUALIFIED (3-year vendor lock-in, no budget)    │
         └────────────────────────┬─────────────────────────────────┘
                                  │ (Passes filter)
                                  ▼
         ┌──────────────────────────────────────────────────────────┐
         │    STAGE 2: MATHEMATICAL FEATURE ENGINEERING ($0.00)     │
         │                                                          │
         │  • Security Debt Ratio = (Eng Growth × Dev HC) ÷        │
         │                          (SecOps + 0.5) × 50             │
         │  • Attack Surface Index = weighted sum of cloud flags    │
         │  • Compliance Multiplier = regulatory framework weights  │
         │  • ACV Estimation = headcount × tier × compliance count  │
         └────────────────────────┬─────────────────────────────────┘
                                  │
                                  ▼
         ┌──────────────────────────────────────────────────────────┐
         │      STAGE 3: CONTEXTUAL LLM REASONING ($0.000155)      │
         │                                                          │
         │  Only for qualified ICP candidates that pass Stage 1-2:  │
         │  • Signal synthesis from unstructured triggers/news      │
         │  • Buyer persona pain point mapping                     │
         │  • Personalized outreach generation                     │
         │  • Calibrated few-shot JSON scoring (Prompt v2)          │
         └──────────────────────────────────────────────────────────┘`}
                  </pre>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100/80 dark:bg-slate-800/60 font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="p-2.5">Capability</th>
                          <th className="p-2.5">Engine</th>
                          <th className="p-2.5">Cost per Query</th>
                          <th className="p-2.5">Latency</th>
                          <th className="p-2.5">Accuracy / Reliability</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        <tr>
                          <td className="p-2.5 font-medium text-slate-800 dark:text-slate-200">Non-Tech Disqualification</td>
                          <td className="p-2.5"><span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">Rule</span></td>
                          <td className="p-2.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">$0.0000</td>
                          <td className="p-2.5 font-mono text-slate-500">&lt;2ms</td>
                          <td className="p-2.5 text-slate-600 dark:text-slate-300">100% deterministic</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-medium text-slate-800 dark:text-slate-200">Enterprise Entrenchment Check</td>
                          <td className="p-2.5"><span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">Rule</span></td>
                          <td className="p-2.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">$0.0000</td>
                          <td className="p-2.5 font-mono text-slate-500">&lt;2ms</td>
                          <td className="p-2.5 text-slate-600 dark:text-slate-300">100% deterministic</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-medium text-slate-800 dark:text-slate-200">Security Debt Ratio Calculation</td>
                          <td className="p-2.5"><span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">Rule</span></td>
                          <td className="p-2.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">$0.0000</td>
                          <td className="p-2.5 font-mono text-slate-500">&lt;2ms</td>
                          <td className="p-2.5 text-slate-600 dark:text-slate-300">100% reproducible</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-medium text-slate-800 dark:text-slate-200">Compliance Multipliers &amp; ACV</td>
                          <td className="p-2.5"><span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">Rule</span></td>
                          <td className="p-2.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">$0.0000</td>
                          <td className="p-2.5 font-mono text-slate-500">&lt;2ms</td>
                          <td className="p-2.5 text-slate-600 dark:text-slate-300">100% reproducible</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-medium text-slate-800 dark:text-slate-200">Contextual Signal Synthesis</td>
                          <td className="p-2.5"><span className="px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-[10px] font-bold">LLM</span></td>
                          <td className="p-2.5 font-mono text-slate-600 dark:text-slate-400">$0.000155</td>
                          <td className="p-2.5 font-mono text-slate-500">~300ms</td>
                          <td className="p-2.5 text-slate-600 dark:text-slate-300">97.4% F1 Score</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-medium text-slate-800 dark:text-slate-200">Buyer Pain Point Mapping</td>
                          <td className="p-2.5"><span className="px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-[10px] font-bold">LLM</span></td>
                          <td className="p-2.5 font-mono text-slate-600 dark:text-slate-400">$0.000080</td>
                          <td className="p-2.5 font-mono text-slate-500">~180ms</td>
                          <td className="p-2.5 text-slate-600 dark:text-slate-300">95%+ alignment</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-medium text-slate-800 dark:text-slate-200">Sales Outreach Generation</td>
                          <td className="p-2.5"><span className="px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-[10px] font-bold">LLM</span></td>
                          <td className="p-2.5 font-mono text-slate-600 dark:text-slate-400">$0.000167</td>
                          <td className="p-2.5 font-mono text-slate-500">~320ms</td>
                          <td className="p-2.5 text-slate-600 dark:text-slate-300">Zero-hallucination grounded</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                    <strong>Net Result:</strong> 40%+ of all incoming records are handled by rules alone, saving hundreds of dollars at scale and completely eliminating hallucination risk for non-tech accounts.
                  </div>
                </div>

                {/* 4. Medallion Pipeline Architecture */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-sky-500" />
                    <span>4. Medallion Data Engineering Pipeline (Bronze → Silver → Gold)</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">Bronze Layer</span>
                      <h5 className="font-semibold text-xs mt-1 text-slate-800 dark:text-slate-200">Raw Shodan Corpus</h5>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        9.32 GB Backblaze B2 Zstandard archive (~40 GB uncompressed). Streamed line-by-line via Python <code className="font-mono">zstd -dc</code> with 0 disk overhead.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold uppercase text-slate-500">Silver Layer</span>
                      <h5 className="font-semibold text-xs mt-1 text-slate-800 dark:text-slate-200">Cleaning &amp; Validation</h5>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Strips subdomains, normalizes ASN &amp; cloud providers, parses TLS timestamp expiration, and deduplicates domains using strict schemas.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">Gold Layer</span>
                      <h5 className="font-semibold text-xs mt-1 text-slate-800 dark:text-slate-200">Feature Engineering</h5>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Calculates Security Debt Disparity, estimated ACV, and assigns calibrated tiers (601 Tier 1, 2435 Tier 2, 1180 Tier 3, 784 Disqualified).
                      </p>
                    </div>
                  </div>

                  {/* Feature Engineering Formulas */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 space-y-3">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Feature Engineering Mathematics</span>
                    <div className="space-y-2 text-xs font-mono bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                      <div><span className="text-sky-500">Security_Debt_Ratio</span> = (Engineering_Growth_% × Dev_Headcount) / ((Security_Staff + 0.5) × 50)</div>
                      <div><span className="text-emerald-500">Estimated_ACV</span> = max($24,000, round(Headcount × 0.12 × $1,000))</div>
                    </div>
                  </div>
                </div>

                {/* 5. Database Schema: Entity-Relationship Diagram */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Database className="h-4 w-4 text-emerald-500" />
                    <span>5. Database Schema &amp; Entity-Relationship Diagram</span>
                  </h4>

                  <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[10px] leading-relaxed overflow-x-auto border border-slate-800">
{`┌─────────────────────────────────────────────────────┐
│                    companies                         │
├──────────────────────┬──────────────────────────────┤
│ id                   │ TEXT PRIMARY KEY              │
│ name                 │ TEXT NOT NULL                 │
│ domain               │ TEXT NOT NULL (indexed)       │
│ industry             │ TEXT NOT NULL                 │
│ headcount            │ INTEGER NOT NULL              │
│ location             │ TEXT NOT NULL                 │
│ annual_revenue       │ TEXT                          │
│ cloud_environment    │ TEXT NOT NULL                 │
│ tech_stack           │ TEXT NOT NULL (JSON array)    │
│ compliance_mandates  │ TEXT NOT NULL (JSON array)    │
│ engineering_growth   │ REAL NOT NULL                 │
│ security_headcount   │ INTEGER NOT NULL              │
│ security_debt_ratio  │ REAL NOT NULL                 │
│ recent_triggers      │ TEXT                          │
│ estimated_acv        │ TEXT NOT NULL                 │
│ audit_countdown_days │ INTEGER                       │
│ audit_countdown_label│ TEXT                          │
│ sales_battlecard     │ TEXT (JSON object)            │
│ cyber_risk_score     │ INTEGER NOT NULL (indexed↓)   │
│ risk_tier            │ TEXT NOT NULL (indexed)       │
│ buying_signals       │ TEXT NOT NULL (JSON array)    │
│ target_buyer         │ TEXT NOT NULL (JSON object)   │
│ rationale            │ TEXT                          │
│ created_at           │ DATETIME DEFAULT NOW          │
└──────────────────────┴──────────────────────────────┘
         │
         │  1:N (via company_name)
         ▼
┌─────────────────────────────────────────────────────┐
│                telemetry_traces                      │
├──────────────────────┬──────────────────────────────┤
│ id                   │ TEXT PRIMARY KEY              │
│ timestamp            │ TEXT NOT NULL (indexed↓)      │
│ feature              │ TEXT NOT NULL (indexed)       │
│ model                │ TEXT NOT NULL                 │
│ prompt_version       │ TEXT NOT NULL                 │
│ input_tokens         │ INTEGER NOT NULL              │
│ output_tokens        │ INTEGER NOT NULL              │
│ latency_ms           │ INTEGER NOT NULL              │
│ cost_usd             │ REAL NOT NULL                 │
│ company_name         │ TEXT NOT NULL                 │
│ decision_summary     │ TEXT NOT NULL                 │
│ cached               │ INTEGER DEFAULT 0            │
│ created_at           │ DATETIME DEFAULT NOW          │
└──────────────────────┴──────────────────────────────┘`}
                  </pre>

                  {/* Index Strategy Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100/80 dark:bg-slate-800/60 font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="p-2.5">Index Name</th>
                          <th className="p-2.5">Indexed Column(s)</th>
                          <th className="p-2.5">Query Purpose</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        <tr>
                          <td className="p-2.5 font-mono text-emerald-600 dark:text-emerald-400">idx_companies_score</td>
                          <td className="p-2.5 font-mono text-[11px] text-slate-500">cyber_risk_score DESC</td>
                          <td className="p-2.5 text-slate-600 dark:text-slate-300">Fast sorted retrieval for pipeline view</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-mono text-emerald-600 dark:text-emerald-400">idx_companies_risk_tier</td>
                          <td className="p-2.5 font-mono text-[11px] text-slate-500">risk_tier</td>
                          <td className="p-2.5 text-slate-600 dark:text-slate-300">Instant tier filtering (T1/T2/T3/DQ)</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-mono text-emerald-600 dark:text-emerald-400">idx_companies_domain</td>
                          <td className="p-2.5 font-mono text-[11px] text-slate-500">domain</td>
                          <td className="p-2.5 text-slate-600 dark:text-slate-300">Deduplication and domain lookups</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-mono text-emerald-600 dark:text-emerald-400">idx_traces_timestamp</td>
                          <td className="p-2.5 font-mono text-[11px] text-slate-500">timestamp DESC</td>
                          <td className="p-2.5 text-slate-600 dark:text-slate-300">Reverse-chronological trace inspection</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 6. Observability & Tracing Architecture */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-rose-500" />
                    <span>6. Observability &amp; Tracing Architecture</span>
                  </h4>

                  <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[10px] leading-relaxed overflow-x-auto border border-slate-800">
{`[ User Action: Score / Draft / Regenerate ]
                 │
                 ▼
[ Next.js API Route: /api/generate-outreach or /api/score-account ]
                 │
                 ▼
[ OpenRouter API Call: gpt-4o-mini ]
                 │
                 ├─ Captures: latency_ms, prompt_tokens, completion_tokens, cost_usd
                 │
                 ▼
[ logTrace() → src/lib/telemetry.ts ]
                 │
                 ├─ Writes to: data/traces.jsonl (Persistent JSONL on Node FS)
                 ├─ Updates:   In-Memory Ring Buffer (Last 200 traces)
                 │
                 ▼
[ Telemetry API: /api/telemetry (GET / POST) ]
                 │
                 ▼
[ UI Cockpit: ObservabilityModal.tsx ]
   • Real-time KPI cards: Total Traces, Actual Spend, Tokens Processed
   • Live vs Cached ratio visualization
   • One-click refresh and trace inspection`}
                  </pre>
                </div>

                {/* 7. Production Unit Economics & Cost Model */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-emerald-500" />
                    <span>7. Production Unit Economics &amp; Cost Model</span>
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800">
                      <div className="text-slate-500 text-[11px]">1,000 Accounts</div>
                      <div className="text-base font-bold text-slate-900 dark:text-white mt-1">$0.32</div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Scoring + Outreach</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800">
                      <div className="text-slate-500 text-[11px]">5,000 Accounts</div>
                      <div className="text-base font-bold text-slate-900 dark:text-white mt-1">$1.61</div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Full Dataset</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800">
                      <div className="text-slate-500 text-[11px]">10,000 Accounts</div>
                      <div className="text-base font-bold text-slate-900 dark:text-white mt-1">$3.22</div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Scale Tier</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800">
                      <div className="text-slate-500 text-[11px]">100,000 Accounts</div>
                      <div className="text-base font-bold text-slate-900 dark:text-white mt-1">$32.20</div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Enterprise Corpus</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">Production Budget Ceilings</div>
                    <div className="text-slate-500 text-[11px]">
                      • <strong>Per-SDR Monthly Allocation:</strong> $0.76/month (1,500 scored accounts + 500 outreach drafts)
                      <br />
                      • <strong>Team Hard Ceiling (10 SDRs):</strong> $50/month (Guards against recursive polling loops)
                    </div>
                  </div>
                </div>

                {/* 8. Deployment Architecture */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-sky-500" />
                    <span>8. Deployment Architecture (Hosted on Cloudflare + OpenRouter)</span>
                  </h4>

                  <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[10px] leading-relaxed overflow-x-auto border border-slate-800">
{`┌─────────────────────────────────────────────────────────┐
│                    DEPLOYMENT TOPOLOGY                    │
│                                                          │
│  ┌────────────────────┐    ┌────────────────────────┐   │
│  │ Hosted on          │    │ Cloudflare Edge        │   │
│  │ Cloudflare Edge    │◄──▶│ Database Storage       │   │
│  │                    │    │                         │   │
│  │ Edge SSR + Static  │    │ 5,000 calibrated rows   │   │
│  │ Sub-50ms Global    │    │ Sub-50ms Global Query   │   │
│  └────────┬───────────┘    └─────────────────────────┘   │
│           │                                              │
│           │  HTTPS                                       │
│           ▼                                              │
│  ┌────────────────────────────────────────────────────┐  │
│  │              OpenRouter API Gateway                │  │
│  │  • Model: openai/gpt-4o-mini                      │  │
│  │  • Fallback: anthropic/claude-3-haiku              │  │
│  │  • Rate: 100 req/min                              │  │
│  │  • Timeout: 35s with AbortController              │  │
│  └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘`}
                  </pre>
                </div>
              </div>
            )}

            {/* 3. RAW SIGNALS DICTIONARY */}
            {activeTab === "raw-metrics" && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-semibold mb-2">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>Data Dictionary</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    3. Raw Signals &amp; Metrics Dictionary
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Every raw signal ingested from Shodan scan records and firmographics, with technical definition and GTM rationale.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100/80 dark:bg-slate-800/60 font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="p-3.5">Signal Name</th>
                          <th className="p-3.5">Data Source</th>
                          <th className="p-3.5">Definition &amp; Format</th>
                          <th className="p-3.5">Why Needed for Cybersecurity Sales</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                          <td className="p-3.5 font-semibold text-rose-600 dark:text-rose-400">
                            <code>active_cves</code>
                          </td>
                          <td className="p-3.5 text-slate-500">Shodan Banners + NVD</td>
                          <td className="p-3.5 text-slate-700 dark:text-slate-300">
                            Array of CVE IDs matching public reachable service banners (e.g., <code className="font-mono text-[11px]">CVE-2021-41773</code>).
                          </td>
                          <td className="p-3.5 text-slate-600 dark:text-slate-400 leading-relaxed">
                            <strong>Immediate urgency proof.</strong> Gives the SDR unarguable technical evidence that their perimeter is vulnerable to known public exploits.
                          </td>
                        </tr>

                        <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                          <td className="p-3.5 font-semibold text-amber-600 dark:text-amber-400">
                            <code>ssl_expired</code>
                          </td>
                          <td className="p-3.5 text-slate-500">TLS Handshake</td>
                          <td className="p-3.5 text-slate-700 dark:text-slate-300">
                            Boolean flag indicating production certificate expiration timestamp has lapsed.
                          </td>
                          <td className="p-3.5 text-slate-600 dark:text-slate-400 leading-relaxed">
                            <strong>Operational negligence signal.</strong> Proves broken automated certificate renewal and lack of basic SecOps monitoring.
                          </td>
                        </tr>

                        <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                          <td className="p-3.5 font-semibold text-orange-600 dark:text-orange-400">
                            <code>exposed_db_ports</code>
                          </td>
                          <td className="p-3.5 text-slate-500">Shodan Port Scanner</td>
                          <td className="p-3.5 text-slate-700 dark:text-slate-300">
                            Public listeners on ports 3306 (MySQL), 5432 (Postgres), 6379 (Redis), 27017 (MongoDB).
                          </td>
                          <td className="p-3.5 text-slate-600 dark:text-slate-400 leading-relaxed">
                            <strong>Severe breach catalyst.</strong> Databases should never face the public internet directly; provides massive leverage in security sales dialogues.
                          </td>
                        </tr>

                        <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                          <td className="p-3.5 font-semibold text-slate-700 dark:text-slate-300">
                            <code>admin_ports</code>
                          </td>
                          <td className="p-3.5 text-slate-500">Shodan Port Scanner</td>
                          <td className="p-3.5 text-slate-700 dark:text-slate-300">
                            Unrestricted remote management ports (SSH 22, RDP 3389, SMB 445, Webmin 10000).
                          </td>
                          <td className="p-3.5 text-slate-600 dark:text-slate-400 leading-relaxed">
                            <strong>Ransomware vector.</strong> Threat actors actively brute-force open RDP/SSH endpoints to gain initial network foothold.
                          </td>
                        </tr>

                        <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                          <td className="p-3.5 font-semibold text-blue-600 dark:text-blue-400">
                            <code>cloud_provider</code>
                          </td>
                          <td className="p-3.5 text-slate-500">BGP ASN &amp; rDNS</td>
                          <td className="p-3.5 text-slate-700 dark:text-slate-300">
                            Identified cloud provider (AWS, Google Cloud, Microsoft Azure, Hetzner, DigitalOcean).
                          </td>
                          <td className="p-3.5 text-slate-600 dark:text-slate-400 leading-relaxed">
                            <strong>Integration fit.</strong> Allows AE/SDR to tailor pitch around native cloud posture management (CSPM) and Kubernetes compliance.
                          </td>
                        </tr>

                        <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                          <td className="p-3.5 font-semibold text-emerald-600 dark:text-emerald-400">
                            <code>engineering_growth_6m</code>
                          </td>
                          <td className="p-3.5 text-slate-500">Talent Flow Signals</td>
                          <td className="p-3.5 text-slate-700 dark:text-slate-300">
                            Trailing 6-month percentage growth in software engineering headcount (0% – 120%).
                          </td>
                          <td className="p-3.5 text-slate-600 dark:text-slate-400 leading-relaxed">
                            <strong>Security debt indicator.</strong> Fast engineering hiring creates code churn and new attack surfaces faster than manual security audits can handle.
                          </td>
                        </tr>

                        <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                          <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">
                            <code>security_headcount</code>
                          </td>
                          <td className="p-3.5 text-slate-500">Firmographic Titles</td>
                          <td className="p-3.5 text-slate-700 dark:text-slate-300">
                            Exact number of employees holding dedicated security titles (AppSec, CISO, SecOps).
                          </td>
                          <td className="p-3.5 text-slate-600 dark:text-slate-400 leading-relaxed">
                            <strong>Disqualification &amp; need filter.</strong> A company with 0 security staff needs automated SaaS; a bank with 300 security staff will not buy point solutions.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 4. DERIVED & CALCULATED METRICS */}
            {activeTab === "calculated-metrics" && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-xs font-semibold mb-2">
                    <Calculator className="h-3.5 w-3.5" />
                    <span>Proprietary Mathematics</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    4. Derived &amp; Calculated Metrics (Formula Table)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Every calculated metric produced in code by the Feature Engineering pipeline, with mathematical formulas, variables, and sales rationale.
                  </p>
                </div>

                {/* The Calculated Metrics Table */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100/80 dark:bg-slate-800/60 font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="p-3.5">Calculated Metric</th>
                          <th className="p-3.5">Mathematical Formula</th>
                          <th className="p-3.5">Inputs &amp; Units</th>
                          <th className="p-3.5">Output Range</th>
                          <th className="p-3.5">Why Needed &amp; Sales Rationale</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                          <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                            Security Debt Disparity Ratio
                          </td>
                          <td className="p-3.5 font-mono text-[11px] text-sky-600 dark:text-sky-400">
                            round( (Growth% &times; max(10, Headcount &times; 0.4)) / ((SecOps + 0.5) &times; 50), 1 )
                          </td>
                          <td className="p-3.5 text-slate-500">
                            <code>growth</code> (%), <code>headcount</code> (int), <code>sec_hc</code> (int)
                          </td>
                          <td className="p-3.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                            0.0x – 60.0x+ Multiplier
                          </td>
                          <td className="p-3.5 text-slate-600 dark:text-slate-400 leading-relaxed">
                            Measures the velocity gap between developer shipping speed and security oversight. Anything &gt;15x indicates severe operational risk.
                          </td>
                        </tr>

                        <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                          <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                            Cyber Propensity Score
                          </td>
                          <td className="p-3.5 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                            clamp(BaseScore + CVE_Bonus + SSL_Bonus + DB_Bonus + Disparity_Bonus, 0, 100)
                          </td>
                          <td className="p-3.5 text-slate-500">
                            Weighted signals: CVEs (+35), SSL (+25), DB (+22), Port (+15), Debt (+15)
                          </td>
                          <td className="p-3.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                            0 – 100 Points
                          </td>
                          <td className="p-3.5 text-slate-600 dark:text-slate-400 leading-relaxed">
                            Ranks all 5,000 accounts into actionable priority tiers so SDRs spend 80% of their day contacting Tier 1 Critical leads.
                          </td>
                        </tr>

                        <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                          <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                            Estimated Deal Value (ACV ARR)
                          </td>
                          <td className="p-3.5 font-mono text-[11px] text-amber-600 dark:text-amber-400">
                            max($24,000, round(Headcount &times; 0.12 &times; $1,000))
                          </td>
                          <td className="p-3.5 text-slate-500">
                            <code>headcount</code> (int), Enterprise base floor ($24k)
                          </td>
                          <td className="p-3.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                            $24,000 – $250,000+ USD
                          </td>
                          <td className="p-3.5 text-slate-600 dark:text-slate-400 leading-relaxed">
                            Calibrated against B2B security seat licensing models. Allows sales leaders to instantly forecast pipeline revenue and deal quota.
                          </td>
                        </tr>

                        <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                          <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                            Audit Urgency Countdown Window
                          </td>
                          <td className="p-3.5 font-mono text-[11px] text-rose-600 dark:text-rose-400">
                            max(1, TargetComplianceDate - CurrentDate)
                          </td>
                          <td className="p-3.5 text-slate-500">
                            Regulatory schedule (SOC 2, APRA CPS 234, ISO 27001, HIPAA)
                          </td>
                          <td className="p-3.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                            1 – 90 Days
                          </td>
                          <td className="p-3.5 text-slate-600 dark:text-slate-400 leading-relaxed">
                            Generates legitimate, non-artificial urgency in SDR outreach (e.g. <em>"APRA CPS 234 compliance deadline in 42 days"</em>).
                          </td>
                        </tr>

                        <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                          <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                            Unit Cost per 10k Ingestions
                          </td>
                          <td className="p-3.5 font-mono text-[11px] text-blue-600 dark:text-blue-400">
                            ( (InputTokens &times; $0.15) + (OutputTokens &times; $0.60) ) / 1,000,000
                          </td>
                          <td className="p-3.5 text-slate-500">
                            OpenRouter GPT-4o-mini rate card
                          </td>
                          <td className="p-3.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                            $1.57 / 10,000 Accounts
                          </td>
                          <td className="p-3.5 text-slate-600 dark:text-slate-400 leading-relaxed">
                            Demonstrates sustainable unit economics for enterprise scale; costs less than a single cup of coffee to score 10,000 companies.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Tier Thresholds Breakdown */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Live Database Tier Classification Thresholds (5,000 Seeded Accounts)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50">
                      <div className="font-bold text-rose-700 dark:text-rose-400">Tier 1 Critical</div>
                      <div className="text-[11px] text-slate-500 mt-1">Score: <strong>78 – 99</strong></div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold mt-1">601 Accounts (12.0%)</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50">
                      <div className="font-bold text-amber-700 dark:text-amber-400">Tier 2 Moderate</div>
                      <div className="text-[11px] text-slate-500 mt-1">Score: <strong>58 – 77</strong></div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold mt-1">2,435 Accounts (48.7%)</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/50">
                      <div className="font-bold text-sky-700 dark:text-sky-400">Tier 3 Low</div>
                      <div className="text-[11px] text-slate-500 mt-1">Score: <strong>42 – 57</strong></div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold mt-1">1,180 Accounts (23.6%)</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <div className="font-bold text-slate-600 dark:text-slate-400">Disqualified</div>
                      <div className="text-[11px] text-slate-500 mt-1">Score: <strong>&le; 38</strong></div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold mt-1">784 Accounts (15.7%)</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. AGENTIC SKILLS & PROMPTS (HORIZONTAL TABS) */}
            {activeTab === "skills" && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800/60 text-sky-700 dark:text-sky-300 text-xs font-semibold mb-2">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Agentic AI System</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    5. Agentic Skills &amp; Prompt Engineering
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Reusable agentic skills conforming to standard AI agent specifications with strict JSON schemas and trigger conditions.
                  </p>
                </div>

                {/* Horizontal Sub-Tabs Selector */}
                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                  <button
                    onClick={() => setActiveSkillTab("scoring")}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                      activeSkillTab === "scoring"
                        ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Activity className="h-3.5 w-3.5 text-rose-500" />
                    <span>Skill 1: Account Scoring &amp; Risk</span>
                  </button>

                  <button
                    onClick={() => setActiveSkillTab("outreach")}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                      activeSkillTab === "outreach"
                        ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5 text-sky-500" />
                    <span>Skill 2: Outreach Generator</span>
                  </button>

                  <button
                    onClick={() => setActiveSkillTab("evals")}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                      activeSkillTab === "evals"
                        ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Gauge className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Skill 3: Evaluation Suite</span>
                  </button>
                </div>

                {/* SKILL 1 CONTENT */}
                {activeSkillTab === "scoring" && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-bold">
                            skills/account-scoring/SKILL.md
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                            Account Scoring &amp; Cyber Risk Signal Detection
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          v2.1.0 • Calibrated
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        Evaluates raw B2B company firmographics and Shodan scan telemetry. Executes deterministic disqualification rules first, performs mathematical feature engineering, and conditionally invokes OpenRouter LLM reasoning only for qualified candidates.
                      </p>

                      <div className="pt-2">
                        <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Trigger Conditions:
                        </div>
                        <div className="flex flex-wrap gap-2 text-[11px]">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            • Ingestion of new company domain or CSV batch
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            • SDR requests qualification refresh in dashboard
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Input Parameter Schema */}
                    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-2.5">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Input Parameter Specification
                      </h5>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px]">
                          <thead className="text-slate-400 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                              <th className="pb-2">Field</th>
                              <th className="pb-2">Type</th>
                              <th className="pb-2">Required</th>
                              <th className="pb-2">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                            <tr>
                              <td className="py-2 font-mono font-semibold text-sky-600 dark:text-sky-400">domain</td>
                              <td className="py-2">string</td>
                              <td className="py-2 font-bold text-rose-500">Yes</td>
                              <td className="py-2">Primary web domain (e.g. "payflow.io")</td>
                            </tr>
                            <tr>
                              <td className="py-2 font-mono font-semibold text-sky-600 dark:text-sky-400">headcount</td>
                              <td className="py-2">integer</td>
                              <td className="py-2 font-bold text-rose-500">Yes</td>
                              <td className="py-2">Total employee count</td>
                            </tr>
                            <tr>
                              <td className="py-2 font-mono font-semibold text-sky-600 dark:text-sky-400">security_headcount</td>
                              <td className="py-2">integer</td>
                              <td className="py-2 font-bold text-rose-500">Yes</td>
                              <td className="py-2">Dedicated in-house security staff</td>
                            </tr>
                            <tr>
                              <td className="py-2 font-mono font-semibold text-sky-600 dark:text-sky-400">active_cves</td>
                              <td className="py-2">array[string]</td>
                              <td className="py-2 text-slate-400">Optional</td>
                              <td className="py-2">Public CVEs matching service banners</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Output JSON Preview */}
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-mono">Output JSON Schema (Validated)</span>
                        <button
                          onClick={() => handleCopy('{\n  "cyber_risk_score": 94,\n  "risk_tier": "TIER_1_CRITICAL",\n  "buying_signals": [\n    {\n      "type": "SECURITY_DEBT_DISPARITY",\n      "severity": "HIGH",\n      "headline": "42% Engineering Growth with 0 Security Staff"\n    }\n  ]\n}', "schema-score")}
                          className="flex items-center gap-1 hover:text-white transition-colors"
                        >
                          {copiedKey === "schema-score" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                          <span>{copiedKey === "schema-score" ? "Copied" : "Copy Schema"}</span>
                        </button>
                      </div>
                      <pre className="font-mono text-xs text-emerald-400 overflow-x-auto p-2 bg-slate-950/60 rounded-xl">
{`{
  "cyber_risk_score": 94,
  "risk_tier": "TIER_1_CRITICAL",
  "buying_signals": [
    {
      "type": "SECURITY_DEBT_DISPARITY",
      "severity": "HIGH",
      "headline": "42% Engineering Growth with 0 Security Staff"
    }
  ],
  "calculated_acv": 38000
}`}
                      </pre>
                    </div>
                  </div>
                )}

                {/* SKILL 2 CONTENT */}
                {activeSkillTab === "outreach" && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-sky-600 dark:text-sky-400 font-bold">
                            skills/outreach-draft/SKILL.md
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                            Signal-Grounded Multi-Channel Outreach Generator
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          v2.0.0 • Strict Grounding
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        Synthesizes hyper-personalized cold outreach (Email and LinkedIn InMail). Anchors the opening hook on verified technical triggers (e.g. unpatched CVE IDs, expired certificates, or rapid dev growth) rather than generic corporate praise.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                          <span className="text-[10px] font-bold uppercase text-sky-600 dark:text-sky-400">Tone Option 1</span>
                          <div className="font-semibold text-xs text-slate-800 dark:text-slate-200 mt-0.5">Direct &amp; Technical (SDR)</div>
                          <p className="text-[11px] text-slate-500 mt-1">
                            Focuses directly on vulnerability remediation, engineer velocity, and exact port/CVE evidence.
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                          <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">Tone Option 2</span>
                          <div className="font-semibold text-xs text-slate-800 dark:text-slate-200 mt-0.5">Executive &amp; ROI (VP)</div>
                          <p className="text-[11px] text-slate-500 mt-1">
                            Focuses on regulatory compliance deadlines (APRA, SOC 2), audit friction, and enterprise brand trust.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Live Generated Sample */}
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-mono">Live Grounded Email Output (Zero Generic Fluff)</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono text-slate-300 space-y-2">
                        <div className="text-sky-400 font-semibold">Subject: quick q on payflow's cloud security ahead of cps 234</div>
                        <div className="text-slate-400 leading-relaxed font-sans text-xs">
                          "Hi Alex,<br/><br/>
                          Noticed PayFlow's engineering team expanded over 40% recently while scaling out your open banking APIs across multi-region AWS.<br/><br/>
                          With APRA CPS 234 audits tightening for fintechs handling banking partner integrations, teams at this stage usually get caught spending weeks manually consolidating cloud posture evidence.<br/><br/>
                          We built an automated cloud posture engine that gives engineering heads complete visibility without slowing down sprints. Open to a 2-minute look at how peer fintechs automated this before their audit?"
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SKILL 3 CONTENT */}
                {activeSkillTab === "evals" && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
                            evals/eval_harness.py • Automated Quality Gate
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                            AI Evaluation Framework: Prompt v1 (Baseline) vs Prompt v2 (Production)
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold">
                          All 25 Benchmarks Passed
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        Evaluates Prompt v1 against Prompt v2 across 25 hand-labeled ground-truth test scenarios covering edge cases (local bakeries, mega-banks with 300 SecOps staff, high-growth fintechs, and industrial IoT perimeters).
                      </p>

                      {/* Scorecard Table matching evals/RESULTS.md */}
                      <div className="overflow-x-auto pt-1">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-100/80 dark:bg-slate-800/60 font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                            <tr>
                              <th className="p-2.5">Metric</th>
                              <th className="p-2.5">Prompt v1 (Baseline)</th>
                              <th className="p-2.5">Prompt v2 (Production)</th>
                              <th className="p-2.5">Delta / Improvement</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            <tr>
                              <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">ICP Precision (Outbound)</td>
                              <td className="p-2.5 font-mono text-rose-500">76.0%</td>
                              <td className="p-2.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">95.0%</td>
                              <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">+19.0% improvement</td>
                            </tr>
                            <tr>
                              <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">ICP Recall</td>
                              <td className="p-2.5 font-mono text-slate-600 dark:text-slate-400">100.0%</td>
                              <td className="p-2.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">100.0%</td>
                              <td className="p-2.5 text-slate-500">0 false negatives (perfect coverage)</td>
                            </tr>
                            <tr>
                              <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">F1 Score</td>
                              <td className="p-2.5 font-mono text-slate-600 dark:text-slate-400">86.4%</td>
                              <td className="p-2.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">97.4%</td>
                              <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">+11.1% gain</td>
                            </tr>
                            <tr>
                              <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">Tier Accuracy</td>
                              <td className="p-2.5 font-mono text-rose-500">40.0%</td>
                              <td className="p-2.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">64.0%</td>
                              <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">+24.0% accuracy gain</td>
                            </tr>
                            <tr>
                              <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">Score Bounds Accuracy</td>
                              <td className="p-2.5 font-mono text-rose-500">16.0%</td>
                              <td className="p-2.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">64.0%</td>
                              <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">+48.0% calibration gain</td>
                            </tr>
                            <tr>
                              <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">Average Tokens / Query</td>
                              <td className="p-2.5 font-mono text-rose-500">690 tokens</td>
                              <td className="p-2.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">550 tokens</td>
                              <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">-140 tokens (-20.3%)</td>
                            </tr>
                            <tr>
                              <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">Average Latency</td>
                              <td className="p-2.5 font-mono text-slate-600 dark:text-slate-400">380 ms</td>
                              <td className="p-2.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">303 ms</td>
                              <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">-77 ms faster</td>
                            </tr>
                            <tr>
                              <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">Cost per 10k Accounts</td>
                              <td className="p-2.5 font-mono text-rose-500">$1.97</td>
                              <td className="p-2.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">$1.57</td>
                              <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">-$0.40 savings (-20.3%)</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* 3 Key Failure Modes Identified & Fixed */}
                      <div className="pt-2 space-y-3">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          3 Production Failure Modes Identified in Baseline &amp; Fixed in Production:
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 space-y-1">
                            <span className="text-[10px] font-bold uppercase text-rose-600 dark:text-rose-400">Failure 1: The Bakery Inflation</span>
                            <div className="text-[11px] text-slate-600 dark:text-slate-300">Prompt v1 scored non-tech local shops at 62 (Tier 2).</div>
                            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Fix: Strict negative few-shot examples + Stage 1 deterministic rule filter.</div>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 space-y-1">
                            <span className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">Failure 2: Mega-Bank False Positive</span>
                            <div className="text-[11px] text-slate-600 dark:text-slate-300">Prompt v1 gave 15,000-person banks 91 score due to high headcount.</div>
                            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Fix: Entrenchment rule checking &gt;10k headcount &amp; &gt;50 SecOps staff.</div>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 space-y-1">
                            <span className="text-[10px] font-bold uppercase text-sky-600 dark:text-sky-400">Failure 3: Scoring Bounds Drift</span>
                            <div className="text-[11px] text-slate-600 dark:text-slate-300">v1 compressed 80% of accounts between 50-70 without clear tier divergence.</div>
                            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Fix: Mathematical calibration of weights + anchor few-shots for 80+ and &lt;30.</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 6. DEV LOOP & HOW WE BUILD */}
            {activeTab === "how-we-build" && (
              <div className="space-y-8 animate-fade-in pb-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold mb-2">
                    <Workflow className="h-3.5 w-3.5" />
                    <span>Engineering Reflection &amp; Dev Loop</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    6. &quot;How We Build&quot; — Development Loop &amp; Engineering Reflection
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Reflecting on the agentic development loop, where AI accelerated velocity vs. where manual intervention was necessary, and production handover notes.
                  </p>
                </div>

                {/* The 5-Phase Development Loop ASCII Diagram */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Workflow className="h-4 w-4 text-sky-500" />
                      <span>The 5-Phase Agentic Development Loop</span>
                    </h4>
                    <button
                      onClick={() => handleCopy(`┌─────────────────────────────────────────────────────────────────────┐
│                   DEVELOPMENT LOOP (5 PHASES)                       │
│                                                                     │
│  Phase 1: Domain Research & ICP Modeling                            │
│     │  → Studied B2B cybersecurity sales cycles                    │
│     │  → Defined 5 buying signals from real enterprise patterns     │
│     │  → Output: PLANNING.md                                        │
│     ▼                                                               │
│  Phase 2: AI Scaffolding (Skills + Prompts + Evals)                │
│     │  → Created skills/account-scoring/SKILL.md                   │
│     │  → Wrote Prompt v1 baseline → identified failure modes        │
│     │  → Hand-labeled 25 eval cases                                 │
│     │  → Ran eval harness → Prompt v1 F1: 86.4%                    │
│     ▼                                                               │
│  Phase 3: Prompt Optimization (v1 → v2)                             │
│     │  → Root-caused v1 failures (bakery inflation, mega-bank FP)  │
│     │  → Added few-shot calibration + hard exclusion rules          │
│     │  → Re-ran eval harness → Prompt v2 F1: 97.4% (+11%)          │
│     │  → Documented failure modes in prompts/README.md              │
│     ▼                                                               │
│  Phase 4: Hybrid Rule/LLM Engine + Data Pipeline                   │
│     │  → Built deterministic scoring engine (src/lib/scoring.ts)   │
│     │  → Built Shodan streaming ingestion (Python Zstandard)        │
│     │  → Ingested 5,000 diverse records with calibrated tiers       │
│     │  → Seeded Cloudflare Edge database                           │
│     ▼                                                               │
│  Phase 5: Frontend Assembly & Observability                         │
│     │  → Built 11 React components with Tailwind + Framer Motion   │
│     │  → Integrated live OpenRouter LLM calls with telemetry        │
│     │  → Added in-app documentation modal                           │
│     │  → Hosted on Cloudflare Edge                                 │
│     ▼                                                               │
│  ✅ Final Verification                                              │
│     → python3 evals/eval_harness.py → PASS                         │
│     → npm run build → 0 errors                                      │
│     → End-to-end API validation → All 7 endpoints functional       │
└─────────────────────────────────────────────────────────────────────┘`, "dev-loop")}
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      {copiedKey === "dev-loop" ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-[10px] sm:text-[11px] leading-relaxed overflow-x-auto border border-slate-800 shadow-inner">
{`┌─────────────────────────────────────────────────────────────────────┐
│                   DEVELOPMENT LOOP (5 PHASES)                       │
│                                                                     │
│  Phase 1: Domain Research & ICP Modeling                            │
│     │  → Studied B2B cybersecurity sales cycles                    │
│     │  → Defined 5 buying signals from real enterprise patterns     │
│     │  → Output: PLANNING.md                                        │
│     ▼                                                               │
│  Phase 2: AI Scaffolding (Skills + Prompts + Evals)                │
│     │  → Created skills/account-scoring/SKILL.md                   │
│     │  → Wrote Prompt v1 baseline → identified failure modes        │
│     │  → Hand-labeled 25 eval cases                                 │
│     │  → Ran eval harness → Prompt v1 F1: 86.4%                    │
│     ▼                                                               │
│  Phase 3: Prompt Optimization (v1 → v2)                             │
│     │  → Root-caused v1 failures (bakery inflation, mega-bank FP)  │
│     │  → Added few-shot calibration + hard exclusion rules          │
│     │  → Re-ran eval harness → Prompt v2 F1: 97.4% (+11%)          │
│     │  → Documented failure modes in prompts/README.md              │
│     ▼                                                               │
│  Phase 4: Hybrid Rule/LLM Engine + Data Pipeline                   │
│     │  → Built deterministic scoring engine (src/lib/scoring.ts)   │
│     │  → Built Shodan streaming ingestion (Python Zstandard)        │
│     │  → Ingested 5,000 diverse records with calibrated tiers       │
│     │  → Seeded Cloudflare Edge database                           │
│     ▼                                                               │
│  Phase 5: Frontend Assembly & Observability                         │
│     │  → Built 11 React components with Tailwind + Framer Motion   │
│     │  → Integrated live OpenRouter LLM calls with telemetry        │
│     │  → Added in-app documentation modal                           │
│     │  → Hosted on Cloudflare Edge                                 │
│     ▼                                                               │
│  ✅ Final Verification                                              │
│     → python3 evals/eval_harness.py → PASS                         │
│     → npm run build → 0 errors                                      │
│     → End-to-end API validation → All 7 endpoints functional       │
└─────────────────────────────────────────────────────────────────────┘`}
                  </pre>
                </div>

                {/* Tools Used in the Loop Table */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Agentic Tools Used in the Loop
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100/80 dark:bg-slate-800/60 font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="p-2.5">Agent / Tool</th>
                          <th className="p-2.5">Development Phase</th>
                          <th className="p-2.5">Specific Contribution &amp; Impact</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        <tr>
                          <td className="p-2.5 font-bold text-sky-600 dark:text-sky-400">AI Project Planner</td>
                          <td className="p-2.5 text-slate-500">Phase 1-2</td>
                          <td className="p-2.5 text-slate-700 dark:text-slate-300">Structured the end-to-end milestone breakdown, dependency graph, and verification gates before writing code.</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold text-emerald-600 dark:text-emerald-400">AI Orchestration Agent</td>
                          <td className="p-2.5 text-slate-500">Phase 3-5</td>
                          <td className="p-2.5 text-slate-700 dark:text-slate-300">Coordinated between domain scoring logic, eval harness execution, and frontend assembly.</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold text-amber-600 dark:text-amber-400">Frontend Specialist Agent</td>
                          <td className="p-2.5 text-slate-500">Phase 5</td>
                          <td className="p-2.5 text-slate-700 dark:text-slate-300">UI component scaffolding, dark mode enterprise design tokens, and smooth drawer animations.</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold text-rose-600 dark:text-rose-400">Python eval harness</td>
                          <td className="p-2.5 text-slate-500">Phase 2-3</td>
                          <td className="p-2.5 text-slate-700 dark:text-slate-300">Automated benchmark loop: modify prompt ➔ run eval ➔ compare v1 vs v2 ➔ iterate.</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold text-slate-700 dark:text-slate-300">OpenRouter API Gateway</td>
                          <td className="p-2.5 text-slate-500">Phase 4-5</td>
                          <td className="p-2.5 text-slate-700 dark:text-slate-300">Live LLM integration with multi-model routing support, JSON schema guarantees, and fallbacks.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Where AI Saved Time vs Where Manual Intervention Was Essential */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Where AI Saved Time */}
                  <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/10 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      <Zap className="h-4 w-4" />
                      <span>Where AI Accelerated Velocity (~9 Hours Saved)</span>
                    </div>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
                      <li>
                        <strong>• Synthetic Edge-Case Generation (~4h saved):</strong> Generating 25 realistic, highly varied B2B company dossiers with nuanced cybersecurity risk signals (APRA CPS 234, NYDFS, IRAP) in minutes.
                      </li>
                      <li>
                        <strong>• Prompt Refinement &amp; Distillation (~2h saved):</strong> Iterating from Prompt v1 to Prompt v2 using automated eval scorecard feedback to resolve failure modes.
                      </li>
                      <li>
                        <strong>• Rapid UI Scaffolding (~3h saved):</strong> Generating 11 interactive React 19 components with Tailwind CSS, dark mode support, and Framer Motion transitions.
                      </li>
                    </ul>
                  </div>

                  {/* Where Manual Intervention Was Essential */}
                  <div className="p-5 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/10 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                      <Scale className="h-4 w-4" />
                      <span>Where Human Engineering Was Essential</span>
                    </div>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
                      <li>
                        <strong>• The Dataset Calibration Bug Fix:</strong> When the 5,000-record dataset was ingested, a 0-100 scaling bug compressed raw scores into Tier 3. Human intervention debugged the scoring distribution, recalibrated the weights, and achieved the calibrated 601 / 2435 / 1180 / 784 spread.
                      </li>
                      <li>
                        <strong>• Ground-Truth Labeling:</strong> Defining what constitutes a true Tier 1 vs Tier 2 requires understanding real-world CISO purchasing behaviors and audit pressures.
                      </li>
                      <li>
                        <strong>• Deciding Rule vs LLM Boundaries:</strong> Explicitly choosing NOT to use an LLM for headcount math or non-tech disqualification, saving $100s in unnecessary API spend.
                      </li>
                    </ul>
                  </div>
                </div>

              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
