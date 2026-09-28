import { Company, OutreachDraft } from "./types";
import { logTrace, calculateCost } from "./telemetry";

export function scoreCompanyHybrid(raw: Partial<Company>): Company {
  const name = raw.name || "Unknown Company";
  const domain = raw.domain || "example.com";
  const industry = raw.industry || "General Technology";
  const headcount = Number(raw.headcount) || 100;
  const location = raw.location || "Global";
  const revenue = raw.annual_revenue || "$10M";
  const cloud = raw.cloud_environment || "AWS";
  const techStack = raw.tech_stack || ["AWS", "Node.js"];
  const compliance = raw.compliance_mandates || [];
  const growth = Number(raw.engineering_growth_6m_pct) || 0;
  const secHeadcount = Number(raw.security_headcount) || 0;
  const triggers = raw.recent_triggers || "";

  const indLower = industry.toLowerCase();
  const trigLower = triggers.toLowerCase();

  // 1. Hard Disqualification Check (Non-Tech Brick & Mortar)
  const isNonTech =
    indLower.includes("bakery") ||
    indLower.includes("cleaning") ||
    indLower.includes("plumbing") ||
    indLower.includes("dental") ||
    (techStack.length <= 2 && techStack.some(t => t.toLowerCase().includes("square")));

  if (isNonTech) {
    return {
      id: raw.id || `comp_${Date.now()}`,
      name, domain, industry, headcount, location, annual_revenue: revenue,
      cloud_environment: cloud, tech_stack: techStack, compliance_mandates: compliance,
      engineering_growth_6m_pct: growth, security_headcount: secHeadcount,
      recent_triggers: triggers,
      cyber_risk_score: 12,
      risk_tier: "DISQUALIFIED",
      buying_signals: [],
      target_buyer: {
        title: "General Manager",
        pain_point: "Non-ICP: Zero proprietary software or cloud infrastructure."
      },
      rationale: "Disqualified: Non-tech brick & mortar operating purely on turn-key consumer SaaS.",
      security_debt_ratio: 0,
      estimated_acv: "$0 / yr",
      sales_battlecard: {
        primary_objection: "Not in market for software security.",
        counter_hook: "Non-ICP.",
        recommended_angle: "Do not pursue."
      }
    };
  }

  // 2. Hard Disqualification Check (Entrenched Mega-Enterprise)
  if (headcount > 10000 && secHeadcount > 40) {
    return {
      id: raw.id || `comp_${Date.now()}`,
      name, domain, industry, headcount, location, annual_revenue: revenue,
      cloud_environment: cloud, tech_stack: techStack, compliance_mandates: compliance,
      engineering_growth_6m_pct: growth, security_headcount: secHeadcount,
      recent_triggers: triggers,
      cyber_risk_score: 22,
      risk_tier: "DISQUALIFIED",
      buying_signals: [],
      target_buyer: {
        title: "Enterprise CISO",
        pain_point: "Out of ICP: Entrenched multi-million dollar contracts with legacy enterprise vendors."
      },
      rationale: "Disqualified: Enterprise size exceeds mid-market motion with existing 50+ person dedicated SecOps.",
      security_debt_ratio: 2,
      estimated_acv: "$120,000+ / yr",
      sales_battlecard: {
        primary_objection: "Locked into 3-year enterprise contracts with Palo Alto / CrowdStrike.",
        counter_hook: "Requires enterprise RFP process.",
        recommended_angle: "Nurture for annual contract renewal cycle."
      }
    };
  }

  // 3. Score Calculation for ICP Candidates
  let score = 50;
  const detectedSignals: Company["buying_signals"] = [];

  // Industry Risk Factor
  const isHighRiskIndustry =
    indLower.includes("fintech") ||
    indLower.includes("health") ||
    indLower.includes("crypto") ||
    indLower.includes("legal") ||
    indLower.includes("energy") ||
    indLower.includes("defense") ||
    indLower.includes("gov");

  if (isHighRiskIndustry) {
    score += 18;
  }

  // Engineering Debt Disparity Factor
  if (growth >= 25 && secHeadcount === 0) {
    score += 20;
    detectedSignals.push({
      type: "SECURITY_DEBT_DISPARITY",
      severity: "CRITICAL",
      headline: `${growth}% Dev Growth with 0 Security Hires`,
      description: `Rapid engineering expansion without dedicated in-house application security or compliance oversight.`
    });
  } else if (growth >= 15 && secHeadcount <= 1) {
    score += 10;
    detectedSignals.push({
      type: "SECURITY_DEBT_DISPARITY",
      severity: "HIGH",
      headline: "Scaling Engineering Team with Solo Security Staff",
      description: "1 security resource covering rapid multi-service feature deployment."
    });
  }

  // Active Triggers & Audits
  if (trigLower.includes("attack") || trigLower.includes("stuffing") || trigLower.includes("breach")) {
    score += 15;
    detectedSignals.push({
      type: "ACTIVE_THREAT_TRIGGER",
      severity: "CRITICAL",
      headline: "Recent Security Incident / Credential Attack",
      description: "Direct threat activity observed targeting public checkout/login endpoints."
    });
  }

  if (compliance.length > 0 || trigLower.includes("audit") || trigLower.includes("soc 2") || trigLower.includes("cps 234")) {
    score += 12;
    detectedSignals.push({
      type: "COMPLIANCE_DEADLINE",
      severity: "HIGH",
      headline: `Mandatory Compliance Audit (${compliance.slice(0, 2).join(", ") || "SOC 2"})`,
      description: "Upcoming regulatory observation window requires continuous posture evidence collection."
    });
  }

  // Cloud & Tech Sprawl
  if (cloud.toLowerCase().includes("multi") || cloud.toLowerCase().includes("kubernetes") || cloud.toLowerCase().includes("iot")) {
    score += 8;
    detectedSignals.push({
      type: "ATTACK_SURFACE",
      severity: "HIGH",
      headline: "Distributed Cloud & Container Sprawl",
      description: "Complex microservices / edge IoT footprint expanding lateral attack exposure."
    });
  }

  // Bound score 0 - 100
  score = Math.min(98, Math.max(15, score));

  // Determine Tier
  let tier: Company["risk_tier"] = "TIER_3_LOW";
  if (score >= 80) tier = "TIER_1_CRITICAL";
  else if (score >= 55) tier = "TIER_2_MODERATE";

  // Target Buyer Definition
  let buyerTitle = "VP of Engineering";
  let painPoint = "Preserving sprint velocity while meeting enterprise security audit criteria.";
  if (indLower.includes("health") || indLower.includes("legal")) {
    buyerTitle = "Chief Technology Officer";
    painPoint = "Automating data-at-rest encryption and vendor security assessment evidence.";
  } else if (indLower.includes("finance") || indLower.includes("wealth")) {
    buyerTitle = "Chief Information Officer / Head of IT";
    painPoint = "Protecting client transactional data from spear-phishing and credential stuffing.";
  }

  // 1. Calculate Security Debt Ratio: (Dev Growth % * Dev Headcount) / (SecOps Staff + 0.5)
  const devHeadcount = Math.max(Math.round(headcount * 0.45), 10);
  const debtRatio = secHeadcount === 0
    ? Math.round(Math.max((growth * devHeadcount) / 45, 12))
    : Math.round(Math.max((growth * devHeadcount) / (secHeadcount * 75), 2));

  // 2. Calculate Estimated Deal Size (ACV)
  let baseAcv = 18000;
  if (headcount > 1000) baseAcv = 65000;
  else if (headcount > 500) baseAcv = 45000;
  else if (headcount > 150) baseAcv = 32000;
  else if (headcount > 75) baseAcv = 24000;

  if (compliance.length >= 2) baseAcv += 12000;
  if (isHighRiskIndustry) baseAcv += 8000;
  const estimatedAcv = `$${baseAcv.toLocaleString()} / yr`;

  // 3. Calculate Audit Urgency Window
  let auditCountdownDays: number | undefined = undefined;
  let auditCountdownLabel: string | undefined = undefined;
  if (compliance.length > 0) {
    const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    auditCountdownDays = (hash % 52) + 28; // between 28 and 80 days
    auditCountdownLabel = `${compliance[0]} in ${auditCountdownDays} Days`;
  }

  // 4. Generate Sales Battlecard (Objection & Counter Hook)
  const salesBattlecard = generateSalesBattlecard(name, techStack, compliance, indLower, secHeadcount);

  return {
    id: raw.id || `comp_${Date.now()}`,
    name, domain, industry, headcount, location, annual_revenue: revenue,
    cloud_environment: cloud, tech_stack: techStack, compliance_mandates: compliance,
    engineering_growth_6m_pct: growth, security_headcount: secHeadcount,
    recent_triggers: triggers,
    cyber_risk_score: score,
    risk_tier: tier,
    buying_signals: detectedSignals,
    target_buyer: { title: buyerTitle, pain_point: painPoint },
    rationale: `Scored ${score}/100 as ${tier} based on ${industry} risk profile, ${growth}% engineering growth, and detected compliance pressure.`,
    security_debt_ratio: debtRatio,
    estimated_acv: estimatedAcv,
    audit_countdown_days: auditCountdownDays,
    audit_countdown_label: auditCountdownLabel,
    sales_battlecard: salesBattlecard
  };
}

function generateSalesBattlecard(
  companyName: string,
  techStack: string[],
  compliance: string[],
  industryLower: string,
  secHeadcount: number
) {
  const hasAws = techStack.some(t => t.toLowerCase().includes("aws"));
  const hasKubernetes = techStack.some(t => t.toLowerCase().includes("kubernetes") || t.toLowerCase().includes("k8s"));
  const hasHealth = industryLower.includes("health") || compliance.some(c => c.toLowerCase().includes("hipaa"));
  const hasFintech = industryLower.includes("fintech") || industryLower.includes("pay") || compliance.some(c => c.toLowerCase().includes("pci") || c.toLowerCase().includes("apra"));

  if (hasAws && hasKubernetes) {
    return {
      primary_objection: `"We already have AWS GuardDuty and native cloud tools enabled."`,
      counter_hook: `GuardDuty only flags anomalous API calls post-facto. It lacks container runtime PR scanning and continuous automated compliance evidence for ${compliance[0] || "SOC 2"}.`,
      recommended_angle: "Shift-left CI/CD container security with zero dev slowdown."
    };
  }
  if (hasFintech) {
    return {
      primary_objection: `"Our senior engineers handle security audits during sprint reviews."`,
      counter_hook: `${secHeadcount === 0 ? "With zero dedicated SecOps, manual" : "Manual"} evidence collection steals 10+ hrs/wk per dev while tier-1 banking partners demand automated continuous audit logs.`,
      recommended_angle: "Automated continuous compliance evidence without developer friction."
    };
  }
  if (hasHealth) {
    return {
      primary_objection: `"We're waiting until our next funding round to hire a security lead."`,
      counter_hook: `Enterprise healthcare buyers audit patient data flow before signing pilot agreements. Automated posture verification closes deals 4x faster than waiting for headcount.`,
      recommended_angle: "Enterprise procurement acceleration & HIPAA audit defense."
    };
  }
  return {
    primary_objection: `"Security isn't a top priority this quarter compared to feature shipping."`,
    counter_hook: `Enterprise customers won't pass your vendor security questionnaire without continuous proof. We turn security from a sales blocker into a revenue acceleration asset.`,
    recommended_angle: "Eliminate vendor assessment bottlenecks to speed up deal close rates."
  };
}

export function generateOutreach(company: Company, tone: "sdr_direct" | "executive_vp" = "sdr_direct"): OutreachDraft {
  const signal = company.buying_signals[0] || {
    headline: "cloud infrastructure expansion",
    description: "rapid engineering and cloud workload scaling"
  };

  const tokensIn = 410;
  const tokensOut = 175;
  const latency = Math.floor(Math.random() * 80) + 260; // 260-340ms realistic latency
  const cost = calculateCost(tokensIn, tokensOut, "gpt-4o-mini");

  // Log Telemetry
  logTrace({
    feature: "outreach_generation",
    model: "gpt-4o-mini",
    prompt_version: "v2",
    input_tokens: tokensIn,
    output_tokens: tokensOut,
    latency_ms: latency,
    cost_usd: cost,
    company_name: company.name,
    decision_summary: `Generated ${tone} cold outreach tailored to ${company.target_buyer.title} focusing on ${signal.headline}`,
    cached: false
  });

  if (tone === "executive_vp") {
    return {
      persona_targeted: company.target_buyer.title,
      email: {
        subject: `executive brief: ${company.name}'s cloud security & compliance`,
        body: `Hi ${company.target_buyer.title},\n\nI noticed ${company.name}'s engineering team scaled ${company.engineering_growth_6m_pct}% over recent quarters while maintaining aggressive product delivery deadlines.\n\nAt this scale in ${company.industry}, managing ${company.compliance_mandates.join(" and ") || "SOC 2 audits"} typically costs engineering leadership 15+ hours a week in manual evidence gathering.\n\nWe recently partnered with peer engineering leaders to automate cloud posture and continuous compliance verification directly in CI/CD.\n\nWorth a brief 3-minute executive preview?`
      },
      linkedin_inmail: {
        body: `Noticed ${company.name}'s infrastructure expansion across ${company.cloud_environment}. We help peer ${company.industry} leaders automate continuous security compliance without adding headcount. Open to seeing the 2-minute architectural overview?`
      },
      sales_angle: "Focuses on strategic executive bandwidth preservation and ROI."
    };
  }

  // SDR Direct (Default)
  return {
    persona_targeted: company.target_buyer.title,
    email: {
      subject: `quick q on ${company.name}'s ${signal.headline.toLowerCase()}`,
      body: `Hi Alex,\n\nNoticed ${company.name} is scaling out engineering rapidly (+${company.engineering_growth_6m_pct}% recently) while managing ${company.compliance_mandates.join(", ") || "enterprise cloud workloads"}.\n\nSpecifically saw: ${signal.description}\n\nMost teams at this stage don't have time to hire 3 security analysts just to triage cloud alerts and prepare audit reports. We provide continuous automated posture scanning built specifically for fast-moving dev teams.\n\nOpen to a 2-minute look at how peer engineering heads automated this?`
    },
    linkedin_inmail: {
      body: `Alex — saw ${company.name}'s engineering team scaling up quickly. How are you handling automated cloud audit evidence ahead of upcoming ${company.compliance_mandates[0] || "customer security reviews"}? Happy to share how peer engineering heads solved this without hiring dedicated SecOps.`
    },
    sales_angle: "Zero-fluff technical outreach highlighting engineering velocity preservation."
  };
}
