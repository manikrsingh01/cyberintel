# "How We Build" — Engineering Reflection & Dev Loop

> **Overview**: Reflection on development loop, agentic workflows, where AI accelerated velocity vs. where manual intervention was necessary.

---

## 1. The Agentic Development Loop

Building this platform was designed as an **AI-native workflow from day one**. The loop followed a deliberate sequence where each phase validated the previous:

```
┌─────────────────────────────────────────────────────────────────────┐
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
│     │  → Seeded Cloudflare edge database                           │
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
└─────────────────────────────────────────────────────────────────────┘
```

### Tools Used in the Loop

| Tool | Role | Contribution |
|---|---|---|
| **AI Project Planner** | Phase 1-2 | Structured the end-to-end milestone breakdown, dependency graph, and verification gates before writing code |
| **AI Orchestration Agent** | Phase 3-5 | Coordinated between domain scoring logic, eval harness execution, and frontend assembly |
| **Frontend Specialist Agent** | Phase 5 | UI component scaffolding, design system, dark mode aesthetic |
| **Python eval harness** | Phase 2-3 | Automated benchmark loop: modify prompt → run eval → compare v1 vs v2 → iterate |
| **OpenRouter API** | Phase 4-5 | Live LLM integration with multi-model routing support |

---

## 2. Where AI Saved the Most Time

### 2.1 Synthetic Edge-Case Generation (~4 hours saved)
Generating 25 realistic, highly varied B2B company dossiers with nuanced cybersecurity risk signals would have taken 4–5 hours of manual writing. The diversity required was substantial: APRA CPS 234 in Australia, NYDFS in the US, IRAP for defense, industrial IoT edge devices, fintech Series B, healthcare PHI processing, and disqualified non-tech businesses.

AI generated the initial seed matrix in minutes, then I curated and corrected ground-truth labels manually.

### 2.2 Prompt Refinement & Few-Shot Distillation (~2 hours saved)
Translating abstract sales instincts into concrete system prompt rules was accelerated through rapid prompt iterations. For example: discovering that v1 rated local bakeries at 65/100 because "every business uses computers" was instantly identified by the eval harness, and the fix (hard exclusion criteria) was implemented in v2 within one iteration.

### 2.3 Frontend Component Scaffolding (~3 hours saved)
Assembling 11 UI components (filter bar, company table with pagination, slide-out drawer, outreach modal with tone toggle, telemetry dashboard, docs modal with vertical tabs) was completed in a single orchestrated pass. AI-generated the structural JSX, then I refined the interactions and data flow.

### 2.4 Data Pipeline Architecture (~1 hour saved)
The Zstandard streaming ingestion script (`scripts/ingest_5k_diverse.py`) required complex entity resolution logic (grouping Shodan records by corporate domain, filtering ISP residential IPs). AI scaffolded the pipeline structure; I debugged the edge cases in domain deduplication.

---

## 3. Where AI Cost More Than Doing It by Hand

### 3.1 Mathematical Scoring vs Feature Engineering
> **The Data Engineer's Lesson**

Asking an LLM to reliably calculate whether `growth_pct / security_headcount` represented an outsized risk resulted in fuzzy, non-deterministic scores across repeated runs, wasting hundreds of tokens per call.

**The fix**: Pure deterministic Feature Engineering in code. Writing 20 lines of ratio math (`Security Debt Ratio`, `Attack Surface Index`) eliminated prompt drift, saved 60%+ in API tokens, and yielded 100% reproducible results. This is documented in `ARCHITECTURE.md` §3 as the Rule-vs-LLM split.

### 3.2 Schema Enforcement & Parser Rigidity
Early prompts frequently drifted into markdown code-fence formatting (````json ... ````) or added conversational commentary, breaking downstream data pipelines.

**The fix**: Implementing strict Data Contracts using the TypeScript `Company` interface, `response_format: { type: "json_object" }` in OpenRouter calls, and defensive JSON parsing with code-fence stripping in `src/lib/openrouter.ts`.

### 3.3 Dataset Distribution Calibration
The initial data loader re-scored all 5,000 pre-calibrated records through the heuristic scoring engine, destroying the carefully balanced tier distribution. This was a subtle bug where AI-generated code was "too helpful" — applying scoring to data that was already scored.

**The fix**: Modified `src/lib/mockData.ts` to detect pre-scored records and pass them through directly, only scoring genuinely new/unscored records.

---

## 4. Development Timeline Summary

| Day | Activities | Key Output |
|---|---|---|
| Day 1 | Domain research, ICP definition, B2B sales prospecting study | PLANNING.md, initial buying signals taxonomy |
| Day 2 | Skills scaffolding, prompt v1 baseline, eval dataset creation | skills/, prompts/v1/, evals/labeled_benchmark.json |
| Day 3 | Eval harness development, prompt v2 optimization | eval_harness.py, prompts/v2/, RESULTS.md |
| Day 4 | Hybrid scoring engine, data ingestion pipeline | scoring.ts, ingest_5k_diverse.py, seed_companies.json |
| Day 5 | Next.js frontend (table, filters, drawer, modals) | 11 components, API routes, dark mode UI |
| Day 6 | Live LLM integration, telemetry, observability | OpenRouter integration, telemetry.ts, traces.jsonl |
| Day 7 | Documentation, deployment, final verification | ARCHITECTURE.md, HOW_WE_BUILD.md, Cloudflare deploy |
