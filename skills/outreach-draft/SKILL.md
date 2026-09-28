---
name: outreach-draft
version: "2.0.0"
description: "Generates signal-grounded, multi-channel B2B cold sales outreach (Email & LinkedIn InMail) tailored to specific cybersecurity decision-maker pain points."
author: "Antigravity AI Native Engineering"
tags: ["sales-outreach", "cold-email", "cybersecurity", "linkedin-inmail"]
---

# Skill: Signal-Grounded Sales Outreach Generation

## 1. Overview
The `outreach-draft` skill takes a scored company dossier and synthesizes hyper-personalized outbound messaging. Instead of sending generic spam, it anchors the opening hook on verified technical triggers (such as high engineering growth with no security hires, impending SOC 2 audits, or API expansions).

---

## 2. Trigger Conditions
Execute this skill when:
- A sales development representative (SDR) or account executive (AE) clicks "Draft Outreach" on an account card.
- An automated outbound campaign prepares sequences for high-priority Tier 1 accounts.

---

## 3. Input Specification

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Company name |
| `buyer_title` | string | Yes | Target persona title (e.g. VP of Engineering) |
| `buyer_pain_point` | string | Yes | Specific urgent challenge identified in scoring |
| `buying_signals` | array[object] | Yes | Detected high-severity buying signals |
| `cloud_environment`| string | Yes | Target cloud hosting environment |
| `tech_stack` | array[string]| Yes | Relevant tech stack components |
| `recent_triggers` | string | No | Recent news, audits, or hiring spikes |

---

## 4. Output Specification

```json
{
  "email": {
    "subject": "quick q on payflow's cloud security ahead of cps 234",
    "body": "Hi Alex,\n\nNoticed PayFlow's engineering team expanded over 40% recently while scaling out your open banking APIs across multi-region AWS.\n\nWith APRA CPS 234 audits tightening for fintechs handling banking partner integrations, teams at this stage usually get caught spending weeks manually consolidating cloud posture evidence.\n\nWe built an automated cloud posture engine that gives engineering heads complete visibility without slowing down sprints. Open to a 2-minute look at how peer fintechs automated this before their audit?"
  },
  "linkedin_inmail": {
    "body": "Alex — saw PayFlow's recent API expansion across AWS. Given the upcoming CPS 234 requirements, how are you handling automated cloud audit evidence collection across your dev clusters? Happy to share our peer benchmark if relevant."
  },
  "sales_angle": "Focuses on impending APRA regulatory friction and engineering velocity preservation rather than generic fear-mongering."
}
```

---

## 5. Dependent Prompts
- Production Prompt: `prompts/v2/outreach_draft_v2.txt`
- Baseline Prompt: `prompts/v1/outreach_draft_v1.txt`
