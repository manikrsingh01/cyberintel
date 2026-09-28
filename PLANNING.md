# Product Planning & Sales Intelligence Strategy

> **Context**: Building for the outbound sales team at a cybersecurity software company selling cloud security posture management (CSPM), application security (AppSec), and automated continuous compliance (SOC 2, ISO 27001, APRA CPS 234, HIPAA) to scaling tech and mid-market enterprises.

---

## 1. The Core Sales Problem

Out of thousands of registered businesses in the market, **only a small fraction have an acute, budget-backed need for cybersecurity software today**.

Traditional B2B lead lists (ZoomInfo, Apollo) dump contact lists based on static employee filters. Sales Development Representatives (SDRs) waste 60%+ of their day:
1. Contacting non-tech brick-and-mortar businesses that have zero custom cloud infrastructure.
2. Pitching enterprise mega-corporations (e.g. $40B commercial banks) with entrenched 200-person in-house security teams that will never buy from an emerging vendor.
3. Sending generic "hope you're well, want a 15-minute demo?" emails that get marked as spam.

---

## 2. Ideal Customer Profile (ICP) Definition

Based on real enterprise cybersecurity sales cycles, the optimal target profile is:

| Parameter | Sweet Spot | Rationale |
|---|---|---|
| **Headcount** | **50 – 2,500 employees** | Large enough to have dedicated IT/engineering budgets; small enough to lack mature, bloated in-house security divisions. |
| **Target Verticals** | **Fintech, HealthTech, GovTech, E-Commerce, LegalTech, CleanTech/IoT** | High cost of breach; mandatory regulatory compliance oversight (APRA CPS 234, HIPAA, SOC 2, PCI-DSS, SOCI Act). |
| **Cloud Environment** | **AWS, GCP, Azure, Kubernetes, Serverless** | High velocity microservices deployments create misconfiguration blindspots and container vulnerabilities. |
| **Engineering Ratio** | **High Dev Growth (>20% in 6 mo) + 0–1 SecOps** | **The Prime Buying Trigger**: Fast engineering velocity with zero security governance creates extreme anxiety for leadership. |

---

## 3. The 5 High-Impact Buying Signals We Track

Rather than relying on vague "intent data" (like article pageviews), we look for **structural, verifiable architectural triggers**:

### ⚡ Signal 1: Security Debt Disparity (The "Fast Dev, Zero Sec" Signal)
* **What it is**: Engineering headcount expanded >25% in the last 6 months, but in-house security headcount is 0.
* **Why it converts**: Product teams are shipping code weekly to keep up with customer demand. The VP of Engineering knows vulnerabilities are slipping through into production, but cannot hire security engineers fast enough.

### 🛡️ Signal 2: Imminent Compliance & Audit Deadlines
* **What it is**: Approaching observation windows for SOC 2 Type II, APRA CPS 234, HIPAA, or ISO 27001.
* **Why it converts**: Compliance is binary—without an audit report, enterprise prospective customers will stall procurement. Our software automates continuous evidence collection.

### ☁️ Signal 3: Infrastructure Expansion & Attack Surface Sprawl
* **What it is**: Migration from monolith to multi-cloud, Kubernetes (EKS/GKE), or fleets of connected edge IoT devices.
* **Why it converts**: Attack surfaces multiply exponentially across distributed clusters and microservices APIs.

### 🚨 Signal 4: Active Threat Proximity & Peer Incidents
* **What it is**: Recent credential stuffing attacks, bot fraud against checkout endpoints, or peer competitors in their sub-sector suffering public disclosures.
* **Why it converts**: Creates urgent executive urgency at board and C-suite level to prove their defense posture.

### 💼 Signal 5: Enterprise Deal Blockers
* **What it is**: Mid-market SaaS moving upmarket; multi-million dollar customer contracts delayed pending vendor security review questionnaires.
* **Why it converts**: Direct line to revenue: security software is bought as an enabler to unlock stuck enterprise deals.

---

## 4. Prioritization Rubric (Account Tiers)

* **TIER 1 (Critical / Hot Lead - Score 80–100)**: High-risk sector + rapid engineering expansion with 0 security staff OR active compliance audit deadline. **Action: Immediate 24-hour SDR outbound with signal-grounded pitch.**
* **TIER 2 (Moderate / Warm Lead - Score 50–79)**: Modern cloud footprint, compliance mandates, but moderate hiring pace or small existing team (1–2 SecOps). **Action: Nurture sequence and AE territory mapping.**
* **TIER 3 (Low Urgency - Score 25–49)**: Low external attack surface, stable software footprint, no active audit deadlines. **Action: Low-touch automated marketing drip.**
* **DISQUALIFIED (Score 0–24)**: Non-tech businesses (bakeries, cleaning services) OR mega-enterprises with 50+ person entrenched security divisions. **Action: Exclude from outreach.**

---

## 5. Sales Outreach Philosophy: Zero-Fluff Engineering Grounding

Enterprise buyers (CTOs, VPs of Eng, CISOs) ignore generic pitch decks. Our outreach engine enforces 4 non-negotiable rules:
1. **Never use generic buzzwords** (*"game-changing"*, *"revolutionary"*, *"all-in-one"*).
2. **Anchor the hook in the first 2 lines** on verified technical data (*"Noticed your team expanded 40% into multi-region AWS while preparing for APRA CPS 234..."*).
3. **Low-friction CTA**: Never demand 30 minutes. Ask an interest question (*"Open to seeing a 2-minute architectural comparison of how [Peer] solved this?"*).
4. **Persona Adaptation**: Technical focus for engineering heads; risk/audit focus for compliance leaders.

---

## 6. The AI Data Engineer's Perspective: Feature Selection & Modeling

From a data engineering standpoint, a sales intelligence platform succeeds or fails on **feature quality and schema integrity**:

### 6.1 Feature Selection Matrix
Rather than throwing raw text fields into an LLM prompt, the pipeline selects and transforms attributes into numerical signals:
* `eng_growth_rate` + `security_headcount` ➔ Engineered as `Security Debt Ratio` (High leverage).
* `cloud_environment` + `tech_stack` ➔ Extracted into categorical attack surface flags (`is_multi_cloud`, `has_kubernetes`, `has_iot`).
* `compliance_mandates` ➔ Mapped to an urgency multiplier based on audit observation periods.

### 6.2 Data Ingestion & Quality Contract
* **Immutability**: Raw incoming data lands unmodified in the Bronze layer.
* **Cleaning & Type Coercion**: Domains are lower-cased and stripped of protocol/path; missing numerical values are safely imputed.
* **Schema Validation**: Every company record is validated against a strict schema contract before hitting the feature store, ensuring 0% runtime schema crashes in the AI layer.

---

## 7. The 5 B2B Sales Prospecting Pillars (Definition, Significance & Implementation)

To fulfill the core requirement of `Task.txt` ("*spend some time researching how B2B sales teams actually prospect*"), here is how each pillar is defined, why it matters, and where it is implemented in our codebase:

### Pillar 1: Ideal Customer Profile (ICP)
* **Definition**: A firmographic and technographic archetype of organizations that derive maximum ROI from our cybersecurity software and have the budget and willingness to purchase.
* **Significance**: Without a strict ICP, sales reps waste 60%+ of their pipeline chasing non-viable accounts (e.g. bakeries with no cloud code or banks with 300-person in-house security teams that will never buy from a startup).
* **Implementation in Code**: Defined in `PLANNING.md` Section 2, codified in `src/lib/scoring.ts` (`isDisqualified()`), and calibrated in `prompts/v2/account_scoring_v2.txt`.

### Pillar 2: Account Scoring
* **Definition**: A calibrated 0–100 Propensity Index representing the probability of a company needing and purchasing cybersecurity tooling right now.
* **Significance**: Transforms unstructured company text, growth rates, and news into an objective, sortable numeric priority. Reps open their dashboard in the morning and work from 100 downwards.
* **Implementation in Code**: Hybrid scoring engine in `src/lib/scoring.ts` (35 pts Cloud Complexity + 30 pts Security Debt Ratio + 25 pts Compliance Windows + 10 pts Triggers) and live OpenRouter endpoint `/api/score-account`.

### Pillar 3: Buying Signals
* **Definition**: Verifiable, real-world events indicating an organization has entered an active buying window (e.g. rapid engineering expansion without security staff, or an upcoming SOC 2 / APRA CPS 234 audit deadline).
* **Significance**: High ICP accounts without buying signals will say "check back next year." Accounts with acute buying signals convert 3–5x faster because an urgent business problem is forcing action.
* **Implementation in Code**: Structured signal detection taxonomy (`SECURITY_DEBT_DISPARITY`, `COMPLIANCE_DEADLINE`, `ATTACK_SURFACE`, `ACTIVE_THREAT`, `ENTERPRISE_BLOCKER`) displayed in `CompanyTable.tsx` and injected into `prompts/v2/outreach_draft_v2.txt`.

### Pillar 4: Territory & Segment Filtering
* **Definition**: The division of accounts by geographical territory, industry vertical, and priority tiers so sales reps can manage an organized pipeline without collision.
* **Significance**: Enterprise sales requires domain specialization (e.g. pitching HIPAA to healthcare vs. APRA CPS 234 to Australian financial services). Slicing territories by industry ensures relevant messaging and clear AE/SDR ownership.
* **Implementation in Code**: Instant filtering in `FilterBar.tsx` (Search across name/tech/signals, Industry dropdown selector, Priority segment pills, and Trigger chips).

### Pillar 5: Outreach Prioritisation & SLA Cadence
* **Definition**: Operational rules defining how fast and through what channels a sales rep engages an account based on their score tier:
  * **Tier 1 (Critical / 80-100)**: **24-hour SLA**. Multi-channel cadence (Cold Email + LinkedIn InMail + Phone) personalized to the specific detected signal.
  * **Tier 2 (Moderate / 50-79)**: **Weekly cadence**. Educational content and nurture sequences.
  * **Tier 3 (Low / 25-49)**: **Automated marketing drip**. Zero manual rep time spent.
  * **Disqualified (0-24)**: **Suppression**. Suppressed from sales sequences to protect domain sender reputation.
* **Significance**: High-intent triggers (like a funding round or audit deadline) decay in conversion rate by 50% after 7 days. Swift prioritization ensures maximum pipeline conversion.
* **Implementation in Code**: 1-click `OutreachModal.tsx` generating personalized, signal-grounded Cold Email and LinkedIn InMail copy tailored to the recommended decision-maker.

---

## 8. Innovative Derived Sales Intelligence (Moving Beyond Generic CRM Data)

In alignment with Firmable's prompt (*"think creatively: what hidden signals in this data could tell a salesperson this company needs cybersecurity help?"*), the platform synthesizes raw firmographics into 4 high-leverage sales dimensions:

1. **The Security Debt Ratio**:
   * **Formula**: `(Dev Growth % × Dev Headcount) ÷ (Security Staff + 0.5)`
   * **Sales Value**: Quantifies the exact disparity between software shipment velocity and vulnerability prevention (e.g. `42x Debt`). Gives SDRs a concrete conversation starter for engineering leaders.
2. **Audit Urgency Countdown**:
   * **Logic**: Detects mandatory compliance frameworks (SOC 2, ISO 27001, APRA CPS 234) and derives an active audit observation window (e.g. `⚡ SOC 2 in 42 Days`).
   * **Sales Value**: Transforms vague interest into a rigid, non-negotiable procurement deadline where deals close in under 14 days.
3. **Estimated Deal Value (ACV)**:
   * **Logic**: Dynamic enterprise contract value model calculated from employee tier, cloud complexity, and compliance count (e.g. `$38,000 / yr`).
   * **Sales Value**: Enables pipeline forecasting and prevents reps from spending hours on low-value micro-deals.
4. **Sales Battlecard: Objection Killer**:
   * **Logic**: Contextual objection-and-counter playbook matched against the target company's cloud stack and industry.
   * **Sales Value**: When an engineering VP says *"We already use AWS GuardDuty"*, the rep instantly sees the counter-hook: *"GuardDuty only flags anomalous API calls post-facto; it doesn't automate PR review scans or continuous compliance evidence for your upcoming audit."*

