import { Company, OutreachDraft, RiskTier } from "./types";
import { generateOutreach, scoreCompanyHybrid } from "./scoring";
import { logTrace } from "./telemetry";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";

export interface TelemetryResult {
  latency_ms: number;
  prompt_tokens: number;
  completion_tokens: number;
  cost_usd: number;
  model: string;
  is_live: boolean;
}

/**
 * Call OpenRouter API with error handling, timeout, and latency/token instrumentation
 */
async function callOpenRouter(prompt: string, model: string = DEFAULT_MODEL) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENROUTER_API_KEY in environment");
  }

  const startTime = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 35000); // 35s timeout for upstream LLM

  try {
    const res = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Firmable CyberIntel Sales Platform",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 600,
        response_format: { type: "json_object" },
      }),
    });

    clearTimeout(timeoutId);
    const latency_ms = Date.now() - startTime;

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`OpenRouter API error ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    let choice = data.choices?.[0]?.message?.content;
    if (!choice) {
      throw new Error("Empty response from OpenRouter");
    }

    // Strip markdown code fences if present
    choice = choice.trim();
    if (choice.startsWith("```json")) {
      choice = choice.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (choice.startsWith("```")) {
      choice = choice.replace(/^```/, "").replace(/```$/, "").trim();
    }

    const usage = data.usage || {};
    const cost = usage.cost || (usage.total_tokens ? usage.total_tokens * 0.0000003 : 0.000008);

    return {
      rawContent: choice,
      telemetry: {
        latency_ms,
        prompt_tokens: usage.prompt_tokens || 0,
        completion_tokens: usage.completion_tokens || 0,
        cost_usd: Number(cost.toFixed(6)),
        model: data.model || model,
        is_live: true,
      } as TelemetryResult,
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * Robust JSON parser that handles raw newlines, markdown fences, and control characters
 */
function safeJsonParse(raw: string): any {
  try {
    return JSON.parse(raw);
  } catch {
    try {
      // Find JSON block
      let cleaned = raw.trim();
      if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7);
      if (cleaned.startsWith("```")) cleaned = cleaned.slice(3);
      if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3);

      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleaned = cleaned.slice(firstBrace, lastBrace + 1);
      }

      // Escape raw unescaped newlines/tabs inside strings
      const sanitized = cleaned.replace(/[\n\r\t]/g, (match) => {
        if (match === "\n") return "\\n";
        if (match === "\r") return "\\r";
        if (match === "\t") return "\\t";
        return match;
      });

      return JSON.parse(sanitized);
    } catch {
      // Direct regex fallback
      const subjectMatch = raw.match(/"subject"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
      const emailBodyMatch = raw.match(/"body"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
      const angleMatch = raw.match(/"sales_angle"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);

      return {
        email: {
          subject: subjectMatch ? subjectMatch[1].replace(/\\n/g, " ") : undefined,
          body: emailBodyMatch ? emailBodyMatch[1].replace(/\\n/g, "\n") : undefined,
        },
        linkedin_inmail: {
          body: undefined,
        },
        sales_angle: angleMatch ? angleMatch[1] : undefined,
      };
    }
  }
}

/**
 * Live AI Outreach Generation via OpenRouter (Production prompt v2)
 */
export async function generateLiveOutreach(
  company: Company,
  tone: "sdr_direct" | "executive_vp" = "sdr_direct",
  customInstruction?: string
): Promise<{ draft: OutreachDraft; telemetry: TelemetryResult }> {
  try {
    const toneInstructions = tone === "sdr_direct"
      ? `Tone: DIRECT & TECHNICAL (Peer-to-peer SDR for Engineering Leaders).
Focus on: Engineering developer velocity, CI/CD pipeline bottlenecks, Kubernetes/cloud alert fatigue, and solving security without hiring 3 expensive SecOps engineers.`
      : `Tone: EXECUTIVE VP LEVEL (ROI, Audit Risk, Compliance & Board Liability).
Focus on: Material business risk, imminent audit deadlines (SOC 2, HIPAA, APRA CPS 234), regulatory exposure, vendor procurement roadblocks, and cyber insurance requirements.`;

    const customizationBlock = customInstruction?.trim()
      ? `\n### USER SPECIFIC CUSTOMIZATION INSTRUCTION:\nThe user requested: "${customInstruction.trim()}". You MUST strictly follow this guidance in the drafted copy.\n`
      : "";

    const prompt = `You are an elite B2B cybersecurity sales strategist and executive copywriter.

### MISSION
Draft high-converting, signal-grounded sales outreach to the recommended buyer at ${company.name}.

${toneInstructions}
${customizationBlock}
### HARD CONSTRAINTS
1. Never use generic buzzwords ("game-changer", "revolutionary", "hope this email finds you well", "synergy").
2. Anchor to Real Signals: Reference their specific cloud stack (${company.cloud_environment}), dev growth (+${company.engineering_growth_6m_pct}%), compliance mandates (${company.compliance_mandates.join(", ") || "upcoming SOC 2"}), and security team size (${company.security_headcount} dedicated staff).
3. Low-friction interest CTA (e.g., "Open to seeing a 2-min breakdown of how peer teams handled this?").
4. Output ONLY valid JSON:
{
  "email": {
    "subject": "<Compelling lowercase or natural subject under 6 words>",
    "body": "<Body text under 90 words with paragraph breaks>"
  },
  "linkedin_inmail": {
    "body": "<Under 45 words direct message>"
  },
  "sales_angle": "<1-sentence strategic rationale explaining why this angle fits ${tone}>"
}

### TARGET COMPANY DOSSIER:
- Name: ${company.name}
- Buyer Persona: ${company.target_buyer.title}
- Pain Point: ${company.target_buyer.pain_point}
- Triggers: ${company.recent_triggers}
- Top Signals: ${company.buying_signals.map(s => s.headline).join("; ")}
- Security Debt Ratio: ${company.security_debt_ratio ? `${company.security_debt_ratio}x Debt (Eng Growth vs 0 SecOps)` : "Acute"}
- Urgency Window: ${company.audit_countdown_label || "Upcoming audit review"}
- Tactical Counter Hook: ${company.sales_battlecard?.counter_hook || "Automate continuous evidence collection without developer friction"}`;

    const { rawContent, telemetry } = await callOpenRouter(prompt);
    const parsed = safeJsonParse(rawContent);

    // Record live real-time trace into telemetry store
    logTrace({
      feature: "outreach_generation",
      model: telemetry.model,
      prompt_version: "v2",
      input_tokens: telemetry.prompt_tokens,
      output_tokens: telemetry.completion_tokens,
      latency_ms: telemetry.latency_ms,
      cost_usd: telemetry.cost_usd,
      company_name: company.name,
      decision_summary: `Generated ${tone} outreach (${telemetry.latency_ms}ms, ${telemetry.prompt_tokens + telemetry.completion_tokens} tokens). Angle: ${parsed?.sales_angle || "Grounded copy"}`,
      cached: false,
    });

    const fallbackInmail = `Saw ${company.name}'s engineering team scaling rapidly on ${company.cloud_environment.split(" ")[0]}. How are you handling automated compliance evidence ahead of audits without dedicating SecOps staff? Open to a 2-min peer breakdown?`;

    return {
      draft: {
        email: {
          subject: parsed?.email?.subject || `Quick question regarding ${company.name}'s cloud posture`,
          body: parsed?.email?.body || (typeof parsed?.email === "string" ? parsed.email : ""),
        },
        linkedin_inmail: {
          body: (parsed?.linkedin_inmail?.body && parsed.linkedin_inmail.body.length > 5)
            ? parsed.linkedin_inmail.body
            : fallbackInmail,
        },
        sales_angle: parsed?.sales_angle || "Targeted based on rapid engineering scaling and compliance deadlines.",
        persona_targeted: company.target_buyer.title,
      },
      telemetry,
    };
  } catch (err) {
    console.warn("Falling back to local heuristic outreach generator:", err);
    const fallbackDraft = generateOutreach(company, tone);
    return {
      draft: fallbackDraft,
      telemetry: {
        latency_ms: 12,
        prompt_tokens: 0,
        completion_tokens: 0,
        cost_usd: 0,
        model: "heuristic-fallback",
        is_live: false,
      },
    };
  }
}

/**
 * Live AI Account Scoring via OpenRouter (Production prompt v2)
 */
export async function scoreLiveAccount(
  raw: Partial<Company>
): Promise<{ company: Company; telemetry: TelemetryResult }> {
  try {
    const prompt = `You are an AI-Native B2B Sales Intelligence Scoring Engine for an enterprise cybersecurity vendor selling cloud posture and continuous compliance automation.

### OBJECTIVE
Evaluate target company against strict Ideal Customer Profile (ICP) criteria. Output calibrated score (0-100), risk tier, detected buying signals, and buyer profile.

### SCORING CALIBRATION
- TIER_1_CRITICAL (80-100): High data sensitivity, imminent compliance deadline or severe security debt (>25% dev growth with 0 sec staff).
- TIER_2_MODERATE (50-79): Modern cloud tech stack, moderate growth or 1-2 security staff.
- TIER_3_LOW (25-49): Stable footprint, low external attack surface.
- DISQUALIFIED (0-24): Non-tech / Brick & mortar OR mega-enterprise (>10,000 headcount) with 50+ security staff.

### OUTPUT JSON SCHEMA:
{
  "cyber_risk_score": <number 0-100>,
  "risk_tier": "TIER_1_CRITICAL" | "TIER_2_MODERATE" | "TIER_3_LOW" | "DISQUALIFIED",
  "buying_signals": [
    {
      "type": "SECURITY_DEBT_DISPARITY" | "COMPLIANCE_DEADLINE" | "ACTIVE_THREAT" | "ATTACK_SURFACE",
      "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
      "headline": "<max 8 word punchy signal title>",
      "description": "<concise 1-2 sentence evidence grounded in provided data>"
    }
  ],
  "target_buyer": {
    "title": "<recommended persona, e.g. VP of Engineering, Head of Infrastructure, CTO, CISO>",
    "pain_point": "<specific urgent business problem>"
  },
  "rationale": "<brief 2-sentence executive summary of scoring decision>"
}

### TARGET COMPANY DOSSIER:
- Name: ${raw.name || "Unknown"}
- Industry: ${raw.industry || "Technology"}
- Headcount: ${raw.headcount || 100}
- Revenue: ${raw.annual_revenue || "$10M+"}
- Cloud: ${raw.cloud_environment || "AWS"}
- Tech Stack: ${(raw.tech_stack || []).join(", ")}
- Compliance: ${(raw.compliance_mandates || []).join(", ")}
- Dev Growth: ${raw.engineering_growth_6m_pct || 20}%
- Security Staff: ${raw.security_headcount ?? 0}
- Triggers: ${raw.recent_triggers || "Active development"}`;

    const { rawContent, telemetry } = await callOpenRouter(prompt);
    const parsed = safeJsonParse(rawContent);

    // Record live real-time trace into telemetry store
    logTrace({
      feature: "account_scoring",
      model: telemetry.model,
      prompt_version: "v2",
      input_tokens: telemetry.prompt_tokens,
      output_tokens: telemetry.completion_tokens,
      latency_ms: telemetry.latency_ms,
      cost_usd: telemetry.cost_usd,
      company_name: raw.name || "New Account",
      decision_summary: `Scored ${parsed.cyber_risk_score || 85}/100 (${parsed.risk_tier || "TIER_1_CRITICAL"}). ${parsed.rationale || "Calibrated via prompt v2"}`,
      cached: false,
    });

    const hybridBase = scoreCompanyHybrid(raw);
    const scoredCompany: Company = {
      ...hybridBase,
      id: raw.id || `comp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: raw.name || "New Account",
      domain: raw.domain || "example.com",
      industry: raw.industry || "Technology",
      headcount: Number(raw.headcount || 100),
      location: raw.location || "Remote / US",
      annual_revenue: raw.annual_revenue || "$10M - $50M",
      cloud_environment: raw.cloud_environment || "Multi-Cloud",
      tech_stack: raw.tech_stack || ["AWS", "Docker"],
      compliance_mandates: raw.compliance_mandates || ["SOC 2"],
      engineering_growth_6m_pct: Number(raw.engineering_growth_6m_pct || 25),
      security_headcount: Number(raw.security_headcount ?? 0),
      recent_triggers: raw.recent_triggers || "Scaling operations",
      cyber_risk_score: Math.min(100, Math.max(0, Number(parsed.cyber_risk_score) || hybridBase.cyber_risk_score)),
      risk_tier: (parsed.risk_tier as RiskTier) || hybridBase.risk_tier,
      buying_signals: Array.isArray(parsed.buying_signals) && parsed.buying_signals.length > 0 ? parsed.buying_signals : hybridBase.buying_signals,
      target_buyer: parsed.target_buyer || hybridBase.target_buyer,
      rationale: parsed.rationale || "Scored via production LLM evaluation.",
    };

    return { company: scoredCompany, telemetry };
  } catch (err) {
    console.warn("Falling back to deterministic hybrid scoring:", err);
    const fallbackCompany = scoreCompanyHybrid(raw);
    return {
      company: fallbackCompany,
      telemetry: {
        latency_ms: 8,
        prompt_tokens: 0,
        completion_tokens: 0,
        cost_usd: 0,
        model: "deterministic-heuristic",
        is_live: false,
      },
    };
  }
}
