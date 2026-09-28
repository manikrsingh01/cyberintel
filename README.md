# Firmable AI Sales Intelligence Platform

> **Take-Home Project Submission**: AI-Native Sales Intelligence Platform for a Cybersecurity Software Company.
> Built with Next.js 15, React 19, TypeScript, Tailwind CSS, Python Eval Harness, and Agentic Skills Scaffolding.

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

#### Optional: Live LLM Generation via OpenRouter
The platform works completely out-of-the-box with calibrated heuristics and includes live OpenRouter LLM support. Configure your key in `.env.local`:
```bash
OPENROUTER_API_KEY=your_openrouter_key_here
OPENROUTER_MODEL=openai/gpt-4o-mini
```
When configured, 1-click outreach drafting and CSV account scoring execute live against OpenRouter with real-time latency and cost telemetry instrumentation.

### 2. Run the Evaluation Harness (1-Command Quality Gate)
```bash
python3 evals/eval_harness.py
```
Or via npm:
```bash
npm run eval
```
This re-runs Prompt v1 vs Prompt v2 benchmarks against 25 hand-labeled test cases and outputs Precision, Recall, F1, Latency, and Cost metrics.

---

## 📁 Repository Structure

```
├── data/
│   ├── seed_companies.json     # 20 high-fidelity B2B company dossiers with cyber buying signals
│   ├── seed_companies.csv      # Exported CSV dataset matching standard CRM/Firmable schemas
│   └── traces.jsonl            # Sample telemetry trace schema log
├── skills/                     # Agent-runnable reusable skill definitions
│   ├── account-scoring/
│   │   └── SKILL.md            # Account scoring & signal detection skill (Anthropic / Cursor)
│   └── outreach-draft/
│       └── SKILL.md            # Multi-channel personalized outreach generator
├── prompts/                    # Prompt registry & versioning
│   ├── README.md               # Changelog and root-cause analysis
│   ├── v1/                     # Baseline open-ended prompts
│   │   ├── account_scoring_v1.txt
│   │   └── outreach_draft_v1.txt
│   └── v2/                     # Production few-shot calibrated prompts (Strict JSON schema)
│       ├── account_scoring_v2.txt
│       └── outreach_draft_v2.txt
├── evals/                      # Evaluation suite
│   ├── labeled_benchmark.json  # 25 hand-labeled ground-truth test cases
│   ├── eval_harness.py         # One-command eval script (Precision, Recall, F1, Cost)
│   └── RESULTS.md              # Comparative scorecard (Prompt v1 vs v2)
├── src/                        # Full-stack Next.js application
│   ├── app/                    # App Router pages and API routes (/api/companies, /api/score, etc.)
│   ├── components/             # UI Components (FilterBar, CompanyTable, Drawer, Outreach, Telemetry)
│   └── lib/                    # Hybrid scoring logic, types, and telemetry engine
├── docs/                       # Supporting guides & video script
│   ├── COST_MODEL.md           # Production unit economics ($/record)
│   ├── LOOM_SCRIPT.md          # 3-5 minute video demo walkthrough script
│   └── PLAN-ai-sales-platform.md
├── PLANNING.md                 # Target ICP definition & buying signals rationale
├── ARCHITECTURE.md             # System design, Rule vs. LLM division of labor, telemetry schema
└── HOW_WE_BUILD.md             # 1/2 page reflection on agentic development workflow
```

---

## 🎯 Key Deliverables Check

- [x] **Working Hosted Web App**: Interactive dashboard with real-time filtering, company drawer, 1-click AI outreach generator, live telemetry viewer, and CSV drag-and-drop.
- [x] **Innovative Derived Sales Intelligence**: 
  - **Security Debt Ratio**: `(Dev Growth % × Dev Headcount) ÷ SecOps Staff` (e.g., `42x Debt`).
  - **Estimated Deal Value (ACV)**: Dynamically calculated ARR based on employee headcount & compliance tier (e.g., `$38,000 / yr`).
  - **Audit Countdown Urgency Window**: Pulsing countdown alerts (e.g., `⚡ APRA CPS 234 in 42 Days`).
  - **Sales Battlecards (Objection Killer)**: Contextual anticipated buyer objections and winning counter-hooks in every company drawer.
- [x] **Real-Time AI Telemetry & Observability Cockpit**: Live tracking of OpenRouter API calls (`latency_ms`, `tokens`, `cost_usd`), persistent JSONL logging (`data/traces.jsonl`), client-side cache savings (`0ms / $0.00`), and live UI dashboard.
- [x] **Skills Scaffolding**: Standard `SKILL.md` files in `skills/` with triggers, schemas, and worked examples.
- [x] **Prompt Versioning**: Tracked `v1` vs `v2` prompts with explicit failure mode documentation.
- [x] **Hand-Labeled Evals**: 25 ground-truth scenarios with a one-command runner measuring precision (+19%), recall (100%), and cost.
- [x] **Comprehensive Documentation**: `PLANNING.md`, `ARCHITECTURE.md`, `HOW_WE_BUILD.md`, and `LOOM_SCRIPT.md`.

