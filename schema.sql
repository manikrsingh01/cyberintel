-- Cloudflare D1 Database Schema for CyberIntel (project-cyberintel)
-- Created for Cloudflare D1 Serverless SQL Database

-- 1. Companies & Security Propensity Profiles
CREATE TABLE IF NOT EXISTS companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT NOT NULL,
  industry TEXT NOT NULL,
  headcount INTEGER NOT NULL,
  location TEXT NOT NULL,
  annual_revenue TEXT,
  cloud_environment TEXT NOT NULL,
  tech_stack TEXT NOT NULL,
  compliance_mandates TEXT NOT NULL,
  engineering_growth_6m_pct REAL NOT NULL,
  security_headcount INTEGER NOT NULL,
  security_debt_ratio REAL NOT NULL,
  recent_triggers TEXT,
  estimated_acv TEXT NOT NULL,
  audit_countdown_days INTEGER,
  audit_countdown_label TEXT,
  sales_battlecard TEXT,
  cyber_risk_score INTEGER NOT NULL,
  risk_tier TEXT NOT NULL,
  buying_signals TEXT NOT NULL,
  target_buyer TEXT NOT NULL,
  rationale TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_companies_risk_tier ON companies(risk_tier);
CREATE INDEX IF NOT EXISTS idx_companies_score ON companies(cyber_risk_score DESC);
CREATE INDEX IF NOT EXISTS idx_companies_domain ON companies(domain);

-- 2. Real-Time Telemetry & AI Observability Traces
CREATE TABLE IF NOT EXISTS telemetry_traces (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  feature TEXT NOT NULL,
  model TEXT NOT NULL,
  prompt_version TEXT NOT NULL,
  input_tokens INTEGER NOT NULL,
  output_tokens INTEGER NOT NULL,
  latency_ms INTEGER NOT NULL,
  cost_usd REAL NOT NULL,
  company_name TEXT NOT NULL,
  decision_summary TEXT NOT NULL,
  cached INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_traces_timestamp ON telemetry_traces(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_traces_feature ON telemetry_traces(feature);

-- 3. Evaluation Benchmarks & Quality Calibration Records
CREATE TABLE IF NOT EXISTS eval_benchmarks (
  id TEXT PRIMARY KEY,
  metric_name TEXT NOT NULL,
  v1_score REAL NOT NULL,
  v2_score REAL NOT NULL,
  delta_text TEXT NOT NULL,
  details TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
