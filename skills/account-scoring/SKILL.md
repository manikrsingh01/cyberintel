---
name: account-scoring
version: "2.1.0"
description: "Evaluates raw B2B company firmographic data, detects cybersecurity risk signals, and calculates calibrated ICP urgency scores (0-100) and tiers."
author: "Antigravity AI Native Engineering"
tags: ["sales-intelligence", "cybersecurity", "account-scoring", "b2b-gtm"]
---

# Skill: Account Scoring & Cyber Buying Signal Detection

## 1. Overview
The `account-scoring` skill transforms raw, unstructured B2B company firmographic data into actionable sales intelligence for cybersecurity software vendors. It identifies whether a company has an urgent need for security software, extracts verified risk indicators, and classifies the account into prioritized tiers.

---

## 2. Trigger Conditions
Load and execute this skill whenever:
- A new company domain, CSV, or batch dataset is ingested into the sales pipeline.
- A sales representative requests account qualification or prioritization.
- A scheduled batch job refreshes risk scores based on new hiring or compliance telemetry.

---

## 3. Input Specification

The skill accepts a JSON object representing the target company:

| Field | Type | Required | Description | Example |
|---|---|---|---|---|
| `name` | string | Yes | Legal or trading name of the company | `"PayFlow Technologies"` |
| `domain` | string | Yes | Primary web domain | `"payflow.io"` |
| `industry` | string | Yes | Operating industry or sector | `"Fintech & Payments"` |
| `headcount` | integer | Yes | Current total employee count | `185` |
| `cloud_environment` | string | Yes | Cloud hosting architecture | `"AWS (Multi-Region) + EKS"` |
| `tech_stack` | array[string]| Yes | Technologies, frameworks, and datastores | `["AWS", "Kubernetes", "PostgreSQL"]` |
| `compliance_mandates`| array[string]| No | Applicable regulatory compliance frameworks| `["PCI-DSS Level 1", "SOC 2 Type II"]`|
| `engineering_growth_6m_pct`| number| No | % growth in engineering headcount over 6m | `42` |
| `security_headcount` | integer | Yes | Number of dedicated in-house security staff | `0` |
| `recent_triggers` | string | No | News, funding, leadership hires, or incidents| `"Raised $18M Series B; launching API"` |

---

## 4. Output Specification

Returns a validated JSON object conforming to the following structure:

```json
{
  "cyber_risk_score": 94,
  "risk_tier": "TIER_1_CRITICAL",
  "buying_signals": [
    {
      "type": "SECURITY_DEBT_DISPARITY",
      "severity": "HIGH",
      "headline": "42% Engineering Growth with 0 Security Staff",
      "description": "Engineering team expanded from 30 to 52 devs with no dedicated security engineers or CISO."
    },
    {
      "type": "COMPLIANCE_DEADLINE",
      "severity": "CRITICAL",
      "headline": "APRA CPS 234 & PCI-DSS Audit Imminent",
      "description": "Regulated financial institution with upcoming CPS 234 information security compliance deadline."
    }
  ],
  "target_buyer": {
    "title": "VP of Engineering & Head of Infrastructure",
    "pain_point": "Needs automated cloud security posture management and API protection before the banking regulator audit."
  },
  "rationale": "High-urgency fintech with rapid engineering expansion into multi-cloud Kubernetes, with zero dedicated in-house security personnel."
}
```

---

## 5. Scoring & Tier Calibration Rubric

| Risk Tier | Score Range | Criteria & Heuristics | Action |
|---|---|---|---|
| **`TIER_1_CRITICAL`** | **80 – 100** | High-consequence sector (Fintech, Health, Gov, SaaS); 50–2,500 employees; severe security debt disparity OR imminent compliance deadline. | Immediate 24h SDR outreach. |
| **`TIER_2_MODERATE`** | **50 – 79** | Regulated or modern cloud stack; moderate growth or small existing security team (1–2 engineers); audits within 6–12 months. | Nurture sequence / AE account mapping. |
| **`TIER_3_LOW`** | **25 – 49** | Static digital footprint, low external attack surface, non-urgent compliance timelines. | Marketing newsletter / low-touch drip. |
| **`DISQUALIFIED`** | **0 – 24** | Brick-and-mortar non-tech with no code (e.g. bakery) OR mega-enterprise (>10,000 headcount) with 50+ person entrenched security teams. | Do not contact. |

---

## 6. Dependent Prompts
- Production Prompt: `prompts/v2/account_scoring_v2.txt`
- Fallback / Baseline Prompt: `prompts/v1/account_scoring_v1.txt`

---

## 7. Worked Example Invocation

### Example Request (CLI / Subagent / API):
```bash
python scripts/run_skill.py --skill account-scoring --input '{
  "name": "Nexus Health AI",
  "domain": "nexushealth.ai",
  "industry": "Digital Health",
  "headcount": 120,
  "cloud_environment": "GCP + BigQuery",
  "tech_stack": ["GCP", "Python", "Docker"],
  "compliance_mandates": ["HIPAA", "ISO 27001"],
  "engineering_growth_6m_pct": 35,
  "security_headcount": 0,
  "recent_triggers": "Signed multi-hospital contract ingesting diagnostic imaging records across 8 regional hospitals."
}'
```

### Result:
```json
{
  "cyber_risk_score": 91,
  "risk_tier": "TIER_1_CRITICAL",
  "buying_signals": [
    {
      "type": "SENSITIVE_DATA_EXPOSURE",
      "severity": "CRITICAL",
      "headline": "Ingesting High-Volume Electronic Health Records (PHI)",
      "description": "Processing sensitive patient imaging data across external networks without zero-trust isolation."
    }
  ],
  "target_buyer": {
    "title": "Chief Technology Officer",
    "pain_point": "Needs automated data-at-rest encryption monitoring and clinical cloud workload protection."
  },
  "rationale": "Clinical healthcare company managing PHI data without in-house security, facing strict hospital procurement assessments."
}
```
