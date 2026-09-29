# Project Plan: Real B2 Dataset Ingestion, Cloudflare Storage & Live Intelligence Pipeline

**Task Slug:** `real-dataset-pipeline`  
**Status:** DRAFT / PROPOSED  
**Created:** 2026-09-29  
**Target Completion:** Production Ready  

---

## 1. Executive Summary & Objective

Transform the raw 9.32 GB Backblaze B2 Shodan threat intelligence dataset (`Input_data/B2 Download File`) into a production-grade, live data pipeline. Ingest, normalize, score, and store verified company profiles and threat telemetry directly into **Cloudflare D1 SQL Storage**, and render genuine, real-world attack surface metrics throughout the live dashboard and AI outreach workflows.

---

## 2. Strategic Scope & Data Reality

### A. The Challenge with 9.32 GB Compressed Scans
- **Raw Volume:** 9.32 GB compressed `.zst` corresponds to ~35–50 GB of uncompressed streaming JSONL (tens of millions of records).
- **Signal-to-Noise Ratio:** Raw Shodan scans contain millions of residential consumer IPs, dynamic ISP ranges, and headless IoT devices alongside legitimate enterprise corporate domains.
- **Cloudflare D1 Architecture:** Cloudflare D1 is an edge-replicated serverless SQLite database. To maintain sub-50ms query times and stay within serverless memory constraints, data must be aggregated at the **Company / Domain** level rather than storing millions of raw ephemeral probe lines.

### B. The Extraction & Synthesis Architecture
A dedicated, high-performance streaming parser (`scripts/ingest_b2_dataset.py`) will:
1. Stream through `Input_data/B2 Download File` using chunked Zstandard decompression.
2. Group records by unique corporate domain (`domains` and `ssl.cert.subject.CN`), filtering out generic ISP reverse DNS (`*.in-addr.arpa`, dynamic DSL pools).
3. Aggregate all discovered ports, technologies, SSL states, and CVEs into a single canonical `Company` attack surface profile.
4. Calculate authentic risk metrics:
   - **CVE Vulnerability Count & Severity:** Extracted directly from `vulns`.
   - **Cryptographic Health:** `ssl.cert.expired` and cipher deprecation.
   - **Exposed Attack Surface:** Presence of databases (3306, 5432, 27017, 6379) or remote management (3389 RDP, 23 Telnet, 445 SMB).
   - **Cloud Environment:** Grounded in `cloud.provider` (AWS, Google, Azure, Alibaba) and ASN data.
5. Ingest top verified high-signal companies directly into Cloudflare D1 (`companies` and `telemetry_traces` tables).

---

## 3. Metric Mapping: Raw B2 Dataset → Live Platform UI

| Pipeline Metric (UI & Scoring) | Raw Shodan Source Attribute | UI Implementation in CyberIntel |
| :--- | :--- | :--- |
| **Target Company Name & Domain** | `org`, `domains[0]`, `ssl.cert.subject.CN` | Primary table row, company card, and drawer title |
| **Cloud Infrastructure** | `cloud.provider`, `cloud.region`, `asn` | Cloud Provider Badge (AWS, GCP, Azure, Multi-Cloud) |
| **Technology Stack** | `product`, `version`, `cpe23`, `http.title` | Interactive Tech Stack Badges (e.g. Nginx 1.24, OpenSSH 8.9, Kubernetes) |
| **Critical Buying Signals** | `vulns`, `ssl.cert.expired`, exposed ports | Color-coded Signal Chips: <br>• `EXPIRED_SSL`: Real certificate expiration<br>• `CVE_VULNERABILITY`: Real CVE-IDs (e.g., CVE-2023-44487)<br>• `PORT_EXPOSURE`: Public DB/RDP ports |
| **Cyber Risk Score (0-100)** | Calibrated heuristic based on CVE count, expired cert, and exposed critical ports | Risk Gauge + Tier (Tier 1 Critical, Tier 2 Moderate, Tier 3 Low) |
| **Geographic Presence** | `location.city`, `location.country_name` | Location indicator with country flags |
| **Network Telemetry** | `ip_str`, `port`, `asn`, `ssl.jarm` | Dedicated "Technical Telemetry" tab in Company Detail Drawer |
| **AI Sales Outreach Hook** | Signal grounded on exact CVEs & expired SSL | Cold Email & InMail referencing the exact port, domain, and CVE vulnerability |

---

## 4. Phase-by-Phase Implementation Plan

### Phase 1: High-Performance Ingestion Engine
- [ ] Create `scripts/ingest_b2_dataset.py` using streaming `subprocess` or `zstandard` bindings.
- [ ] Implement entity resolution & domain deduplication.
- [ ] Filter out non-corporate ISP hostnames, isolating commercial organizations with verified digital assets.
- [ ] Compute real-time risk scoring, buying signals, and sales angles for each aggregated domain.
- [ ] Output clean relational seed records in both JSON (`data/shodan_enriched_companies.json`) and SQL (`d1_shodan_seed.sql`).

### Phase 2: Cloudflare D1 Database Migration & Seeding
- [ ] Update `schema.sql` if any additional technical attack-surface fields are needed (e.g. `raw_ports`, `cve_list`, `jarm_fingerprint`).
- [ ] Execute `d1_shodan_seed.sql` remotely via `wrangler d1 execute project-cyberintel-db --remote`.
- [ ] Verify SQL index coverage (`idx_companies_score`, `idx_companies_risk_tier`, `idx_companies_domain`).

### Phase 3: Frontend Dashboard & Drawer Alignment
- [ ] Update [src/components/CompanyTable.tsx](file:///Users/manikrsingh/Documents/Firmable/src/components/CompanyTable.tsx) to display real Shodan attack surface indicators (CVE tags, expired SSL indicators, open port warnings).
- [ ] Enhance [src/components/CompanyDrawer.tsx](file:///Users/manikrsingh/Documents/Firmable/src/components/CompanyDrawer.tsx) with a dedicated "Real Threat Intel" section displaying live IP, open ports, and detected CVE descriptions.
- [ ] Update [src/components/FilterBar.tsx](file:///Users/manikrsingh/Documents/Firmable/src/components/FilterBar.tsx) to allow filtering specifically by "Expired SSL", "Active CVEs", and "Exposed Database".

### Phase 4: AI Prompts, Evals & Scaffolding Calibration
- [ ] Update prompt `prompts/outreach_v2.md` and `skills/outreach-draft/SKILL.md` to instruct the LLM to leverage specific CVEs and expired certs discovered in the scan data.
- [ ] Update evaluation benchmark `evals/labeled_benchmark.json` to include test cases from the new real Shodan dataset.
- [ ] Run evaluation harness `evals/eval_harness.py` to measure precision and recall against the new real-world data.

### Phase 5: Production Deployment & Verification
- [ ] Deploy updated build to Cloudflare Pages (`project-cyberintel.pages.dev`).
- [ ] Verify live API responses (`/api/companies`, `/api/telemetry`).
- [ ] Test end-to-end user flow: filtering live Shodan accounts, opening technical attack surface details, and generating signal-grounded outreach.

---

## 5. Architectural Verification & Socratic Gate

### Key Architectural Decisions:
1. **Domain-Centric Aggregation:** Rather than overwhelming the UI and database with 50,000 raw IP scan lines, we aggregate by corporate domain/organization. A prospect company (e.g., `Zoosk` or `Verisk`) presents an executive summary of all its exposed ports, certificates, and CVEs.
2. **Storage Tiering:**
   - Primary queryable layer: Cloudflare D1 (`project-cyberintel-db`).
   - Backup/archive layer: Local compressed dataset (`Input_data/B2 Download File`).
3. **No Placeholders / 100% Real Scans:** Every single vulnerability badge, port listing, and SSL warning displayed on the site links back to an authentic entry in the B2 archive.
