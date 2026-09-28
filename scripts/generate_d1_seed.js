const fs = require('fs');
const path = require('path');

const seedCompanies = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/seed_companies.json'), 'utf8'));
const tracesLines = fs.readFileSync(path.join(__dirname, '../data/traces.jsonl'), 'utf8')
  .split('\n')
  .filter(l => l.trim().length > 0)
  .map(l => JSON.parse(l));

function escapeSql(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 1 : 0;
  return `'${String(val).replace(/'/g, "''")}'`;
}

let sql = '-- D1 Seed Data for CyberIntel (Companies & Traces)\n\n';

for (const c of seedCompanies) {
  const devGrowth = Number(c.engineering_growth_6m_pct || 0);
  const secHires = Number(c.security_headcount || 0);
  const debtRatio = Number(((devGrowth / 100 * (c.headcount * 0.45)) / (secHires + 0.5)).toFixed(1));
  const estAcv = c.headcount > 250 ? "$54,000 / yr" : c.headcount > 100 ? "$38,000 / yr" : "$22,000 / yr";
  const countdownDays = 45;
  const countdownLabel = "SOC 2 Type II Review in 45 Days";
  const battlecard = JSON.stringify({
    primary_objection: "We don't have dedicated security staff to manage another platform.",
    counter_hook: "That is precisely why engineering teams at your stage deploy us: 1-click automated evidence collection without developer friction.",
    recommended_angle: "Emphasize velocity protection."
  });

  sql += `INSERT OR REPLACE INTO companies (
    id, name, domain, industry, headcount, location, annual_revenue,
    cloud_environment, tech_stack, compliance_mandates, engineering_growth_6m_pct,
    security_headcount, security_debt_ratio, estimated_acv, audit_countdown_days,
    audit_countdown_label, sales_battlecard, cyber_risk_score, risk_tier,
    buying_signals, target_buyer, rationale
  ) VALUES (
    ${escapeSql(c.id)},
    ${escapeSql(c.name)},
    ${escapeSql(c.domain)},
    ${escapeSql(c.industry)},
    ${escapeSql(c.headcount)},
    ${escapeSql(c.location)},
    ${escapeSql(c.annual_revenue)},
    ${escapeSql(c.cloud_environment)},
    ${escapeSql(JSON.stringify(c.tech_stack))},
    ${escapeSql(JSON.stringify(c.compliance_mandates))},
    ${escapeSql(c.engineering_growth_6m_pct)},
    ${escapeSql(c.security_headcount)},
    ${escapeSql(debtRatio)},
    ${escapeSql(estAcv)},
    ${escapeSql(countdownDays)},
    ${escapeSql(countdownLabel)},
    ${escapeSql(battlecard)},
    ${escapeSql(c.cyber_risk_score)},
    ${escapeSql(c.risk_tier)},
    ${escapeSql(JSON.stringify(c.buying_signals))},
    ${escapeSql(JSON.stringify(c.target_buyer))},
    ${escapeSql(c.rationale)}
  );\n`;
}

sql += '\n-- Telemetry Traces\n';
for (const t of tracesLines) {
  sql += `INSERT OR REPLACE INTO telemetry_traces (
    id, timestamp, feature, model, prompt_version, input_tokens, output_tokens,
    latency_ms, cost_usd, company_name, decision_summary, cached
  ) VALUES (
    ${escapeSql(t.id)},
    ${escapeSql(t.timestamp)},
    ${escapeSql(t.feature)},
    ${escapeSql(t.model)},
    ${escapeSql(t.prompt_version || 'v2')},
    ${escapeSql(t.input_tokens || 0)},
    ${escapeSql(t.output_tokens || 0)},
    ${escapeSql(t.latency_ms || 0)},
    ${escapeSql(t.cost_usd || 0)},
    ${escapeSql(t.company_name)},
    ${escapeSql(t.decision_summary)},
    ${escapeSql(t.cached ? 1 : 0)}
  );\n`;
}

fs.writeFileSync(path.join(__dirname, '../d1_seed.sql'), sql, 'utf8');
console.log('Successfully generated d1_seed.sql with', seedCompanies.length, 'companies and', tracesLines.length, 'traces.');
