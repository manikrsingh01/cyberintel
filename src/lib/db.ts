import { getRequestContext } from "@cloudflare/next-on-pages";
import { Company, TelemetryTrace, FilterCounts } from "./types";

export interface D1Database {
  prepare(query: string): {
    bind(...values: any[]): {
      all<T = any>(): Promise<{ results: T[] }>;
      run(): Promise<{ success: boolean }>;
      first<T = any>(): Promise<T | null>;
    };
    all<T = any>(): Promise<{ results: T[] }>;
    run(): Promise<{ success: boolean }>;
    first<T = any>(): Promise<T | null>;
  };
}

/**
 * Safely retrieve the Cloudflare D1 database binding when executing on Edge Workers
 */
export function getD1(): D1Database | null {
  try {
    const ctx = getRequestContext();
    if (ctx && (ctx as any).env && (ctx as any).env.DB) {
      return (ctx as any).env.DB as D1Database;
    }
  } catch {
    // Falls back gracefully in local Next.js dev server without Edge context
  }

  if ((globalThis as any)?.DB) {
    return (globalThis as any).DB as D1Database;
  }

  return null;
}

/**
 * Save a telemetry trace into Cloudflare D1 database
 */
export async function saveTraceToD1(db: D1Database, trace: TelemetryTrace): Promise<boolean> {
  try {
    await db
      .prepare(
        `INSERT INTO telemetry_traces (
          id, timestamp, feature, model, prompt_version, 
          input_tokens, output_tokens, latency_ms, cost_usd, 
          company_name, decision_summary, cached
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        trace.id,
        trace.timestamp,
        trace.feature,
        trace.model,
        trace.prompt_version,
        trace.input_tokens,
        trace.output_tokens,
        trace.latency_ms,
        trace.cost_usd,
        trace.company_name,
        trace.decision_summary,
        trace.cached ? 1 : 0
      )
      .run();
    return true;
  } catch (err) {
    console.error("Failed to insert trace into Cloudflare D1:", err);
    return false;
  }
}

/**
 * Fetch all traces from Cloudflare D1 database
 */
export async function getTracesFromD1(db: D1Database, limit: number = 100): Promise<TelemetryTrace[]> {
  try {
    const { results } = await db
      .prepare(
        `SELECT id, timestamp, feature, model, prompt_version, 
                input_tokens, output_tokens, latency_ms, cost_usd, 
                company_name, decision_summary, cached
         FROM telemetry_traces
         ORDER BY timestamp DESC
         LIMIT ?`
      )
      .bind(limit)
      .all<any>();

    if (!results || results.length === 0) return [];

    return results.map((row) => ({
      id: String(row.id),
      timestamp: String(row.timestamp),
      feature: row.feature as any,
      model: String(row.model),
      prompt_version: row.prompt_version as any,
      input_tokens: Number(row.input_tokens) || 0,
      output_tokens: Number(row.output_tokens) || 0,
      latency_ms: Number(row.latency_ms) || 0,
      cost_usd: Number(row.cost_usd) || 0,
      company_name: String(row.company_name),
      decision_summary: String(row.decision_summary),
      cached: Boolean(row.cached),
    }));
  } catch (err) {
    console.error("Failed to query traces from Cloudflare D1:", err);
    return [];
  }
}

/**
 * Fetch stats across all 50,000+ companies from Cloudflare D1
 */
export async function getCompanyStatsFromD1(db: D1Database): Promise<FilterCounts> {
  try {
    const { results } = await db
      .prepare(
        `SELECT 
           COUNT(*) as total,
           SUM(CASE WHEN risk_tier = 'TIER_1_CRITICAL' THEN 1 ELSE 0 END) as tier1,
           SUM(CASE WHEN risk_tier = 'TIER_2_MODERATE' THEN 1 ELSE 0 END) as tier2,
           SUM(CASE WHEN risk_tier = 'TIER_3_LOW' THEN 1 ELSE 0 END) as tier3,
           SUM(CASE WHEN risk_tier = 'DISQUALIFIED' THEN 1 ELSE 0 END) as disqualified,
           SUM(CASE WHEN buying_signals LIKE '%CVE_VULNERABILITY%' THEN 1 ELSE 0 END) as cveCount,
           SUM(CASE WHEN buying_signals LIKE '%EXPIRED_SSL%' THEN 1 ELSE 0 END) as sslCount,
           SUM(CASE WHEN buying_signals LIKE '%DATABASE_EXPOSURE%' THEN 1 ELSE 0 END) as dbCount,
           SUM(CASE WHEN buying_signals LIKE '%SECURITY_DEBT_DISPARITY%' THEN 1 ELSE 0 END) as devGrowthCount
         FROM companies`
      )
      .all<any>();

    const row = results?.[0] || {};
    return {
      total: Number(row.total) || 0,
      tier1: Number(row.tier1) || 0,
      tier2: Number(row.tier2) || 0,
      tier3: Number(row.tier3) || 0,
      disqualified: Number(row.disqualified) || 0,
      cveCount: Number(row.cveCount) || 0,
      sslCount: Number(row.sslCount) || 0,
      dbCount: Number(row.dbCount) || 0,
      devGrowthCount: Number(row.devGrowthCount) || 0,
    };
  } catch (err) {
    console.error("Failed to query company stats from Cloudflare D1:", err);
    return {
      total: 0,
      tier1: 0,
      tier2: 0,
      tier3: 0,
      disqualified: 0,
      cveCount: 0,
      sslCount: 0,
      dbCount: 0,
      devGrowthCount: 0,
    };
  }
}

/**
 * Fetch companies with server-side pagination from Cloudflare D1 database
 */
export async function getCompaniesFromD1(
  db: D1Database,
  limit: number = 1000,
  offset: number = 0
): Promise<Company[]> {
  try {
    const { results } = await db
      .prepare(
        `SELECT id, name, domain, industry, headcount, location, annual_revenue, 
                cloud_environment, tech_stack, compliance_mandates, 
                engineering_growth_6m_pct, security_headcount, recent_triggers, security_debt_ratio, 
                estimated_acv, audit_countdown_days, audit_countdown_label, 
                sales_battlecard, cyber_risk_score, risk_tier, buying_signals, 
                target_buyer, rationale
         FROM companies
         ORDER BY cyber_risk_score DESC
         LIMIT ? OFFSET ?`
      )
      .bind(limit, offset)
      .all<any>();

    if (!results || results.length === 0) return [];

    return results.map((row) => ({
      id: String(row.id),
      name: String(row.name),
      domain: String(row.domain),
      industry: String(row.industry),
      headcount: Number(row.headcount) || 0,
      location: String(row.location || ""),
      annual_revenue: String(row.annual_revenue || ""),
      cloud_environment: String(row.cloud_environment || ""),
      tech_stack: safeParseArray(row.tech_stack),
      compliance_mandates: safeParseArray(row.compliance_mandates),
      engineering_growth_6m_pct: Number(row.engineering_growth_6m_pct) || 0,
      security_headcount: Number(row.security_headcount) || 0,
      recent_triggers: String(row.recent_triggers || "Scaling operations"),
      security_debt_ratio: Number(row.security_debt_ratio) || 0,
      estimated_acv: String(row.estimated_acv || "$35k - $60k"),
      audit_countdown_days: row.audit_countdown_days ? Number(row.audit_countdown_days) : undefined,
      audit_countdown_label: row.audit_countdown_label || undefined,
      sales_battlecard: safeParseObject(row.sales_battlecard, {
        primary_objection: "Budget constraints",
        counter_hook: "Automate compliance without hiring SecOps",
        recommended_angle: "Risk mitigation",
      }),
      cyber_risk_score: Number(row.cyber_risk_score) || 0,
      risk_tier: row.risk_tier as any,
      buying_signals: safeParseArray(row.buying_signals),
      target_buyer: safeParseObject(row.target_buyer, {
        title: "VP of Engineering",
        pain_point: "Automated compliance evidence",
      }),
      rationale: row.rationale || undefined,
    }));
  } catch (err) {
    console.error("Failed to query companies from Cloudflare D1:", err);
    return [];
  }
}

function safeParseArray(val: any): any[] {
  if (Array.isArray(val)) return val;
  if (!val || typeof val !== "string") return [];
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return val.split(",").map((s) => s.trim());
  }
}

function safeParseObject(val: any, fallback: any): any {
  if (val && typeof val === "object") return val;
  if (!val || typeof val !== "string") return fallback;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}
