export type RiskTier = "TIER_1_CRITICAL" | "TIER_2_MODERATE" | "TIER_3_LOW" | "DISQUALIFIED";

export type SignalSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface BuyingSignal {
  type: string;
  severity: SignalSeverity;
  headline: string;
  description: string;
}

export interface TargetBuyer {
  title: string;
  pain_point: string;
}

export interface SalesBattlecard {
  primary_objection: string;
  counter_hook: string;
  recommended_angle: string;
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  industry: string;
  headcount: number;
  location: string;
  annual_revenue: string;
  cloud_environment: string;
  tech_stack: string[];
  compliance_mandates: string[];
  engineering_growth_6m_pct: number;
  security_headcount: number;
  recent_triggers: string;
  cyber_risk_score: number;
  risk_tier: RiskTier;
  buying_signals: BuyingSignal[];
  target_buyer: TargetBuyer;
  rationale?: string;
  // Innovative Derived Sales Metrics
  security_debt_ratio: number;
  estimated_acv: string;
  audit_countdown_days?: number;
  audit_countdown_label?: string;
  sales_battlecard: SalesBattlecard;
}

export interface OutreachDraft {
  email: {
    subject: string;
    body: string;
  };
  linkedin_inmail: {
    body: string;
  };
  sales_angle: string;
  persona_targeted: string;
}

export interface TelemetryTrace {
  id: string;
  timestamp: string;
  feature: "account_scoring" | "outreach_generation" | "batch_enrichment";
  model: string;
  prompt_version: "v1" | "v2";
  input_tokens: number;
  output_tokens: number;
  latency_ms: number;
  cost_usd: number;
  company_name: string;
  decision_summary: string;
  cached: boolean;
}

export interface FilterState {
  search: string;
  tier: string;
  industry: string;
  minScore: number;
  selectedSignalType: string;
}

export interface FilterCounts {
  total: number;
  tier1: number;
  tier2: number;
  tier3: number;
  disqualified: number;
  cveCount: number;
  sslCount: number;
  dbCount: number;
  devGrowthCount: number;
}
