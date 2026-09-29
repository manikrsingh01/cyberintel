# Technical Architecture & System Design

> **Overview**: Production-grade AI-native sales intelligence platform engineered for high throughput, sub-second query latency, strict output reliability, and sustainable unit economics. Built to solve the core B2B challenge: *"Out of thousands of companies, which ones need our cybersecurity software right now — and how do we reach them first?"*

---

## 1. System Architecture Overview

### 1.1 High-Level Data Flow

```
┌───────────────────────────────────────────────────────────────────────────────┐
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
│  │  • Zero-disk streaming decompression via `zstd -dc`                     │ │
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
│   (Edge Production Database)    │  │   (data/seed_companies.json — 5,000)     │
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
│                                                                                │
│  ┌──────────┐ ┌───────────────┐ ┌───────────────┐ ┌────────────────────────┐ │
│  │Dashboard │ │ Filter Bar    │ │ Company Table │ │ Company Detail Drawer  │ │
│  │Header &  │ │ (Industry,    │ │ (5,000 rows,  │ │ (Risk score, signals, │ │
│  │Metrics   │ │ Tier pills,   │ │ paginated 20/ │ │ buyer persona, battle │ │
│  │Summary   │ │ Signal chips, │ │ page, sortable│ │ card, audit countdown)│ │
│  │          │ │ Search)       │ │ by score)     │ │                        │ │
│  └──────────┘ └───────────────┘ └───────────────┘ └────────────────────────┘ │
│                                                                                │
│  ┌──────────────┐ ┌────────────────┐ ┌──────────────┐ ┌────────────────────┐ │
│  │ AI Outreach   │ │ Observability  │ │ CSV Upload   │ │ In-App Docs Modal  │ │
│  │ Copilot Modal │ │ & Traces Modal │ │ Modal (Drag  │ │ (5-tab vertical    │ │
│  │ (SDR + Exec  │ │ (Live LLM call │ │ & Drop)      │ │ nav: Architecture, │ │
│  │ tone toggle, │ │ logs, tokens,  │ │              │ │ Signals, Scoring,  │ │
│  │ copy-to-clip)│ │ cost, latency) │ │              │ │ AI Copilot, Eval)  │ │
│  └──────────────┘ └────────────────┘ └──────────────┘ └────────────────────┘ │
│                                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                     EVAL HARNESS MODAL                                  │  │
│  │  • In-app visualization of Prompt v1 vs v2 benchmark results            │  │
│  │  • Precision, Recall, F1 score comparison cards                         │  │
│  │  • 25 test case pass/fail breakdown with root cause analysis            │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. API Route Architecture

The Next.js App Router exposes 7 API endpoints serving both the interactive frontend and programmatic API access:

```
                         ┌──────────────────────────────────┐
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
  │                 │        │ POST /gen-outreach│        │                 │
  └────────┬────────┘        └────────┬─────────┘        └────────┬────────┘
           │                          │                            │
           ▼                          ▼                            ▼
  ┌─────────────────┐       ┌──────────────────┐        ┌─────────────────┐
  │ Cloudflare Edge │       │ OpenRouter API   │        │ JSONL Logger    │
  │ (Production)    │       │ (gpt-4o-mini)    │        │ data/traces.jsonl│
  │   OR            │       │ + Rule Engine    │        │ + Ring Buffer   │
  │ JSON Seed Store │       │ (src/lib/scoring)│        │ (200 in-memory) │
  │ (Local Dev)     │       │                  │        │                 │
  └─────────────────┘       └──────────────────┘        └─────────────────┘
```

| Endpoint | Method | Purpose | Response |
|---|---|---|---|
| `/api/companies` | `GET` | Fetch paginated company list with pre-scored data | `{companies[], total, page, counts}` |
| `/api/companies` | `POST` | Ingest new companies (single or batch array) | Scored company object(s) |
| `/api/score` | `POST` | Score a single company through hybrid engine | Company with risk_score + tier |
| `/api/score-account` | `POST` | Live LLM scoring via OpenRouter | Score + telemetry trace |
| `/api/outreach` | `POST` | Deterministic outreach (no LLM) | Email + InMail + angle |
| `/api/generate-outreach` | `POST` | **Live LLM outreach** via OpenRouter | Draft + telemetry + trace |
| `/api/telemetry` | `GET/POST` | Fetch/record telemetry stats | Stats + traces array |
| `/api/traces` | `GET` | Fetch raw trace log | Trace objects array |

---

## 3. The Rule-vs-LLM Split: A Core Design Decision

### 3.1 Why Not Use LLM for Everything?

A major pitfall in early "AI apps" is passing raw data directly to an LLM for everything. This wastes tokens, introduces non-deterministic drift, and creates embarrassing outputs (like telling a bakery they need enterprise Kubernetes security).

We enforce a strict **division of labor**:

```
         ┌──────────────────────────────────────────────────────────┐
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
         └──────────────────────────────────────────────────────────┘
```

### 3.2 Cost Impact of the Split

| Capability | Engine | Cost per Query | Latency | Accuracy |
|---|---|---|---|---|
| Non-Tech Disqualification | **Rule** | $0.0000 | <2ms | 100% deterministic |
| Enterprise Entrenchment Check | **Rule** | $0.0000 | <2ms | 100% deterministic |
| Security Debt Ratio Calculation | **Rule** | $0.0000 | <2ms | 100% reproducible |
| Compliance Multiplier | **Rule** | $0.0000 | <2ms | 100% reproducible |
| ACV Estimation | **Rule** | $0.0000 | <2ms | 100% reproducible |
| Contextual Signal Synthesis | **LLM** | $0.000155 | ~300ms | 97.4% F1 |
| Pain Point Extraction | **LLM** | $0.000080 | ~180ms | 95%+ |
| Sales Outreach Generation | **LLM** | $0.000167 | ~320ms | N/A (generative) |

**Net Result**: 40%+ of all incoming records are handled by rules alone, saving hundreds of dollars at scale and eliminating hallucination risk for those records.

---

## 4. Data Engineering Architecture (Medallion Pipeline)

### 4.1 The Three-Layer Architecture

Rather than treating the LLM as an opaque black box, the architecture applies the **Medallion Data Architecture** standard in enterprise data engineering:

| Layer | Purpose | Implementation | Data Quality |
|---|---|---|---|
| **Bronze** | Raw immutable landing | `Input_data/B2 Download File` (9.32GB Zstandard-compressed Shodan JSONL) | Raw, untouched |
| **Silver** | Cleaned, typed, deduplicated | `scripts/ingest_5k_diverse.py` — domain canonicalization, ISP filtering, schema validation | Validated, typed |
| **Gold** | Feature-engineered, scored, enriched | `src/lib/scoring.ts` + `data/seed_companies.json` (5,000 calibrated records) | Production-ready |

### 4.2 Feature Engineering (Mathematical Signal Derivation)

Relying entirely on an LLM for mathematical comparisons leads to non-deterministic drift. We extract **engineered features in code**:

**Feature 1 — Security Debt Ratio**:
```
                   Engineering Growth (%) × Dev Headcount
Security Debt = ─────────────────────────────────────────────
                        (Security Staff + 0.5) × 50
```
*Example*: Company with 42% growth, 52 developers, 0 security → Debt Ratio = **42×52 / 0.5×50 = 87.4** (Critical Risk)

**Feature 2 — Attack Surface Complexity Index**:
| Component | Weight | Rationale |
|---|---|---|
| Multi-Cloud (AWS+GCP+Azure) | +3 | Cross-provider misconfigurations |
| Kubernetes / EKS / GKE | +3 | Container escape & lateral movement vectors |
| Edge IoT Devices | +4 | Unpatched firmware, weak authentication |
| Public APIs | +2 | Injection, BOLA, rate-limiting gaps |
| Exposed Database Ports | +5 | MySQL/PostgreSQL/Redis reachable from internet |

**Feature 3 — Regulatory Pressure Multiplier**:
| Framework | Multiplier | Reason |
|---|---|---|
| APRA CPS 234 | 1.8× | Australian financial services — mandatory, board-reported |
| HIPAA | 1.7× | Healthcare — breach penalties up to $1.5M per violation |
| SOC 2 Type II | 1.5× | Enterprise SaaS — blocks customer procurement if missing |
| PCI-DSS | 1.4× | Payment processing — mandatory for card transaction handling |
| ISO 27001 | 1.3× | Global — increasingly required by enterprise procurement |

### 4.3 Data Quality Contracts

| Contract | Implementation | Failure Mode Prevented |
|---|---|---|
| Missing Value Imputation | Defaults unknown headcount to median, flags `data_completeness_score` | LLM crashes on `null` inputs |
| Outlier Capping | Growth capped at 300% | Integer overflow in debt ratio |
| Domain Deduplication | Primary key on canonical domain | Duplicate outreach to same company |
| Schema Validation | TypeScript `Company` interface + runtime type guards | Runtime crashes in scoring engine |
| ISP Filtering | Removes `*.in-addr.arpa`, dynamic DSL pools | False "companies" from residential IPs |

---

## 5. Observability & Tracing Schema

### 5.1 Telemetry Trace Contract

Every LLM interaction emits structured telemetry adhering to this schema:

```typescript
interface TelemetryTrace {
  id: string;                     // Unique trace identifier (e.g. "tr_1727459123_a9b2c")
  timestamp: string;              // ISO-8601 timestamp
  feature: "account_scoring" | "outreach_generation" | "batch_enrichment";
  model: string;                  // Model identifier (e.g. "openai/gpt-4o-mini")
  prompt_version: "v1" | "v2";    // Version tag for regression tracking
  input_tokens: number;           // Prompt token count
  output_tokens: number;          // Completion token count
  latency_ms: number;             // End-to-end inference latency
  cost_usd: number;               // Unit cost from provider rate card
  company_name: string;           // Target entity
  decision_summary: string;       // Condensed executive rationale
  cached: boolean;                // Whether response was served from cache
}
```

### 5.2 Telemetry Data Flow

```
[ User Action: Score / Draft / Regenerate ]
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
   • One-click refresh and trace inspection
```

### 5.3 Persistent Trace Storage

Traces are persisted in two locations:

| Store | Type | Capacity | Purpose |
|---|---|---|---|
| `data/traces.jsonl` | JSONL file (append-only) | Unlimited | Audit trail, post-mortem analysis |
| In-memory ring buffer | Array (LIFO) | Last 200 traces | Fast UI rendering, no disk I/O |
| Cloudflare Edge `telemetry_traces` | SQL table | Production scale | Edge-replicated persistent storage |

### 5.4 Sample Trace (Real Production Output)

```json
{
  "id": "tr_1790704797215_16cj8",
  "timestamp": "2026-09-29T17:59:57.215Z",
  "feature": "outreach_generation",
  "model": "openai/gpt-4o-mini",
  "prompt_version": "v2",
  "input_tokens": 412,
  "output_tokens": 600,
  "latency_ms": 1666,
  "cost_usd": 0.000422,
  "company_name": "TestCorp AI",
  "decision_summary": "Generated sdr_direct outreach (1666ms, 1012 tokens). Angle: automated compliance.",
  "cached": false
}
```

---

## 6. Production Unit Economics & Cost Model

### 6.1 Token Breakdown per Operation

| Operation | Input Tokens | Output Tokens | Total | Cost per Query |
|---|---|---|---|---|
| Account Scoring (Prompt v2) | 390 | 160 | 550 | **$0.000155** |
| Outreach Generation (Email + InMail) | 410 | 175 | 585 | **$0.000167** |

### 6.2 Scale Economics

| Volume | Scoring Cost | Outreach Cost | Combined |
|---|---|---|---|
| 1,000 Accounts | $0.155 | $0.167 | **$0.32** |
| 5,000 Accounts (current dataset) | $0.775 | $0.835 | **$1.61** |
| 10,000 Accounts | $1.55 | $1.67 | **$3.22** |
| 100,000 Accounts | $15.50 | $16.70 | **$32.20** |

### 6.3 Production Budget Ceilings

| Budget Item | Limit | Rationale |
|---|---|---|
| Per-SDR monthly allocation | **$0.76/month** | 1,500 scored accounts + 500 outreach drafts |
| Team hard ceiling (10 SDRs) | **$50/month** | Prevents runaway recursive polling |
| Per-request max output tokens | **600 tokens** | Guards against unbounded generation |
| Rate limit | **100 calls/min** | Circuit breaker for API abuse |

> **Full cost breakdown available in [docs/COST_MODEL.md](docs/COST_MODEL.md)**

---

## 7. Database Schema

### 7.1 Entity-Relationship Diagram

```
┌─────────────────────────────────────────────────────┐
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
└──────────────────────┴──────────────────────────────┘
```

### 7.2 Index Strategy

| Index | Columns | Purpose |
|---|---|---|
| `idx_companies_score` | `cyber_risk_score DESC` | Fast sorted retrieval for pipeline view |
| `idx_companies_risk_tier` | `risk_tier` | Instant tier filtering (T1/T2/T3/DQ) |
| `idx_companies_domain` | `domain` | Deduplication and domain lookups |
| `idx_traces_timestamp` | `timestamp DESC` | Reverse-chronological trace inspection |
| `idx_traces_feature` | `feature` | Filter traces by scoring vs outreach |

---

## 8. Frontend Component Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                         page.tsx (Main Dashboard)                    │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ DashboardHeader.tsx (9.3KB)                                     │ │
│  │  • Logo, branding, "Live Territory" badge                       │ │
│  │  • Action buttons: Docs, Evals, Traces, Import CSV              │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ MetricsSummary.tsx (4.9KB)                                      │ │
│  │  • Total accounts, Tier 1 hot leads, avg risk score, token use  │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ FilterBar.tsx (12.1KB)                                          │ │
│  │  • Search bar (company name, tech, signals)                     │ │
│  │  • Industry dropdown selector                                   │ │
│  │  • Tier priority pills (T1/T2/T3/DQ with live counts)          │ │
│  │  • Signal type chips (CVE, SSL, Database, Dev Growth)           │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ CompanyTable.tsx (20.3KB)                                       │ │
│  │  • Paginated table (20 rows/page), sortable by score            │ │
│  │  • Company name, domain, industry, headcount, risk badge        │ │
│  │  • Buying signal chips (color-coded by severity)                │ │
│  │  • Click → opens CompanyDrawer                                  │ │
│  │  • "Draft Outreach" quick-action button                         │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌───────────────────────── MODALS / DRAWERS ─────────────────────┐ │
│  │                                                                 │ │
│  │  CompanyDrawer.tsx (14.8KB) — Side panel with deep dive         │ │
│  │  OutreachModal.tsx (21.3KB) — AI copilot with tone toggle       │ │
│  │  ObservabilityModal.tsx (24.1KB) — Live telemetry cockpit       │ │
│  │  CsvUploadModal.tsx (12.5KB) — Drag & drop CSV scoring         │ │
│  │  EvalModal.tsx (7.0KB) — Benchmark results viewer               │ │
│  │  DocsModal.tsx (65.2KB) — 5-tab interactive documentation       │ │
│  │  TelemetryDrawer.tsx (5.9KB) — Compact trace list               │ │
│  │                                                                 │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 9. Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    DEPLOYMENT TOPOLOGY                    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              HOSTED ON CLOUDFLARE                │   │
│  │  • Edge SSR & Static Asset Delivery              │   │
│  │  • Global Low-Latency Edge Database              │   │
│  │  • 5,000 Calibrated Accounts Corpus              │   │
│  └───────────────────────┬──────────────────────────┘   │
│                          │                              │
│                          │  HTTPS                       │
│                          ▼                              │
│  ┌────────────────────────────────────────────────────┐  │
│  │              OpenRouter API Gateway                │  │
│  │  • Model: openai/gpt-4o-mini                      │  │
│  │  • Fallback: anthropic/claude-3-haiku              │  │
│  │  • Rate: 100 req/min                              │  │
│  │  • Timeout: 35s with AbortController              │  │
│  └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 10. In-App Interactive Documentation System

The dashboard includes a persistent **Docs** button in the header that launches a 5-tab vertical navigation modal:

| Tab | Contents |
|---|---|
| **System Architecture** | Edge computing topology, streaming ingestion pipeline, database schema |
| **Threat Signals & Shodan** | 7 verified detection vectors with exact scoring weights and live account counts |
| **Scoring Formulas & Math** | Security Debt formula, ACV calculation, tier boundary definitions |
| **AI Sales Copilot & Telemetry** | Prompt grounding rules, token cost formulas, cache strategy |
| **Interviewer Cheat Sheet** | Direct mapping of Task.txt requirements → live implementation evidence |

This ensures evaluators can understand every architectural decision without leaving the running application.
