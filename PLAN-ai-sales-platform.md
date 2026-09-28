# Project Plan: AI Sales Intelligence Platform (Cybersecurity B2B)

> **Target Goal:** Build an end-to-end, production-grade AI Sales Intelligence Platform tailored for a cybersecurity software company, strictly fulfilling every requirement in Firmable's `Task.txt`.

---

## 1. Project Overview & Deliverables Matrix

| # | Task Requirement (`Task.txt`) | Implementation Architecture | Target File / Artifact |
|---|---|---|---|
| **1** | **Working, Hosted App** | Next.js 15 + React 19 + Tailwind CSS + Lucide Icons + Framer Motion. Dark mode SaaS interface with live interactive dashboard, filters, company drawer, outreach generator, telemetry drawer. | `web-app/` (Deployable to Vercel/Render) |
| **2** | **B2B Cybersecurity ICP & Signals** | Real ICP criteria (Fintech, Healthtech, SaaS, E-commerce; 50–2,000 employees). 6 distinct cyber buying signals (Compliance deadlines, rapid hiring without SecOps, cloud migrations, legacy stack risk, breach proximity). | `src/lib/scoring.ts`, `data/companies.json` |
| **3** | **Data Ingestion Pipeline** | Hybrid ingestion supporting pre-loaded seed dataset, batch CSV/JSON parser, and on-demand UI upload / custom domain enrichment. | `src/lib/ingestion.ts`, `scripts/seed_data.py` |
| **4** | **Skills Scaffolding** | Formal Anthropic/Cursor agent-loadable skill with triggers, inputs, outputs, dependent prompts, and worked example. | `skills/account-scoring/SKILL.md`, `skills/outreach-draft/SKILL.md` |
| **5** | **Prompt Versioning** | Tracked prompts with clear evolution from v1 (basic prompt) to v2 (few-shot, strict schema, anti-hallucination constraints). | `prompts/v1/scoring_v1.txt`, `prompts/v2/scoring_v2.txt`, `prompts/README.md` |
| **6** | **Hand-Labeled Eval Set** | 25 hand-curated real-world test cases covering high-priority, edge-case, and disqualified companies with ground-truth labels. | `evals/labeled_benchmark.json` |
| **7** | **One-Command Eval Harness** | Automated benchmark script comparing Prompt V1 vs V2, calculating Precision, Recall, F1 score, latency, and cost per query. | `evals/eval_harness.py`, `npm run eval` |
| **8** | **Tracing & Observability** | Telemetry logging schema capturing: `call_id`, `timestamp`, `model`, `prompt_version`, `input_tokens`, `output_tokens`, `latency_ms`, `cost_usd`, `decision`. Live viewer in UI. | `src/lib/telemetry.ts`, `data/traces.jsonl` |
| **9** | **Cost Economics & Math** | Documented unit economics: tokens × volume × frequency, tiering (cheap classifier vs reasoning model), and production cost ceiling. | `docs/COST_MODEL.md`, in `ARCHITECTURE.md` |
| **10** | **Planning Document** | Explaining target ICP, buying signals rationale, sales personas, and why these use cases were chosen. | `PLANNING.md` |
| **11** | **Architecture Document** | System architecture diagram, Rule-vs-LLM split rationale, telemetry schema, data flow, and trade-offs. | `ARCHITECTURE.md` |
| **12** | **"How You Build" Reflection** | 1/2 to 1 page reflection on agentic workflows, AI velocity vs manual engineering, and 1 known weakness. | `HOW_WE_BUILD.md` |
| **13** | **Loom Walkthrough Script** | 3–5 min presentation script walking through the live app, eval harness, and architecture. | `docs/LOOM_SCRIPT.md` |

---

## 2. Technical Architecture & Tech Stack

```
┌────────────────────────────────────────────────────────────────────────┐
│                        User / Sales Rep Browser                        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Next.js 15 Frontend (React 19 + Tailwind)            │
│  - Pipeline Table (Filter by Urgency, Sector, Headcount, Signals)      │
│  - Account Deep-Dive Drawer (Attack Surface, Triggers, Decision Makers)│
│  - 1-Click AI Outreach Copilot (Cold Email & LinkedIn angles)          │
│  - Live Telemetry & Cost Modal (Tokens, Latency, Cost/Call)            │
│  - CSV Drag & Drop / Custom Domain Ingestion                           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                ┌───────────────────┴───────────────────┐
                ▼                                       ▼
┌───────────────────────────────┐       ┌────────────────────────────────┐
│  Rule Engine (Deterministic)  │       │   LLM Engine (High-Value AI)   │
│  - Headcount & Geo filtering  │       │   - Contextual Signal Synthesis│
│  - Compliance sector flags    │       │   - Persona Pain-Point Framing │
│  - Headcount disparity math   │       │   - Tailored Sales Outreach    │
│  (Cost: $0.00 / Latency: 2ms) │       │   (Model: gpt-4o-mini/claude)  │
└───────────────┬───────────────┘       └────────────────┬───────────────┘
                │                                        │
                └───────────────────┬────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Observability & Tracing Scaffolding                  │
│     - Telemetry Logger (JSONL / SQLite schema)                         │
│     - Eval Harness (Automated Precision/Recall/F1 benchmark runner)    │
│     - Reusable Agent Skills (`skills/account-scoring/SKILL.md`)        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Phase Breakdown

### Phase 1: Data Architecture & Signal Engineering
- [ ] Define Company Schema: Domain, Name, Sector, Headcount, Revenue, Tech Stack, Open Job Roles, Recent Events/News.
- [ ] Build Cyber Buying Signals Engine:
  1. `Signal 1: Compliance Mandate` (Fintech/Healthtech facing SOC 2, HIPAA, PCI-DSS, ISO 27001).
  2. `Signal 2: Security Debt Disparity` (Engineering team > 20% growth in 6 mo, 0 dedicated SecOps/CISO).
  3. `Signal 3: Infrastructure Expansion` (Recent migration to multi-cloud AWS + GCP + Kubernetes).
  4. `Signal 4: Exposed Attack Surface` (External APIs, self-hosted legacy auth).
  5. `Signal 5: Regulatory / Breach Trigger` (Sub-sector hit by ransomware, supply-chain scrutiny).
- [ ] Generate high-fidelity seed dataset (60+ diverse companies across Tier 1, Tier 2, Tier 3, and Disqualified).
- [ ] Implement flexible ingestion pipeline (accepts custom CSV uploads, raw JSON, or URL).

### Phase 2: AI Scaffolding (Skills, Prompts, Tracing, Cost)
- [ ] **Prompt Engineering & Versioning**:
  - `prompts/v1/scoring_v1.txt`: Baseline prompt without strict format constraints.
  - `prompts/v2/scoring_v2.txt`: Few-shot prompt with strict JSON schema, deterministic scoring bounds, and zero-hallucination rules.
  - `prompts/v2/outreach_v2.txt`: Context-grounded SDR cold email & LinkedIn message generator.
- [ ] **Skills Creation**:
  - Create `skills/account-scoring/SKILL.md` matching Anthropic/Cursor specification (YAML frontmatter, triggers, inputs, outputs, dependent prompts, worked example).
  - Create `skills/outreach-draft/SKILL.md`.
- [ ] **Telemetry & Tracing**:
  - Standardized JSONL logger schema: `call_id`, `timestamp`, `model`, `prompt_version`, `latency_ms`, `tokens_in`, `tokens_out`, `cost_usd`, `input_summary`, `output_summary`.
- [ ] **Cost Economics**:
  - Calculate unit cost model ($0.15/1M input tokens, $0.60/1M output tokens for mini models vs. frontier models).
  - Production budgeting and monthly cost ceiling table.

### Phase 3: Hand-Labeled Evals & One-Command Eval Harness
- [ ] Hand-label 25 diverse test companies (`evals/labeled_benchmark.json`):
  - Expected Score Tier: `TIER_1_CRITICAL` (80–100), `TIER_2_MODERATE` (50–79), `TIER_3_LOW` (25–49), `DISQUALIFIED` (0–24).
  - Expected Key Signals and Risk Assessment.
- [ ] Implement `evals/eval_harness.py`:
  - Runs V1 prompt against benchmark -> logs results.
  - Runs V2 prompt against benchmark -> logs results.
  - Generates comparative table: Accuracy, Precision, Recall, F1 score, average latency, total token cost.
  - Saves automated markdown report to `evals/RESULTS.md`.

### Phase 4: Modern Web Application (Frontend + API)
- [ ] Initialize Next.js 15 app with Tailwind CSS and modern dark-mode aesthetic.
- [ ] **Components**:
  - `Header & Metrics Bar`: Total accounts analyzed, Tier 1 hot leads count, average risk score, token usage tracker.
  - `Filter & Search Bar`: Real-time filter by Sector, Headcount range, Risk Tier, and Signal tags.
  - `Accounts Table / Grid`: Clean interactive table with score badges, company tags, and quick-action buttons.
  - `Company Detail Drawer`: Deep dive with attack surface indicators, compliance urgency timeline, decision-maker recommendations.
  - `AI Outreach Generator Modal`: Instant email & LinkedIn message generation with copy-to-clipboard and tone selector (Casual SDR vs Executive VP).
  - `Live Traces Inspector`: Visual slide-over showing all LLM calls, latency, prompt version, and live cost calculation.
  - `CSV Upload Modal`: Drag-and-drop any CSV for instant scoring.

### Phase 5: Production Documentation & Review
- [ ] `PLANNING.md`: The sales use cases chosen and why (ideal customer profile, buying signals, prioritization).
- [ ] `ARCHITECTURE.md`: System design, Rule vs. LLM split, cost model, schema, and trade-offs.
- [ ] `HOW_WE_BUILD.md`: 1/2 to 1 page reflection on agentic development workflow, AI speedups vs bottlenecks, and known weaknesses.
- [ ] `docs/LOOM_SCRIPT.md`: Step-by-step walkthrough script for the demo recording.
- [ ] Pre-flight audit and automated verification tests.

---

## 4. Verification & Quality Gates

| Gate | Verification Check | Command | Pass Criteria |
|---|---|---|---|
| **Evals** | Eval harness execution | `python evals/eval_harness.py` | V2 precision & recall > 85%, report generated |
| **Lint & Type** | TypeScript & ESLint validation | `npm run lint` / `npx tsc --noEmit` | 0 errors |
| **Build** | Next.js production build | `npm run build` | Clean build, 0 fatal errors |
| **Telemetry** | Live tracing test | In-app trace inspector | Verified JSONL log output with latency & cost |
| **Skills** | Agent skill compliance | Check frontmatter & schema | Valid Anthropic/Cursor SKILL.md format |

---

## 5. Next Steps

1. User confirms the plan.
2. Initialize repository and write core data schemas + seed dataset.
3. Build the AI Scaffolding (`skills/`, `prompts/`, `evals/`).
4. Develop the Next.js interactive web app.
5. Generate all required documentation (`PLANNING.md`, `ARCHITECTURE.md`, `HOW_WE_BUILD.md`).
