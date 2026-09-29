# CyberIntel — AI Sales Intelligence Platform

> **Production Platform**: AI-Native Sales Intelligence Platform for Enterprise Cybersecurity Vendors.
> Built with Next.js 15, React 19, TypeScript, Tailwind CSS, Python Eval Harness, and Agentic Skills Scaffolding.

**Live Hosted App**: [https://project-cyberintel.pages.dev/](https://project-cyberintel.pages.dev/)

---

## ⚡ Quick Start

### 1. Run the Web Application Locally
```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to explore the dashboard.

#### API Keys & Flexible LLM Inference
The platform includes built-in AI Copilot generation via OpenRouter:
1. **Interactive In-App Settings**: Click **API Key** or **Tools → API Key & Quota Settings** in the dashboard header. You can paste your own OpenRouter key (`sk-or-v1-...`) stored client-side in your browser for zero-latency, private inference.
2. **Complimentary Trial Quota**: By default, new users receive 25 free live generations powered by the platform's edge credentials. When trial credits are exhausted, the app prompts you to configure your personal OpenRouter key.
3. **Environment Variable Fallback**: For automated server deployments, set your key in `.env.local`:
```bash
OPENROUTER_API_KEY=your_openrouter_key_here
OPENROUTER_MODEL=openai/gpt-4o-mini
```

### 2. Run the Evaluation Harness (One-Command Quality Gate)
```bash
python3 evals/eval_harness.py
```
Or via npm:
```bash
npm run eval
```
This re-runs Prompt v1 vs Prompt v2 benchmarks against 25 hand-labeled test cases and outputs Precision, Recall, F1, Latency, and Cost metrics.

### 3. Build for Production
```bash
npm run build    # Standard Next.js build
npm start        # Run production server
```

---

## 📁 Repository Structure

```
cyberintel/
│
├── data/                              # 📊 Dataset & Telemetry
│   ├── seed_companies.json            # 5,000 diverse company profiles (pre-scored, calibrated tiers)
│   ├── seed_companies.csv             # CSV export for CRM import
│   └── traces.jsonl                   # Persistent LLM telemetry trace log (JSONL)
│
├── skills/                            # 🤖 Agent-Loadable Reusable Skills
│   ├── account-scoring/
│   │   └── SKILL.md                   # Account scoring & signal detection skill
│   └── outreach-draft/                #   (Trigger conditions, I/O schema, worked examples)
│       └── SKILL.md                   # Multi-channel personalized outreach generator
│
├── prompts/                           # 📝 Prompt Registry & Versioning
│   ├── README.md                      # Changelog: failure modes, root cause, improvements
│   ├── v1/                            # Baseline prompts (deprecated)
│   │   ├── account_scoring_v1.txt     #   Open-ended, prone to score inflation
│   │   └── outreach_draft_v1.txt      #   Generic, buzzword-heavy
│   └── v2/                            # Production prompts (calibrated)
│       ├── account_scoring_v2.txt     #   Few-shot, strict JSON schema, hard exclusions
│       └── outreach_draft_v2.txt      #   Signal-grounded, persona-adapted, multi-channel
│
├── evals/                             # 🧪 Evaluation Suite
│   ├── labeled_benchmark.json         # 25 hand-labeled ground-truth test cases
│   ├── eval_harness.py                # One-command eval script (Precision/Recall/F1/Cost)
│   └── RESULTS.md                     # Comparative scorecard: Prompt v1 vs v2
│
├── scripts/                           # 🔧 Data Engineering Scripts
│   ├── ingest_b2_dataset.py           # Streaming Shodan B2 archive parser
│   ├── ingest_5k_diverse.py           # Calibrated 5K diverse dataset generator
│   ├── ingest_50k_to_d1.py            # Batch database seeding
│   └── generate_d1_seed.js            # SQL seed file generator
│
├── src/                               # 💻 Full-Stack Next.js Application
│   ├── app/
│   │   ├── page.tsx                   # Main dashboard page
│   │   ├── layout.tsx                 # Root layout with dark mode
│   │   ├── globals.css                # Global styles
│   │   └── api/                       # 7 API Route Handlers
│   │       ├── companies/route.ts     #   GET/POST company data (live or JSON fallback)
│   │       ├── score/route.ts         #   POST deterministic scoring
│   │       ├── score-account/route.ts #   POST live LLM scoring via OpenRouter
│   │       ├── outreach/route.ts      #   POST deterministic outreach
│   │       ├── generate-outreach/     #   POST live LLM outreach generation
│   │       ├── telemetry/route.ts     #   GET/POST telemetry stats & traces
│   │       └── traces/route.ts        #   GET raw trace log
│   ├── components/                    # 12 React UI Components
│   │   ├── DashboardHeader.tsx        #   Header with branding & quick action buttons
│   │   ├── SettingsModal.tsx          #   In-app OpenRouter API key & trial quota cockpit
│   │   ├── MetricsSummary.tsx         #   KPI cards (total accounts, Tier 1, score, tokens)
│   │   ├── FilterBar.tsx              #   Search, industry, tier pills, signal chips
│   │   ├── CompanyTable.tsx           #   Paginated table (20/page), sortable by score
│   │   ├── CompanyDrawer.tsx          #   Side panel deep dive (signals, buyer, battlecard)
│   │   ├── OutreachModal.tsx          #   AI copilot (SDR/VP toggle, copy-to-clipboard)
│   │   ├── ObservabilityModal.tsx     #   Live telemetry cockpit (tokens, cost, latency)
│   │   ├── CsvUploadModal.tsx         #   Drag & drop CSV scoring
│   │   ├── EvalModal.tsx              #   In-app benchmark results viewer
│   │   ├── DocsModal.tsx              #   5-tab interactive documentation hub
│   │   └── TelemetryDrawer.tsx        #   Compact trace list
│   └── lib/                           # Core Business Logic
│       ├── types.ts                   #   TypeScript interfaces (Company, Trace, etc.)
│       ├── apiKeyManager.ts           #   Client-side OpenRouter API key & quota manager
│       ├── scoring.ts                 #   Hybrid Rule/LLM scoring engine
│       ├── openrouter.ts              #   OpenRouter API client with telemetry
│       ├── telemetry.ts               #   Trace logger (JSONL + ring buffer)
│       ├── db.ts                      #   Database storage client
│       └── mockData.ts                #   Pre-scored seed data loader
│
├── docs/                              # 📚 Supporting Documentation
│   └── COST_MODEL.md                  # Production unit economics ($/record, budget ceilings)
│
├── PLANNING.md                        # 🎯 Target ICP, buying signals, prospecting pillars
├── ARCHITECTURE.md                    # 🏗️ System design, Rule-vs-LLM split, telemetry schema
├── HOW_WE_BUILD.md                    # 🔄 Development loop reflection & known weaknesses
├── README.md                          # 📖 This file
├── schema.sql                         # Database schema (3 tables)
├── wrangler.toml                      # Cloudflare deployment config
├── package.json                       # Dependencies & scripts (dev, build, eval)
└── tsconfig.json                      # TypeScript configuration
```

---

## 🎯 Task Requirements → Deliverables Matrix

| # | Task Requirement | Status | Evidence |
|---|---|---|---|
| 1 | **Working, hosted app** | ✅ | Cloudflare edge deployment (5,000 accounts), 7 API endpoints |
| 2 | **Full source code** | ✅ | `src/` — 12 components, 7 lib modules, 7 API routes |
| 3 | **`skills/` with `SKILL.md`** | ✅ | `skills/account-scoring/SKILL.md`, `skills/outreach-draft/SKILL.md` |
| 4 | **`prompts/` with versioned prompts** | ✅ | `prompts/v1/` (baseline) + `prompts/v2/` (production) + `README.md` changelog |
| 5 | **`evals/` with labeled sets** | ✅ | 25 hand-labeled cases, one-command harness, `RESULTS.md` report |
| 6 | **Planning document** | ✅ | `PLANNING.md` — ICP, 5 buying signals, 5 prospecting pillars |
| 7 | **Architecture document** | ✅ | `ARCHITECTURE.md` — diagrams, Rule-vs-LLM split, cost model, schema |
| 8 | **"How We Build" reflection** | ✅ | `HOW_WE_BUILD.md` — dev loop, AI speedups, known weaknesses |
| 9 | **Interactive Docs & UI Tour** | ✅ | `src/components/DocsModal.tsx` — 5-tab live in-app documentation hub |
| 10 | **Tracing & observability** | ✅ | `telemetry.ts`, `data/traces.jsonl`, in-app `ObservabilityModal.tsx` |
| 11 | **Prompt versioning** | ✅ | v1→v2 with documented failure modes, changelog, eval comparison |
| 12 | **Cost monitoring** | ✅ | `docs/COST_MODEL.md` + `ARCHITECTURE.md` §6 — tokens × volume × frequency |
| 13 | **Eval harness (one-command)** | ✅ | `python3 evals/eval_harness.py` or `npm run eval` |

---

## 📊 Dataset: Calibrated Tier Distribution

The 5,000-company dataset is derived from real Backblaze B2 Shodan internet scan data, with calibrated tier distribution:

| Tier | Count | Percentage | Score Range | Action |
|---|---|---|---|---|
| 🔴 **TIER 1 CRITICAL** | 601 | 12.0% | 78-99 | Immediate 24hr SDR outbound |
| 🟡 **TIER 2 MODERATE** | 2,435 | 48.7% | 58-77 | Weekly nurture sequence |
| 🟢 **TIER 3 LOW** | 1,180 | 23.6% | 42-57 | Automated marketing drip |
| ⚫ **DISQUALIFIED** | 784 | 15.7% | 22-38 | Suppressed from outreach |

**Signal Coverage**: Active CVEs, Expired SSL, Exposed Databases (MySQL/PostgreSQL/Redis), Admin Port Exposure (RDP/SMB), Security Debt Disparity, Attack Surface Sprawl.

---

## 📈 Eval Harness Results: Prompt v1 → v2

| Metric | v1 (Baseline) | v2 (Production) | Improvement |
|---|---|---|---|
| **ICP Precision** | 76.0% | **95.0%** | +19.0% |
| **ICP Recall** | 100.0% | **100.0%** | — |
| **F1 Score** | 86.4% | **97.4%** | +11.1% |
| **Tier Accuracy** | 40.0% | **64.0%** | +24.0% |
| **Tokens / Query** | 690 | **550** | -20.3% |
| **Cost / 10K accounts** | $1.97 | **$1.57** | -$0.40 |

---

## 🔗 Key Documentation Links

| Document | Purpose |
|---|---|
| [PLANNING.md](PLANNING.md) | ICP definition, buying signals, prospecting pillars, data engineering approach |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design, Rule-vs-LLM split, API routes, database schema |
| [HOW_WE_BUILD.md](HOW_WE_BUILD.md) | Agentic dev loop, AI speedups vs manual effort, known weaknesses |
| [docs/COST_MODEL.md](docs/COST_MODEL.md) | Token economics, model tiering, production budget ceilings |
| [prompts/README.md](prompts/README.md) | Prompt versioning changelog with failure mode analysis |
| [evals/RESULTS.md](evals/RESULTS.md) | Detailed benchmark comparison (25 test cases) |
