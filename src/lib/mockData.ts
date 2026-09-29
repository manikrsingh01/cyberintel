import seedData from "../../data/seed_companies.json";
import { Company } from "./types";
import { scoreCompanyHybrid } from "./scoring";

/**
 * Load seed companies from pre-scored JSON dataset.
 * The ingestion pipeline (scripts/ingest_5k_diverse.py) already assigns calibrated
 * risk_tier, cyber_risk_score, buying_signals, and sales_battlecard to each record.
 * We only run scoreCompanyHybrid for records missing a pre-computed score (e.g. CSV uploads).
 */
export const initialCompanies: Company[] = (seedData as Partial<Company>[]).map(c => {
  // If the record already has a valid pre-scored tier and score, use it directly
  if (
    c.cyber_risk_score &&
    c.risk_tier &&
    c.buying_signals &&
    Array.isArray(c.buying_signals) &&
    c.buying_signals.length > 0
  ) {
    return {
      id: c.id || `comp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: c.name || "Unknown Company",
      domain: c.domain || "example.com",
      industry: c.industry || "General Technology",
      headcount: Number(c.headcount) || 100,
      location: c.location || "Global",
      annual_revenue: c.annual_revenue || "$10M",
      cloud_environment: c.cloud_environment || "AWS",
      tech_stack: c.tech_stack || [],
      compliance_mandates: c.compliance_mandates || [],
      engineering_growth_6m_pct: Number(c.engineering_growth_6m_pct) || 0,
      security_headcount: Number(c.security_headcount) || 0,
      recent_triggers: c.recent_triggers || "",
      cyber_risk_score: c.cyber_risk_score,
      risk_tier: c.risk_tier,
      buying_signals: c.buying_signals,
      target_buyer: c.target_buyer || { title: "VP of Engineering", pain_point: "Automated compliance" },
      rationale: c.rationale || "",
      security_debt_ratio: c.security_debt_ratio || 0,
      estimated_acv: c.estimated_acv || "$24,000 / yr",
      audit_countdown_days: c.audit_countdown_days,
      audit_countdown_label: c.audit_countdown_label,
      sales_battlecard: c.sales_battlecard || {
        primary_objection: "Budget constraints",
        counter_hook: "Automate compliance without hiring SecOps",
        recommended_angle: "Risk mitigation"
      }
    } as Company;
  }

  // Fallback: score from scratch for records without pre-computed scores (CSV uploads, etc.)
  return scoreCompanyHybrid(c);
});
