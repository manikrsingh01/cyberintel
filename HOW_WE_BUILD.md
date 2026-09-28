# "How We Build" — Engineering Reflection & Dev Loop

> **Prompt**: Reflect on your development loop, agentic tools used (Claude Code, Cursor, Antigravity, API scripts), where AI accelerated velocity vs. where manual intervention was necessary, and one known weakness to flag when handing this over to a teammate.

---

## 1. The Agentic Development Loop

Building this platform was designed as an **AI-native workflow from day one**:

```
[ Domain Modeling & Sales ICP Research ]
                   │
                   ▼
  [ Agentic Scaffolding (Skills & Prompts) ]
                   │
                   ▼
    [ Hand-Labeled Evals & Baseline Run ]
                   │
                   ▼
  [ Prompt Optimization & Error Analysis (v1 -> v2) ]
                   │
                   ▼
   [ Hybrid Rule/LLM Engine Implementation ]
                   │
                   ▼
[ Next.js 15 UI Assembly & Telemetry Integration ]
```

### Tools Used in the Loop:
1. **Antigravity Specialist Personas**:
   - `project-planner`: Structured the end-to-end milestone breakdown, dependency graph, and verification gates before writing code.
   - `orchestrator`: Coordinated between domain scoring logic, eval harness execution, and frontend assembly.
2. **Interactive Benchmark Feedback (The Eval Loop)**:
   - Rather than guessing whether a prompt change was an improvement, the Python eval harness (`python3 evals/eval_harness.py`) served as the automated test gate.
   - Running the eval suite against 25 labeled scenarios instantly revealed when Prompt v1 was hallucinating high scores for non-tech local retail shops.

---

## 2. Where AI Saved the Most Time

1. **Synthetic Edge-Case Generation**: Generating 25 realistic, highly varied B2B company dossiers with nuanced cybersecurity risk signals (e.g., *APRA CPS 234 in Australia, NYDFS in the US, IRAP for defense, industrial IoT edge devices*) would have taken 4–5 hours of manual writing. AI generated the initial seed matrix in minutes.
2. **Prompt Refinement & Few-Shot Distillation**: Translating abstract sales instincts into concrete system prompt rules (e.g. *hard exclusion criteria for mega-banks with 300-person in-house teams*) was accelerated through rapid prompt iterations.
3. **Frontend Component Scaffolding**: Assembling the UI components (filter bar, slide-out drawer, telemetry drawer, modal dialogs) using Tailwind CSS and Lucide icons was completed in a single pass.

---

## 3. Where AI Cost More than Doing It by Hand (The AI Data Engineering Lesson)

1. **Mathematical Scoring vs. Feature Engineering**:
   - Asking an LLM to reliably calculate whether `growth_pct / security_headcount` represented an outsized risk resulted in fuzzy, non-deterministic scores across repeated runs, wasting hundreds of tokens per call.
   - **The Data Engineer's fix**: Pure, deterministic Feature Engineering in code. Writing 20 lines of deterministic ratio math (`Security Debt Ratio`, `Attack Surface Index`) eliminated prompt drift, saved 60%+ in API tokens, and yielded 100% reproducible results.
2. **Schema Enforcement & Parser Rigidity**:
   - Early prompts frequently drifted into markdown code-fence formatting (````json ... ````) or added conversational commentary, breaking downstream data pipelines.
   - **The fix**: Implementing strict Data Contracts using TypeScript/Zod schemas, negative prompt boundaries, and defensive JSON parsing.

---

## 4. Known Weakness Flagged for Teammates

> ⚠️ **Known Weakness: Static Signal Decay & Entity Resolution**

When handing this repository over to a team member for production scaling, the single biggest limitation to address is **entity resolution and freshness of company data**:

* **Current State**: The system relies on point-in-time firmographic attributes (e.g. current headcount, current engineering growth).
* **The Vulnerability**: If a company undergoes a sudden hiring freeze, acquires an existing security company, or has their compliance audit pushed back, the risk score will remain artificially high until the next batch crawl.
* **Recommended Next Step**: Connect the ingestion pipeline to a live event stream (e.g. GitHub public commit frequency, LinkedIn headcount scraping webhooks, or Firmable's live API) with a TTL (Time-To-Live) cache invalidation policy of 7 days per account.
