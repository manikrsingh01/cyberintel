# Loom Video Walkthrough Script (3–5 Minutes)

> **Goal**: A high-impact, articulate walkthrough for the Firmable hiring team showing the running app, the agentic development workflow, and the evaluation harness.

---

## ⏱️ Minute-by-Minute Outline

### [0:00 – 0:45] Introduction & The Problem We Solved
* **Screen**: Main Dashboard (`localhost:3000` or deployed hosted URL).
* **Talking Points**:
  - *"Hi Firmable team! For this take-home, I built an AI Sales Intelligence Platform tailored for an outbound sales team at a cybersecurity software company."*
  - *"The core problem we're solving: out of thousands of companies in the market, who actually needs our security software today, and how do we reach them first?"*
  - *"Instead of blasting generic cold emails or pitching mega-banks with 300-person in-house teams, this platform identifies verified structural signals: like 40%+ engineering growth with zero security hires, impending SOC 2 / APRA CPS 234 audits, or exposed cloud infrastructure."*

### [0:45 – 1:45] The Live App in Action (Sales Workflow)
* **Screen**: Interacting with the UI.
* **Actions**:
  1. Click on **Filter Chips**: Filter by **🔥 Tier 1 Critical** accounts. Show how accounts are instantly ranked by calibrated Cyber Risk Score.
  2. Click on **PayFlow Technologies** or **Nexus Health AI** to open the **Company Drawer**.
  3. Point out the **AI Scoring Rationale**, the detected buying signals (e.g. *42% Engineering Growth with 0 Security Staff*), and the recommended target buyer persona (*VP of Engineering*).
  4. Click **"Draft Targeted Outreach"**:
     - Toggle between **SDR Direct** (technical hook) and **Executive VP** (ROI / audit hook).
     - Show the signal-grounded email copy and LinkedIn InMail.
     - Hit "Copy Email" with instant clipboard feedback.

### [1:45 – 2:45] AI-Native Engineering: Skills & Prompt Versioning
* **Screen**: VS Code / Repository files.
* **Actions**:
  1. Open `skills/account-scoring/SKILL.md`: Show how this recurring AI workflow is packaged as a reusable agent skill with clear trigger conditions, schema, and worked examples.
  2. Open `prompts/README.md`: Show prompt versioning (`v1` baseline vs `v2` production few-shot). Explain how v1 had score inflation on non-tech businesses (like bakeries) and how v2 fixed it with strict schema constraints and hard disqualification rules.

### [2:45 – 3:45] The Evaluation Harness (The Quality Gate)
* **Screen**: Terminal & In-App Eval Modal.
* **Actions**:
  1. Open the UI **Eval Harness Modal** (or run `python3 evals/eval_harness.py` in the terminal).
  2. Highlight the numbers:
     - **Precision**: Jumped from **76% in v1 to 95% in v2** (+19%).
     - **Recall**: Maintained at **100%**.
     - **Token Efficiency**: Dropped by **20.3%**, saving latency and cost.
  3. Show the **In-App Telemetry Drawer**: Show the live log schema with latency, tokens, and cost per query ($0.00015).

### [3:45 – 4:30] Architecture, Cost Economics & Wrap-Up
* **Screen**: `ARCHITECTURE.md` or `HOW_WE_BUILD.md`.
* **Actions**:
  - *"We used a hybrid architecture: deterministic rules handle non-tech disqualification and headcount ratios for $0.00, while the LLM handles contextual signal synthesis and outreach drafting."*
  - *"The unit cost is just $1.57 per 10,000 accounts scored."*
  - *"All source code, evals, skills, and documentation are ready in the repository. Thank you for your time, and I look forward to your feedback!"*
