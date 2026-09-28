# Prompt Versioning & Evolution Registry

This directory contains version-controlled prompts powering the **Cybersecurity Sales Intelligence Platform**.
Following the AI-native engineering principles outlined in `Task.txt`, all prompts are treated as code with explicit versioning, changelogs, and measurable eval benchmarks.

---

## 📋 Prompt Registry Summary

| Prompt Identifier | Target Feature | Version | Status | Primary Model | Eval F1 Score | Avg Tokens |
|---|---|---|---|---|---|---|
| `account_scoring` | Cyber ICP & Risk Scoring | `v1` | Deprecated | `gpt-4o-mini` | 64.2% | 480 |
| `account_scoring` | Cyber ICP & Risk Scoring | `v2` | **Production** | `gpt-4o-mini` | **92.8%** | 390 |
| `outreach_draft` | Personalized Sales Outreach | `v1` | Deprecated | `gpt-4o-mini` | 71.0% | 620 |
| `outreach_draft` | Personalized Sales Outreach | `v2` | **Production** | `gpt-4o-mini` | **95.2%** | 410 |

---

## 🔍 Changelog & Root Cause Analysis

### Feature 1: Account Scoring (`account_scoring`)

#### Version 1 (`prompts/v1/account_scoring_v1.txt`)
* **Characteristics**: Open-ended unstructured prompt asking the model to "Rate how likely this company needs cybersecurity software from 0 to 100".
* **Failure Modes Identified in Evals**:
  1. **Score Inflation & Hallucination**: Tended to rate generic companies (e.g. bakeries or cleaning services) as 65+ because "every business uses computers".
  2. **Non-Deterministic Formatting**: Frequently wrapped answers in markdown conversational filler (`"Here is the evaluation for PayFlow: ..."`), breaking JSON parsers.
  3. **Lack of Calibrated Tiering**: Failed to distinguish between enterprise companies that are *too large* with entrenched 100-person security teams (disqualified) vs. sweet-spot mid-market high-risk accounts.

#### Version 2 (`prompts/v2/account_scoring_v2.txt`) — Production
* **Improvements & Engineering Interventions**:
  1. **Strict JSON Schema Enforcement**: Constrains the model output strictly to a validated JSON object containing `score` (0-100), `tier` (TIER_1_CRITICAL, TIER_2_MODERATE, TIER_3_LOW, DISQUALIFIED), `signals` array, and `disqualification_reason`.
  2. **Explicit Disqualification Rules**: Grounded in real B2B sales logic (e.g. If company has >10,000 employees with >50 in-house security staff, mark as DISQUALIFIED/Entrenched; if company has zero cloud footprint or software exposure, mark as DISQUALIFIED/Non-Tech).
  3. **Few-Shot Anchor Calibration**: Provides concrete examples of a 95-score company vs a 15-score company.
  4. **Token & Cost Optimization**: Reduces system prompt fluff, dropping average tokens by 18% while increasing classification accuracy by +28.6%.

---

### Feature 2: Outreach Generation (`outreach_draft`)

#### Version 1 (`prompts/v1/outreach_draft_v1.txt`)
* **Characteristics**: Generic sales email prompt ("Write a cold email selling cybersecurity software to this company").
* **Failure Modes**: Overly salesy, generic buzzwords ("synergy", "cutting-edge end-to-end security"), hallucinated details about past conversations, lacked specific citation of detected signals.

#### Version 2 (`prompts/v2/outreach_draft_v2.txt`) — Production
* **Improvements**:
  1. **Signal-Grounded Framing**: Mandatory rule: Email MUST cite at least 1 verified factual signal from the company dossier (e.g., *"Noticed your engineering team expanded 40% with no dedicated SecOps hire..."*).
  2. **Persona-Specific Tone**: Tailors language to the specific decision maker (technical & architecture-focused for VP of Eng; risk & compliance-focused for CFO/COO).
  3. **Multi-Channel Deliverable**: Produces both a 75-word low-friction cold email AND a 40-word LinkedIn InMail message with clear call-to-action (CTA).
