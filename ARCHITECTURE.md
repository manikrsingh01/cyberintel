# Technical Architecture & System Design

> **Overview**: An AI-native sales intelligence architecture designed for high throughput, sub-second query latency, strict output reliability, and sustainable unit economics.

---

## 1. System Architecture Diagram

```
                                [ Ingestion Sources ]
                       (Seed Database / Batch CSV / User Upload)
                                          │
                                          ▼
                      ┌───────────────────────────────────────┐
                      │          Data Ingestion Layer         │
                      │  - Field normalizer & deduplication   │
                      │  - Tech stack tag extractor           │
                      └───────────────────┬───────────────────┘
                                          │
                                          ▼
                      ┌───────────────────────────────────────┐
                      │    Tier 1: Deterministic Rule Engine  │
                      │  - Hard disqualification (Non-tech)   │
                      │  - Entrenched mega-enterprise check   │
                      │  - Headcount disparity mathematics    │
                      │  (Latency: 2ms • Cost: $0.000000)     │
                      └───────────────────┬───────────────────┘
                                          │
                        ┌─────────────────┴─────────────────┐
                        │                                   │
               [ Disqualified ]                    [ Qualified Candidate ]
                        │                                   │
                        ▼                                   ▼
             Stored as 0-24 Score          ┌───────────────────────────────────┐
                                           │   Tier 2: LLM Reasoning Engine    │
                                           │  - Contextual signal synthesis    │
                                           │  - Pain point extraction          │
                                           │  - Calibrated prompt v2 (Few-shot)│
                                           │  (Latency: 290ms • Cost: $0.00015)│
                                           └────────────────┬──────────────────┘
                                                            │
                                                            ▼
                      ┌────────────────────────────────────────────────────────┐
                      │              Observability & Tracing Bus               │
                      │  - Telemetry Logger (JSONL / SQLite schema)            │
                      │  - Token tracking, latency, and cost calculator        │
                      └─────────────────────────────┬──────────────────────────┘
                                                    │
                                                    ▼
                      ┌────────────────────────────────────────────────────────┐
                      │               Next.js 15 Client Frontend               │
                      │  - Interactive Pipeline Table (Filter by Urgency/Risk) │
                      │  - Account Deep-Dive Drawer                            │
                      │  - 1-Click AI Outreach Copilot                         │
                      │  - Live Telemetry & Cost Modal                         │
                      └────────────────────────────────────────────────────────┘
```

---

## 2. Key Design Decisions & The Rule-vs-LLM Split

A major pitfall in early "AI apps" is passing raw data directly to an LLM for everything. In our architecture, we enforce a strict **division of labor**:

| Capability | Engine | Rationale | Cost & Latency |
|---|---|---|---|
| **Non-Tech Disqualification** (e.g. bakeries, cleaners) | **Rule Engine** | Deterministic check on keywords and empty tech stacks. Why spend 600 tokens asking an LLM if a local bakery needs enterprise cloud security? | **$0.0000**<br>`< 2ms` |
| **Enterprise Entrenchment** (>10,000 headcount + >50 SecOps) | **Rule Engine** | Mathematical comparison of headcount ratios. Guarantees 0% false positives. | **$0.0000**<br>`< 2ms` |
| **Headcount Disparity Math** (Dev growth % vs Sec headcount) | **Rule Engine** | Exact mathematical ratio calculation (`growth >= 25% && sec == 0`). Free and reliable. | **$0.0000**<br>`< 2ms` |
| **Contextual Buying Signal Synthesis** | **LLM Engine** | Reading unstructured news, funding announcements, and audit timelines to extract the exact threat angle. | **$0.00015**<br>`~300ms` |
| **Target Buyer Pain Point Mapping** | **LLM Engine** | Mapping specific regulatory frameworks (e.g. APRA CPS 234) to executive responsibilities. | **$0.00008**<br>`~180ms` |
| **Personalized Sales Outreach** | **LLM Engine** | Synthesizing detected signals into non-salesy, high-converting cold email and LinkedIn copy. | **$0.00017**<br>`~320ms` |

---

## 3. Data Engineering Architecture & The Medallion Pipeline

At its core, this platform operates as an **AI-Native Data Pipeline**. Rather than treating the LLM as an opaque black box that processes raw, unvalidated strings, the architecture applies the **Medallion Data Architecture (Bronze ➔ Silver ➔ Gold)** pattern standard in enterprise data engineering:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   BRONZE LAYER: Raw Ingestion                          │
│  - Ingests raw, unvalidated CSV/JSON company records                   │
│  - Tolerates dirty inputs, casing mismatches, and trailing URL slashes │
│  - Immutable landing storage (data/seed_companies.csv)                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   SILVER LAYER: Cleaning & Data Quality                │
│  - Domain Canonicalization: Strips 'https://', 'www.', trailing '/'    │
│  - Type Casting & Coercion: Safe casting of headcount, growth %        │
│  - Schema Validation (Data Contract): Zod / TypeScript interface       │
│  - Normalization: Standardizes tech stack tags and compliance arrays   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   GOLD LAYER: Feature Engineering & Scoring            │
│  - Feature 1: Security Disparity Index = eng_growth / (sec_hc + 1)     │
│  - Feature 2: Attack Surface Weight = count(cloud_microservices)       │
│  - Feature 3: Regulatory Compliance Multiplier (APRA, SOC 2, HIPAA)    │
│  - Deterministic ICP Pre-Filter (Eliminates non-tech & mega-banks)     │
│  - Targeted LLM Enrichment: Contextual signal reasoning & outreach     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   SERVING LAYER: Low-Latency OLAP Serving              │
│  - In-memory indexed structures for sub-millisecond client queries     │
│  - Reactive filtering across industry, risk tiers, and signal tags     │
│  - Emits JSONL telemetry traces on every enrichment execution          │
└────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Feature Engineering (Mathematical Signal Derivation)

In enterprise data engineering, relying entirely on an LLM to perform mathematical comparisons leads to non-deterministic drift, hallucination, and exorbitant token costs. We extract **engineered features in code** before passing context to the LLM:

1. **Security Debt Ratio ($S_{debt}$)**:
   $$\text{Security Debt Index} = \frac{\text{Engineering Growth } (\% \text{ in } 6\text{m})}{\text{Security Headcount} + 1}$$
   * *Rationale*: A company scaling engineering by 45% with 0 security staff has an index of $45.0$ (Critical Risk), whereas a company with 10 security engineers has an index of $4.1$ (Low Risk).
2. **Attack Surface Complexity Index**:
   * Measures exposure by weighting cloud-native components: Multi-Cloud (+3), Kubernetes/EKS (+3), Edge IoT (+4), Public APIs (+2).
3. **Regulatory Pressure Multiplier**:
   * Assigns deterministic weights to compliance frameworks: APRA CPS 234 ($1.8\times$), HIPAA ($1.7\times$), SOC 2 Type II ($1.5\times$), PCI-DSS ($1.4\times$).

### 3.2 Data Quality Contracts & Error Handling

To defend downstream AI components against corrupted data (a common cause of LLM crashes), the ingestion layer acts as a strict **Data Quality Gate**:
* **Missing Value Imputation**: Defaults unknown headcount to median values and flags records with `data_completeness_score`.
* **Outlier Capping**: Hard boundaries on growth percentages (e.g. capping at 300% to prevent integer overflow or skewed scores).
* **Deduplication**: Enforces domain-level uniqueness as the primary key.

### 3.3 Scalability & Big Data Roadmap (10M+ Records)

For the initial prototype, data is stored in indexed JSON/in-memory structures for instant zero-dependency hosting. For scaling to Firmable's 15M+ company production index, the roadmap cleanly transitions to:
* **Batch Storage**: Apache Parquet files partitioned by `country_code` and `industry_sector` on cloud object storage (S3/GCS).
* **Analytical Engine**: **DuckDB** or **ClickHouse** for sub-10ms aggregations and filtering over millions of rows without memory spikes.
* **Worker Queue**: Asynchronous Python Celery or Temporal workers executing LLM batch enrichments with rate-limiting and exponential backoff.

---

## 4. Observability & Tracing Schema

Every LLM interaction emits structured telemetry adhering to the following schema:

```typescript
interface TelemetryTrace {
  id: string;                     // Unique trace identifier (e.g. "tr_1727459123_a9b2c")
  timestamp: string;              // ISO-8601 timestamp
  feature: "account_scoring" | "outreach_generation";
  model: string;                  // Model identifier (e.g. "gpt-4o-mini")
  prompt_version: "v1" | "v2";    // Version tag for regression tracking
  input_tokens: number;           // Prompt token count
  output_tokens: number;          // Completion token count
  latency_ms: number;             // End-to-end inference latency
  cost_usd: number;               // Unit cost calculated from provider rate card
  company_name: string;           // Target entity
  decision_summary: string;       // Condensed executive rationale
  cached: boolean;                // Whether response was served from cache
}
```

Traces are available for real-time inspection via the in-app Telemetry Drawer and persisted to `data/traces.jsonl`.

---

## 5. Production Unit Economics & Cost Model

### Pricing Assumptions (Based on `gpt-4o-mini` standard rates):
* **Input Tokens**: `$0.15 per 1,000,000 tokens` ($0.00000015 / token)
* **Output Tokens**: `$0.60 per 1,000,000 tokens` ($0.00000060 / token)

### Token Breakdown per Operation:

| Operation | Input Tokens | Output Tokens | Total Tokens | Cost per Query |
|---|---|---|---|---|
| **Account Scoring & Signals (Prompt v2)** | 390 | 160 | 550 | **$0.000155** |
| **Outreach Generation (Email + InMail)** | 410 | 175 | 585 | **$0.000167** |

### Scale Economics (Batch Processing):
* **1,000 Accounts Enriched & Scored**: `$0.155` (15.5 cents)
* **10,000 Accounts Enriched & Scored**: `$1.55` (One dollar and 55 cents)
* **100,000 Accounts Enriched & Scored**: `$15.50`

### Production Cost Ceiling Policy:
* **Per-SDR Monthly Allocation**: 1,500 scored accounts + 500 personalized outreach drafts = **`$0.32 / SDR / month`**.
* **Hard Cost Ceiling**: Set a hard budget cap of **`$50.00 / month`** per team to defend against accidental recursive polling or infinite loops.
* **Tiered Model Routing**:
  - Classification & Scoring: `gpt-4o-mini` (cheap, fast, structured).
  - High-Value Enterprise Outreach (Tier 1 only): `claude-3-5-sonnet` (stronger reasoning, higher nuance) reserved for deals with >$100k ACV potential.

---

## 6. Architectural Trade-offs & Alternatives Considered

1. **Client-Side Hybrid Scoring vs. Dedicated Microservice**:
   - *Choice*: Embedded hybrid scoring in Next.js Serverless Routes.
   - *Trade-off*: Zero cold starts and zero devOps overhead for the prototype; for a 15M-record database, this would transition to an asynchronous Python Celery/Kafka worker queue.
2. **Deterministic Pre-Filtering vs. Pure LLM Pipeline**:
   - *Choice*: Strict rule-based exclusion of non-tech and mega-enterprises.
   - *Trade-off*: Eliminates 40%+ of unnecessary LLM calls, saving hundreds of dollars at scale and preventing embarrassing hallucinated outreach to local businesses.

---

## 7. Real-Time Telemetry & Caching Architecture

### 7.1 Telemetry Data Flow
Every invocation of an LLM feature flows through a unified telemetry contract:

```
[ User Action: Draft / Regenerate ]
                 │
                 ▼
[ Next.js API: /api/generate-outreach ]
                 │
                 ▼
[ OpenRouter API: openai/gpt-4o-mini ]
                 │
                 ├─ Captures: latency_ms, prompt_tokens, completion_tokens, cost_usd
                 │
                 ▼
[ Central Store: logTrace() in src/lib/telemetry.ts ]
                 │
                 ├─ Writes line to: data/traces.jsonl (Persistent Node FS)
                 ├─ Updates: In-Memory Ring Buffer (Last 200 traces)
                 │
                 ▼
[ Telemetry API: /api/telemetry (GET / POST) ]
                 │
                 ▼
[ UI Cockpit: ObservabilityModal.tsx (Header ➔ Tools ➔ Traces & Cost Cockpit) ]
   • Real-time KPI summaries: Total Traces, Actual Spend, Processed Tokens, Live vs Cache
   • One-click Live Trace Refresh
```

### 7.2 Client-Side In-Memory Cache (Token Preservation)
* **Problem**: SDRs frequently toggle between *Direct & Technical* (SDR) and *Executive & ROI* (VP) angles or re-open previously generated leads. Re-calling the LLM wastes tokens, adds latency, and increases cost.
* **Architecture Solution**: An in-memory cache keyed by `company_id + tone + custom_instruction` (`cacheRef.current` in `OutreachModal.tsx`).
* **Telemetry Impact**: Repeat views are served in **`0ms` at `$0.00`** and logged as `cached: true` in the telemetry dashboard, demonstrating proactive token stewardship.

