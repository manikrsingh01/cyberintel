-- D1 Seed Data for CyberIntel (Companies & Traces)

INSERT OR REPLACE INTO companies (
    id, name, domain, industry, headcount, location, annual_revenue,
    cloud_environment, tech_stack, compliance_mandates, engineering_growth_6m_pct,
    security_headcount, security_debt_ratio, estimated_acv, audit_countdown_days,
    audit_countdown_label, sales_battlecard, cyber_risk_score, risk_tier,
    buying_signals, target_buyer, rationale
  ) VALUES (
    'comp_001',
    'PayFlow Technologies',
    'payflow.io',
    'Fintech & Payments',
    185,
    'Sydney, Australia',
    '$28M',
    'AWS (Multi-Region) + Kubernetes',
    '["AWS","Kubernetes","Node.js","PostgreSQL","Redis","Kafka"]',
    '["PCI-DSS Level 1","SOC 2 Type II","APRA CPS 234"]',
    42,
    0,
    69.9,
    '$38,000 / yr',
    45,
    'SOC 2 Type II Review in 45 Days',
    '{"primary_objection":"We don''t have dedicated security staff to manage another platform.","counter_hook":"That is precisely why engineering teams at your stage deploy us: 1-click automated evidence collection without developer friction.","recommended_angle":"Emphasize velocity protection."}',
    94,
    'TIER_1_CRITICAL',
    '[{"type":"SECURITY_DEBT_DISPARITY","severity":"HIGH","headline":"42% Engineering Growth with 0 Security Staff","description":"Engineering team expanded from 30 to 52 devs in 6 months with no dedicated security engineers or CISO."},{"type":"COMPLIANCE_DEADLINE","severity":"CRITICAL","headline":"APRA CPS 234 & PCI-DSS Compliance Audit Imminent","description":"Regulated Australian financial institution with upcoming CPS 234 information security compliance deadline."},{"type":"API_EXPOSURE","severity":"HIGH","headline":"Open Banking API Surface Expansion","description":"Publicly launching new payment gateway APIs without automated endpoint threat protection."}]',
    '{"title":"VP of Engineering & Head of Infrastructure","pain_point":"Needs automated cloud security posture management and API protection before the banking regulator audit."}',
    NULL
  );
INSERT OR REPLACE INTO companies (
    id, name, domain, industry, headcount, location, annual_revenue,
    cloud_environment, tech_stack, compliance_mandates, engineering_growth_6m_pct,
    security_headcount, security_debt_ratio, estimated_acv, audit_countdown_days,
    audit_countdown_label, sales_battlecard, cyber_risk_score, risk_tier,
    buying_signals, target_buyer, rationale
  ) VALUES (
    'comp_002',
    'Nexus Health AI',
    'nexushealth.ai',
    'Digital Health / Healthcare',
    120,
    'Melbourne, Australia',
    '$14M',
    'Google Cloud Platform (GCP) + BigQuery',
    '["GCP","Python","FastAPI","React","Docker","BigQuery"]',
    '["HIPAA","Privacy Act (Australia)","ISO 27001"]',
    35,
    0,
    37.8,
    '$38,000 / yr',
    45,
    'SOC 2 Type II Review in 45 Days',
    '{"primary_objection":"We don''t have dedicated security staff to manage another platform.","counter_hook":"That is precisely why engineering teams at your stage deploy us: 1-click automated evidence collection without developer friction.","recommended_angle":"Emphasize velocity protection."}',
    91,
    'TIER_1_CRITICAL',
    '[{"type":"SENSITIVE_DATA_EXPOSURE","severity":"CRITICAL","headline":"Ingesting High-Volume Electronic Health Records (PHI)","description":"Processing sensitive patient imaging data across external healthcare networks without zero-trust identity isolation."},{"type":"COMPLIANCE_DEADLINE","severity":"HIGH","headline":"Hospital Enterprise Vendor Security Assessment","description":"Hospital procurement requires proof of continuous SOC 2 and ISO 27001 compliance within 60 days."}]',
    '{"title":"Chief Technology Officer","pain_point":"Needs automated data-at-rest encryption monitoring and clinical cloud workload protection."}',
    NULL
  );
INSERT OR REPLACE INTO companies (
    id, name, domain, industry, headcount, location, annual_revenue,
    cloud_environment, tech_stack, compliance_mandates, engineering_growth_6m_pct,
    security_headcount, security_debt_ratio, estimated_acv, audit_countdown_days,
    audit_countdown_label, sales_battlecard, cyber_risk_score, risk_tier,
    buying_signals, target_buyer, rationale
  ) VALUES (
    'comp_003',
    'OmniRetail Direct',
    'omniretail.com',
    'E-Commerce & Retail',
    410,
    'Austin, TX, USA',
    '$85M',
    'Hybrid (AWS + Legacy Magento/On-Prem)',
    '["AWS","PHP/Magento","Shopify Plus","MySQL","Cloudflare"]',
    '["PCI-DSS Level 2","CCPA","GDPR"]',
    12,
    1,
    14.8,
    '$54,000 / yr',
    45,
    'SOC 2 Type II Review in 45 Days',
    '{"primary_objection":"We don''t have dedicated security staff to manage another platform.","counter_hook":"That is precisely why engineering teams at your stage deploy us: 1-click automated evidence collection without developer friction.","recommended_angle":"Emphasize velocity protection."}',
    88,
    'TIER_1_CRITICAL',
    '[{"type":"ACTIVE_THREAT_TRIGGER","severity":"CRITICAL","headline":"Recent Credential Stuffing & Bot Attack on Checkout","description":"Targeted by sophisticated account takeover attempts against customer login and gift card balances."},{"type":"HYBRID_LEGACY_RISK","severity":"HIGH","headline":"Legacy Monolith Hybrid Infrastructure","description":"Mix of modern cloud microservices and legacy on-prem payment databases creates unpatched visibility gaps."}]',
    '{"title":"Director of Information Security","pain_point":"Lone security manager overwhelmed by bot traffic and needs automated bot mitigation and WAF defense."}',
    NULL
  );
INSERT OR REPLACE INTO companies (
    id, name, domain, industry, headcount, location, annual_revenue,
    cloud_environment, tech_stack, compliance_mandates, engineering_growth_6m_pct,
    security_headcount, security_debt_ratio, estimated_acv, audit_countdown_days,
    audit_countdown_label, sales_battlecard, cyber_risk_score, risk_tier,
    buying_signals, target_buyer, rationale
  ) VALUES (
    'comp_004',
    'CloudScale Logistics',
    'cloudscalelogistics.com',
    'Logistics & Supply Chain',
    320,
    'Chicago, IL, USA',
    '$62M',
    'Microsoft Azure + On-prem Warehouse IoT',
    '["Azure",".NET Core","C#","Azure IoT Hub","SQL Server"]',
    '["SOC 2 Type II","ISO 27001"]',
    28,
    1,
    26.9,
    '$54,000 / yr',
    45,
    'SOC 2 Type II Review in 45 Days',
    '{"primary_objection":"We don''t have dedicated security staff to manage another platform.","counter_hook":"That is precisely why engineering teams at your stage deploy us: 1-click automated evidence collection without developer friction.","recommended_angle":"Emphasize velocity protection."}',
    82,
    'TIER_1_CRITICAL',
    '[{"type":"IOT_ATTACK_SURFACE","severity":"HIGH","headline":"1,200 Unmanaged Edge IoT Warehouse Devices","description":"Rapid rollout of connected supply-chain hardware without endpoint microsegmentation."},{"type":"SUPPLY_CHAIN_SCRUTINY","severity":"HIGH","headline":"Enterprise Logistics Customer Audit Requirements","description":"Fortune 500 retail clients demanding third-party supply chain cyber risk attestation."}]',
    '{"title":"VP of Infrastructure & IT Operations","pain_point":"Needs visibility into unauthorized IoT device communications and lateral movement detection."}',
    NULL
  );
INSERT OR REPLACE INTO companies (
    id, name, domain, industry, headcount, location, annual_revenue,
    cloud_environment, tech_stack, compliance_mandates, engineering_growth_6m_pct,
    security_headcount, security_debt_ratio, estimated_acv, audit_countdown_days,
    audit_countdown_label, sales_battlecard, cyber_risk_score, risk_tier,
    buying_signals, target_buyer, rationale
  ) VALUES (
    'comp_005',
    'FinEdge Wealth',
    'finedgewealth.com.au',
    'Wealth Management & Advisory',
    95,
    'Brisbane, Australia',
    '$19M',
    'AWS + Microsoft 365 Enterprise',
    '["AWS","Salesforce","Python","PostgreSQL","Okta"]',
    '["ASIC Regulatory Guide 271","SOC 2"]',
    25,
    0,
    21.4,
    '$22,000 / yr',
    45,
    'SOC 2 Type II Review in 45 Days',
    '{"primary_objection":"We don''t have dedicated security staff to manage another platform.","counter_hook":"That is precisely why engineering teams at your stage deploy us: 1-click automated evidence collection without developer friction.","recommended_angle":"Emphasize velocity protection."}',
    85,
    'TIER_1_CRITICAL',
    '[{"type":"HIGH_VALUE_TARGET","severity":"HIGH","headline":"$1.2B in Advisory Client Assets Managed Remotely","description":"Advisors handling wire transfers and confidential portfolios from distributed remote endpoints."},{"type":"ZERO_DEDICATED_SECURITY","severity":"HIGH","headline":"No Dedicated Security or Compliance Personnel","description":"IT operations handled by outsourced generalist MSP without dedicated 24/7 SIEM/SOC coverage."}]',
    '{"title":"Managing Director & Chief Operating Officer","pain_point":"Worried about email spear-phishing wire fraud and lacks real-time endpoint threat detection."}',
    NULL
  );
INSERT OR REPLACE INTO companies (
    id, name, domain, industry, headcount, location, annual_revenue,
    cloud_environment, tech_stack, compliance_mandates, engineering_growth_6m_pct,
    security_headcount, security_debt_ratio, estimated_acv, audit_countdown_days,
    audit_countdown_label, sales_battlecard, cyber_risk_score, risk_tier,
    buying_signals, target_buyer, rationale
  ) VALUES (
    'comp_006',
    'SentryGov Solutions',
    'sentrygov.com',
    'GovTech / Public Sector SaaS',
    210,
    'Canberra, Australia',
    '$34M',
    'AWS GovCloud (Australia) Protected Enclave',
    '["AWS GovCloud","TypeScript","React","PostgreSQL","Terraform"]',
    '["IRAP PROTECTED","Essential Eight Maturity Level 3"]',
    18,
    2,
    6.8,
    '$38,000 / yr',
    45,
    'SOC 2 Type II Review in 45 Days',
    '{"primary_objection":"We don''t have dedicated security staff to manage another platform.","counter_hook":"That is precisely why engineering teams at your stage deploy us: 1-click automated evidence collection without developer friction.","recommended_angle":"Emphasize velocity protection."}',
    78,
    'TIER_2_MODERATE',
    '[{"type":"GOV_COMPLIANCE_MANDATE","severity":"HIGH","headline":"Essential Eight Level 3 Certification Gap","description":"Current patching and application control mechanisms do not meet the Australian Cyber Security Centre (ACSC) mandate."}]',
    '{"title":"Head of Cyber Security & Compliance","pain_point":"Needs automated evidence collection for Australian Government IRAP audit."}',
    NULL
  );
INSERT OR REPLACE INTO companies (
    id, name, domain, industry, headcount, location, annual_revenue,
    cloud_environment, tech_stack, compliance_mandates, engineering_growth_6m_pct,
    security_headcount, security_debt_ratio, estimated_acv, audit_countdown_days,
    audit_countdown_label, sales_battlecard, cyber_risk_score, risk_tier,
    buying_signals, target_buyer, rationale
  ) VALUES (
    'comp_007',
    'Beacon InsurTech',
    'beaconinsure.io',
    'InsurTech',
    140,
    'New York, NY, USA',
    '$22M',
    'AWS Serverless (Lambda, DynamoDB)',
    '["AWS Lambda","DynamoDB","Node.js","Serverless Framework","Auth0"]',
    '["NYDFS Cybersecurity Regulation","SOC 2 Type II"]',
    30,
    0,
    37.8,
    '$38,000 / yr',
    45,
    'SOC 2 Type II Review in 45 Days',
    '{"primary_objection":"We don''t have dedicated security staff to manage another platform.","counter_hook":"That is precisely why engineering teams at your stage deploy us: 1-click automated evidence collection without developer friction.","recommended_angle":"Emphasize velocity protection."}',
    76,
    'TIER_2_MODERATE',
    '[{"type":"REGULATORY_AUDIT","severity":"HIGH","headline":"NYDFS 23 NYCRR 500 Compliance Deadline","description":"Mandatory annual cybersecurity compliance certification due under strict New York state regulations."},{"type":"SERVERLESS_SECURITY_BLINDSPOT","severity":"MEDIUM","headline":"Serverless Permission Over-Privilege","description":"Over 200 AWS Lambda functions sharing overly broad IAM roles."}]',
    '{"title":"VP of Technology","pain_point":"Needs automated serverless posture scanning and least-privilege IAM enforcement."}',
    NULL
  );
INSERT OR REPLACE INTO companies (
    id, name, domain, industry, headcount, location, annual_revenue,
    cloud_environment, tech_stack, compliance_mandates, engineering_growth_6m_pct,
    security_headcount, security_debt_ratio, estimated_acv, audit_countdown_days,
    audit_countdown_label, sales_battlecard, cyber_risk_score, risk_tier,
    buying_signals, target_buyer, rationale
  ) VALUES (
    'comp_008',
    'TalentWave HR',
    'talentwave.io',
    'HRTech & Workforce SaaS',
    280,
    'San Francisco, CA, USA',
    '$42M',
    'AWS + Kubernetes',
    '["AWS","EKS","Ruby on Rails","React","Snowflake","Datadog"]',
    '["SOC 2 Type II","GDPR","CCPA"]',
    15,
    1,
    12.6,
    '$54,000 / yr',
    45,
    'SOC 2 Type II Review in 45 Days',
    '{"primary_objection":"We don''t have dedicated security staff to manage another platform.","counter_hook":"That is precisely why engineering teams at your stage deploy us: 1-click automated evidence collection without developer friction.","recommended_angle":"Emphasize velocity protection."}',
    72,
    'TIER_2_MODERATE',
    '[{"type":"ENTERPRISE_DEAL_BLOCKER","severity":"HIGH","headline":"Security Review Delaying 4 Multi-Year Enterprise Deals","description":"Prospective enterprise clients stalling procurement over vendor risk assessments and annual pentest certificates."}]',
    '{"title":"Chief Information Officer","pain_point":"Needs continuous vulnerability scanning and customer-ready security trust center documentation."}',
    NULL
  );
INSERT OR REPLACE INTO companies (
    id, name, domain, industry, headcount, location, annual_revenue,
    cloud_environment, tech_stack, compliance_mandates, engineering_growth_6m_pct,
    security_headcount, security_debt_ratio, estimated_acv, audit_countdown_days,
    audit_countdown_label, sales_battlecard, cyber_risk_score, risk_tier,
    buying_signals, target_buyer, rationale
  ) VALUES (
    'comp_009',
    'AeroParts Global',
    'aeropartsglobal.com',
    'Aerospace & Defense Manufacturing',
    550,
    'Melbourne, Australia',
    '$110M',
    'Private Cloud + Hybrid Azure',
    '["Azure","Windows Server","SAP ERP","Cisco Hardware Firewalls"]',
    '["DISP (Defence Industry Security Program)","NIST 800-171"]',
    8,
    2,
    7.9,
    '$54,000 / yr',
    45,
    'SOC 2 Type II Review in 45 Days',
    '{"primary_objection":"We don''t have dedicated security staff to manage another platform.","counter_hook":"That is precisely why engineering teams at your stage deploy us: 1-click automated evidence collection without developer friction.","recommended_angle":"Emphasize velocity protection."}',
    75,
    'TIER_2_MODERATE',
    '[{"type":"DEFENSE_SUPPLY_CHAIN","severity":"HIGH","headline":"Australian Defence DISP Level 2 Accreditation","description":"Required to demonstrate physical and cyber threat isolation for classified IP blueprints."}]',
    '{"title":"Chief Information Security Officer","pain_point":"Needs operational technology (OT) and CAD workstation telemetry to stop espionage threats."}',
    NULL
  );
INSERT OR REPLACE INTO companies (
    id, name, domain, industry, headcount, location, annual_revenue,
    cloud_environment, tech_stack, compliance_mandates, engineering_growth_6m_pct,
    security_headcount, security_debt_ratio, estimated_acv, audit_countdown_days,
    audit_countdown_label, sales_battlecard, cyber_risk_score, risk_tier,
    buying_signals, target_buyer, rationale
  ) VALUES (
    'comp_010',
    'HyperCart QuickCommerce',
    'hypercart.app',
    'Quick Commerce / Food Delivery',
    190,
    'Sydney, Australia',
    '$31M',
    'GCP + Firebase',
    '["GCP","Firebase","Flutter","Node.js","Stripe"]',
    '["PCI-DSS Level 3","Privacy Act"]',
    20,
    0,
    34.2,
    '$38,000 / yr',
    45,
    'SOC 2 Type II Review in 45 Days',
    '{"primary_objection":"We don''t have dedicated security staff to manage another platform.","counter_hook":"That is precisely why engineering teams at your stage deploy us: 1-click automated evidence collection without developer friction.","recommended_angle":"Emphasize velocity protection."}',
    68,
    'TIER_2_MODERATE',
    '[{"type":"MOBILE_GEO_PRIVACY","severity":"MEDIUM","headline":"High-Volume Consumer Geolocation Tracking","description":"Sensitive real-time location database managed on Firebase without fine-grained IAM guardrails."}]',
    '{"title":"VP of Product & Engineering","pain_point":"Needs automated cloud security posture management to ensure mobile API keys aren''t exposed in client bundles."}',
    NULL
  );
INSERT OR REPLACE INTO companies (
    id, name, domain, industry, headcount, location, annual_revenue,
    cloud_environment, tech_stack, compliance_mandates, engineering_growth_6m_pct,
    security_headcount, security_debt_ratio, estimated_acv, audit_countdown_days,
    audit_countdown_label, sales_battlecard, cyber_risk_score, risk_tier,
    buying_signals, target_buyer, rationale
  ) VALUES (
    'comp_011',
    'Acme Local Bakery Chain',
    'acmebakery.com.au',
    'Food & Beverage (Local Retail)',
    45,
    'Adelaide, Australia',
    '$4.5M',
    'None (Square POS SaaS)',
    '["Square POS","WordPress","WooCommerce","Gmail"]',
    '["Basic PCI (handled by Square)"]',
    0,
    0,
    0,
    '$22,000 / yr',
    45,
    'SOC 2 Type II Review in 45 Days',
    '{"primary_objection":"We don''t have dedicated security staff to manage another platform.","counter_hook":"That is precisely why engineering teams at your stage deploy us: 1-click automated evidence collection without developer friction.","recommended_angle":"Emphasize velocity protection."}',
    12,
    'DISQUALIFIED',
    '[]',
    '{"title":"Owner / General Manager","pain_point":"Does not own software infrastructure; all security is handled by SaaS vendors (Square/Shopify). Non-ICP."}',
    NULL
  );
INSERT OR REPLACE INTO companies (
    id, name, domain, industry, headcount, location, annual_revenue,
    cloud_environment, tech_stack, compliance_mandates, engineering_growth_6m_pct,
    security_headcount, security_debt_ratio, estimated_acv, audit_countdown_days,
    audit_countdown_label, sales_battlecard, cyber_risk_score, risk_tier,
    buying_signals, target_buyer, rationale
  ) VALUES (
    'comp_012',
    'SecureBank Corporation',
    'securebankcorp.com',
    'Commercial Banking',
    14500,
    'Sydney, Australia',
    '$3.8B',
    'Private Cloud + Hybrid AWS',
    '["Mainframe","IBM WebSphere","AWS","Splunk","CrowdStrike","Palo Alto","CyberArk"]',
    '["APRA CPS 234","PCI-DSS Level 1","SOC 2 Type II","ISO 27001"]',
    4,
    120,
    2.2,
    '$54,000 / yr',
    45,
    'SOC 2 Type II Review in 45 Days',
    '{"primary_objection":"We don''t have dedicated security staff to manage another platform.","counter_hook":"That is precisely why engineering teams at your stage deploy us: 1-click automated evidence collection without developer friction.","recommended_angle":"Emphasize velocity protection."}',
    22,
    'DISQUALIFIED',
    '[]',
    '{"title":"Global Chief Information Security Officer","pain_point":"Massive 120+ person in-house cybersecurity division with deeply entrenched enterprise tooling contracts (CrowdStrike, Palo Alto). Too large and rigid for mid-market cybersecurity software."}',
    NULL
  );
INSERT OR REPLACE INTO companies (
    id, name, domain, industry, headcount, location, annual_revenue,
    cloud_environment, tech_stack, compliance_mandates, engineering_growth_6m_pct,
    security_headcount, security_debt_ratio, estimated_acv, audit_countdown_days,
    audit_countdown_label, sales_battlecard, cyber_risk_score, risk_tier,
    buying_signals, target_buyer, rationale
  ) VALUES (
    'comp_013',
    'Apex Cleaners & Maintenance',
    'apexcleaners.com.au',
    'Facilities & Cleaning Services',
    65,
    'Perth, Australia',
    '$7.2M',
    'None (Microsoft 365 Standard)',
    '["Microsoft 365","Xero","Wix"]',
    '["None"]',
    0,
    0,
    0,
    '$22,000 / yr',
    45,
    'SOC 2 Type II Review in 45 Days',
    '{"primary_objection":"We don''t have dedicated security staff to manage another platform.","counter_hook":"That is precisely why engineering teams at your stage deploy us: 1-click automated evidence collection without developer friction.","recommended_angle":"Emphasize velocity protection."}',
    8,
    'DISQUALIFIED',
    '[]',
    '{"title":"Managing Director","pain_point":"Zero proprietary software, zero cloud infrastructure, no compliance regulations. Out of ICP."}',
    NULL
  );
INSERT OR REPLACE INTO companies (
    id, name, domain, industry, headcount, location, annual_revenue,
    cloud_environment, tech_stack, compliance_mandates, engineering_growth_6m_pct,
    security_headcount, security_debt_ratio, estimated_acv, audit_countdown_days,
    audit_countdown_label, sales_battlecard, cyber_risk_score, risk_tier,
    buying_signals, target_buyer, rationale
  ) VALUES (
    'comp_014',
    'DataVault Legal Tech',
    'datavaultlegal.io',
    'LegalTech / E-Discovery SaaS',
    160,
    'Sydney, Australia',
    '$26M',
    'AWS (Sydney Region)',
    '["AWS","OpenSearch","Python","React","PostgreSQL","Docker"]',
    '["ISO 27001","SOC 2 Type II","Privacy Act"]',
    38,
    0,
    54.7,
    '$38,000 / yr',
    45,
    'SOC 2 Type II Review in 45 Days',
    '{"primary_objection":"We don''t have dedicated security staff to manage another platform.","counter_hook":"That is precisely why engineering teams at your stage deploy us: 1-click automated evidence collection without developer friction.","recommended_angle":"Emphasize velocity protection."}',
    93,
    'TIER_1_CRITICAL',
    '[{"type":"PRIVILEGED_DATA_SCRUTINY","severity":"CRITICAL","headline":"Storing Confidential Legal Litigation & M&A Data","description":"High-risk target for corporate espionage; Law firm clients demand ISO 27001 attestation and continuous penetration testing."},{"type":"ENGINEERING_SPIKE_NO_SEC","severity":"HIGH","headline":"Engineering Team Scaled by 38% with No SecOps","description":"Feature releases deployed twice weekly without automated static analysis (SAST) or container vulnerability checks."}]',
    '{"title":"Chief Technology Officer & Co-Founder","pain_point":"Needs automated cloud workload protection to satisfy rigorous law firm procurement security questionnaires."}',
    NULL
  );
INSERT OR REPLACE INTO companies (
    id, name, domain, industry, headcount, location, annual_revenue,
    cloud_environment, tech_stack, compliance_mandates, engineering_growth_6m_pct,
    security_headcount, security_debt_ratio, estimated_acv, audit_countdown_days,
    audit_countdown_label, sales_battlecard, cyber_risk_score, risk_tier,
    buying_signals, target_buyer, rationale
  ) VALUES (
    'comp_015',
    'GreenGrid Energy IoT',
    'greengrid.energy',
    'CleanTech / Smart Grid',
    220,
    'Melbourne, Australia',
    '$39M',
    'AWS + Industrial Scada IoT',
    '["AWS IoT Core","Go","TimescaleDB","React","Terraform"]',
    '["SOCI Act (Security of Critical Infrastructure)","ISO 27001"]',
    29,
    1,
    19.1,
    '$38,000 / yr',
    45,
    'SOC 2 Type II Review in 45 Days',
    '{"primary_objection":"We don''t have dedicated security staff to manage another platform.","counter_hook":"That is precisely why engineering teams at your stage deploy us: 1-click automated evidence collection without developer friction.","recommended_angle":"Emphasize velocity protection."}',
    96,
    'TIER_1_CRITICAL',
    '[{"type":"CRITICAL_INFRASTRUCTURE_REGULATION","severity":"CRITICAL","headline":"Covered by Australian Critical Infrastructure (SOCI) Mandate","description":"Federal government cyber security mandates require rigorous operational technology (OT) monitoring and incident reporting."},{"type":"SMART_METER_IOT_SURFACE","severity":"HIGH","headline":"50,000 Connected Solar & Battery Inverters","description":"Large fleet of distributed IoT endpoints connecting back to cloud telemetry backend."}]',
    '{"title":"Head of Engineering & Infrastructure","pain_point":"Needs continuous compliance auditing against SOCI Act requirements and IoT anomaly detection."}',
    NULL
  );
INSERT OR REPLACE INTO companies (
    id, name, domain, industry, headcount, location, annual_revenue,
    cloud_environment, tech_stack, compliance_mandates, engineering_growth_6m_pct,
    security_headcount, security_debt_ratio, estimated_acv, audit_countdown_days,
    audit_countdown_label, sales_battlecard, cyber_risk_score, risk_tier,
    buying_signals, target_buyer, rationale
  ) VALUES (
    'comp_016',
    'EduSphere LMS',
    'edusphere.co',
    'EdTech & Higher Ed SaaS',
    175,
    'Brisbane, Australia',
    '$24M',
    'AWS + Kubernetes',
    '["AWS","EKS","Node.js","MongoDB","Redis"]',
    '["FERPA","SOC 2 Type II","Privacy Act"]',
    14,
    0,
    22.1,
    '$38,000 / yr',
    45,
    'SOC 2 Type II Review in 45 Days',
    '{"primary_objection":"We don''t have dedicated security staff to manage another platform.","counter_hook":"That is precisely why engineering teams at your stage deploy us: 1-click automated evidence collection without developer friction.","recommended_angle":"Emphasize velocity protection."}',
    64,
    'TIER_2_MODERATE',
    '[{"type":"STUDENT_DATA_PRIVACY","severity":"MEDIUM","headline":"Managing 400,000 Student Records without In-House Security","description":"Universities demanding annual SOC 2 renewal and data residency verification."}]',
    '{"title":"VP of Technology","pain_point":"Needs hands-off, automated SOC 2 compliance monitoring without hiring a full security team."}',
    NULL
  );
INSERT OR REPLACE INTO companies (
    id, name, domain, industry, headcount, location, annual_revenue,
    cloud_environment, tech_stack, compliance_mandates, engineering_growth_6m_pct,
    security_headcount, security_debt_ratio, estimated_acv, audit_countdown_days,
    audit_countdown_label, sales_battlecard, cyber_risk_score, risk_tier,
    buying_signals, target_buyer, rationale
  ) VALUES (
    'comp_017',
    'VentureFlow CRM',
    'ventureflow.com',
    'Enterprise SaaS',
    90,
    'San Francisco, CA, USA',
    '$16M',
    'Google Cloud Platform (GCP)',
    '["GCP","Cloud Run","TypeScript","Next.js","PostgreSQL"]',
    '["SOC 2 Type II","GDPR"]',
    22,
    0,
    17.8,
    '$22,000 / yr',
    45,
    'SOC 2 Type II Review in 45 Days',
    '{"primary_objection":"We don''t have dedicated security staff to manage another platform.","counter_hook":"That is precisely why engineering teams at your stage deploy us: 1-click automated evidence collection without developer friction.","recommended_angle":"Emphasize velocity protection."}',
    86,
    'TIER_1_CRITICAL',
    '[{"type":"AI_DATA_INGESTION_RISK","severity":"HIGH","headline":"AI Features Processing Sensitive Corporate Email Metadata","description":"Passing executive email communications through third-party LLM endpoints without data loss prevention (DLP) guardrails."},{"type":"SOC_2_AUDIT_WINDOW","severity":"HIGH","headline":"SOC 2 Type II Annual Observation Period","description":"Audit period closes in 60 days; needs to demonstrate zero critical unpatched CVEs in production."}]',
    '{"title":"CTO & Co-Founder","pain_point":"Needs AI data privacy guardrails and automated CVE scanning across containerized microservices."}',
    NULL
  );
INSERT OR REPLACE INTO companies (
    id, name, domain, industry, headcount, location, annual_revenue,
    cloud_environment, tech_stack, compliance_mandates, engineering_growth_6m_pct,
    security_headcount, security_debt_ratio, estimated_acv, audit_countdown_days,
    audit_countdown_label, sales_battlecard, cyber_risk_score, risk_tier,
    buying_signals, target_buyer, rationale
  ) VALUES (
    'comp_018',
    'BioPharm Research Lab',
    'biopharmresearch.com.au',
    'Biotech & Clinical Trials',
    130,
    'Melbourne, Australia',
    '$27M',
    'AWS + High Performance Compute (HPC)',
    '["AWS","Slurm HPC","Python","Docker","S3 Data Lake"]',
    '["FDA 21 CFR Part 11","ISO 27001","TGA Regulations"]',
    19,
    0,
    22.2,
    '$38,000 / yr',
    45,
    'SOC 2 Type II Review in 45 Days',
    '{"primary_objection":"We don''t have dedicated security staff to manage another platform.","counter_hook":"That is precisely why engineering teams at your stage deploy us: 1-click automated evidence collection without developer friction.","recommended_angle":"Emphasize velocity protection."}',
    89,
    'TIER_1_CRITICAL',
    '[{"type":"IP_THEFT_TARGET","severity":"CRITICAL","headline":"Proprietary Pharmaceutical Formulation IP in Cloud Storage","description":"Millions of dollars in research data stored in AWS S3 buckets without automated data classification or leak detection."},{"type":"CLINICAL_REGULATION","severity":"HIGH","headline":"FDA / TGA Data Integrity Audit Compliance","description":"Strict regulatory requirement for immutable audit logs and tamper-proof access controls."}]',
    '{"title":"Head of Informatics & Infrastructure","pain_point":"Needs automated cloud data loss prevention (DLP) and immutable audit log enforcement."}',
    NULL
  );
INSERT OR REPLACE INTO companies (
    id, name, domain, industry, headcount, location, annual_revenue,
    cloud_environment, tech_stack, compliance_mandates, engineering_growth_6m_pct,
    security_headcount, security_debt_ratio, estimated_acv, audit_countdown_days,
    audit_countdown_label, sales_battlecard, cyber_risk_score, risk_tier,
    buying_signals, target_buyer, rationale
  ) VALUES (
    'comp_019',
    'UrbanBite Cloud Kitchens',
    'urbanbite.com.au',
    'FoodTech & Hospitality',
    115,
    'Sydney, Australia',
    '$18M',
    'AWS Lightsail & Heroku',
    '["Heroku","Node.js","PostgreSQL","Shopify"]',
    '["Basic PCI"]',
    5,
    0,
    5.2,
    '$38,000 / yr',
    45,
    'SOC 2 Type II Review in 45 Days',
    '{"primary_objection":"We don''t have dedicated security staff to manage another platform.","counter_hook":"That is precisely why engineering teams at your stage deploy us: 1-click automated evidence collection without developer friction.","recommended_angle":"Emphasize velocity protection."}',
    38,
    'TIER_3_LOW',
    '[{"type":"STATIC_FOOTPRINT","severity":"LOW","headline":"Simple Monolithic Cloud Footprint","description":"Relatively low cyber complexity and minimal attack surface beyond standard SaaS POS."}]',
    '{"title":"Head of IT","pain_point":"Standard endpoint protection suffices; low urgency for enterprise cyber software."}',
    NULL
  );
INSERT OR REPLACE INTO companies (
    id, name, domain, industry, headcount, location, annual_revenue,
    cloud_environment, tech_stack, compliance_mandates, engineering_growth_6m_pct,
    security_headcount, security_debt_ratio, estimated_acv, audit_countdown_days,
    audit_countdown_label, sales_battlecard, cyber_risk_score, risk_tier,
    buying_signals, target_buyer, rationale
  ) VALUES (
    'comp_020',
    'FleetTrack Telematics',
    'fleettrack.io',
    'Automotive IoT / Telematics',
    270,
    'Austin, TX, USA',
    '$51M',
    'AWS (Kinesis, ECS, DynamoDB)',
    '["AWS","Kinesis","Docker","Python","Go","Grafana"]',
    '["SOC 2 Type II","ISO 27001","DOT Compliance"]',
    31,
    1,
    25.1,
    '$54,000 / yr',
    45,
    'SOC 2 Type II Review in 45 Days',
    '{"primary_objection":"We don''t have dedicated security staff to manage another platform.","counter_hook":"That is precisely why engineering teams at your stage deploy us: 1-click automated evidence collection without developer friction.","recommended_angle":"Emphasize velocity protection."}',
    84,
    'TIER_1_CRITICAL',
    '[{"type":"MISSION_CRITICAL_TELEMATICS","severity":"HIGH","headline":"Real-Time Telemetry Stream for 45,000 Commercial Trucks","description":"High-throughput streaming ingestion susceptible to denial-of-service and man-in-the-middle tampering."},{"type":"RAPID_HARDWARE_FLEET_GROWTH","severity":"HIGH","headline":"Fast Fleet Scaling with Understaffed Security","description":"1 security engineer overseeing hundreds of thousands of active vehicle API connections."}]',
    '{"title":"VP of Engineering & Connected Vehicles","pain_point":"Needs real-time API threat intelligence and zero-trust authentication for in-vehicle firmware."}',
    NULL
  );

-- Telemetry Traces
INSERT OR REPLACE INTO telemetry_traces (
    id, timestamp, feature, model, prompt_version, input_tokens, output_tokens,
    latency_ms, cost_usd, company_name, decision_summary, cached
  ) VALUES (
    'tr_1790624669_canva',
    '2026-09-29T01:14:29.500Z',
    'outreach_generation',
    'openai/gpt-4o-mini',
    'v2',
    313,
    287,
    1566,
    0.000407,
    'Canva',
    'Drafted signal-grounded cold email & InMail targeting VP of Infrastructure regarding 38% engineering scaling with 0 dedicated SecOps.',
    0
  );
INSERT OR REPLACE INTO telemetry_traces (
    id, timestamp, feature, model, prompt_version, input_tokens, output_tokens,
    latency_ms, cost_usd, company_name, decision_summary, cached
  ) VALUES (
    'tr_1790625211_acme',
    '2026-09-29T01:23:31.200Z',
    'account_scoring',
    'openai/gpt-4o-mini',
    'v2',
    528,
    241,
    977,
    0.000224,
    'Acme Payments Inc',
    'Classified as TIER_1_CRITICAL (Score: 85) due to imminent 60-day SOC 2 audit deadline and 42% dev growth with 0 SecOps.',
    0
  );
INSERT OR REPLACE INTO telemetry_traces (
    id, timestamp, feature, model, prompt_version, input_tokens, output_tokens,
    latency_ms, cost_usd, company_name, decision_summary, cached
  ) VALUES (
    'tr_1790625290_canva_cache',
    '2026-09-29T01:25:40.100Z',
    'outreach_generation',
    'openai/gpt-4o-mini',
    'v2',
    0,
    0,
    0,
    0,
    'Canva',
    'Served cached outreach draft for executive_vp tone from in-memory cache.',
    1
  );
INSERT OR REPLACE INTO telemetry_traces (
    id, timestamp, feature, model, prompt_version, input_tokens, output_tokens,
    latency_ms, cost_usd, company_name, decision_summary, cached
  ) VALUES (
    'tr_1790624100_safetyculture',
    '2026-09-29T00:55:12.800Z',
    'account_scoring',
    'openai/gpt-4o-mini',
    'v2',
    385,
    165,
    890,
    0.000157,
    'SafetyCulture',
    'Classified as TIER_1_CRITICAL (Score: 88) due to global enterprise expansion and SOC 2 Type II / ISO 27001 compliance mandate.',
    0
  );
INSERT OR REPLACE INTO telemetry_traces (
    id, timestamp, feature, model, prompt_version, input_tokens, output_tokens,
    latency_ms, cost_usd, company_name, decision_summary, cached
  ) VALUES (
    'tr_1790623900_airwallex',
    '2026-09-29T00:48:44.200Z',
    'outreach_generation',
    'openai/gpt-4o-mini',
    'v2',
    340,
    210,
    1120,
    0.000177,
    'Airwallex',
    'Generated APRA CPS 234 regulatory angle targeting Head of Information Security.',
    0
  );
INSERT OR REPLACE INTO telemetry_traces (
    id, timestamp, feature, model, prompt_version, input_tokens, output_tokens,
    latency_ms, cost_usd, company_name, decision_summary, cached
  ) VALUES (
    'tr_1790630753117_egenk',
    '2026-09-28T21:25:53.117Z',
    'outreach_generation',
    'openai/gpt-4o-mini',
    'v2',
    445,
    196,
    1902,
    0.000184,
    'HyperCart QuickCommerce',
    'Generated sdr_direct outreach (1902ms, 641 tokens). Angle: Grounded copy',
    0
  );
INSERT OR REPLACE INTO telemetry_traces (
    id, timestamp, feature, model, prompt_version, input_tokens, output_tokens,
    latency_ms, cost_usd, company_name, decision_summary, cached
  ) VALUES (
    'tr_1790630758842_0ei04',
    '2026-09-28T21:25:58.842Z',
    'outreach_generation',
    'openai/gpt-4o-mini',
    'v2',
    453,
    196,
    916,
    0.000186,
    'HyperCart QuickCommerce',
    'Generated executive_vp outreach (916ms, 649 tokens). Angle: This outreach addresses the urgent compliance deadline and operational inefficiencies, positioning our solution as essential for maintaining both security and development momentum.',
    0
  );
INSERT OR REPLACE INTO telemetry_traces (
    id, timestamp, feature, model, prompt_version, input_tokens, output_tokens,
    latency_ms, cost_usd, company_name, decision_summary, cached
  ) VALUES (
    'tr_1790630788633_ylz46',
    '2026-09-28T21:26:28.634Z',
    'outreach_generation',
    'openai/gpt-4o-mini',
    'v2',
    376,
    600,
    1063,
    0.000416,
    'PayFlow Technologies',
    'Generated sdr_direct outreach (1063ms, 976 tokens). Angle: This angle addresses urgent compliance needs while highlighting the efficiency of automation, appealing to the VP of Engineering''s focus on developer velocity.',
    0
  );
INSERT OR REPLACE INTO telemetry_traces (
    id, timestamp, feature, model, prompt_version, input_tokens, output_tokens,
    latency_ms, cost_usd, company_name, decision_summary, cached
  ) VALUES (
    'tr_1790630938443_kq5i5',
    '2026-09-28T21:28:58.443Z',
    'outreach_generation',
    'openai/gpt-4o-mini',
    'v2',
    492,
    194,
    1084,
    0.00019,
    'PayFlow Technologies',
    'Generated executive_vp outreach (1084ms, 686 tokens). Angle: Grounded copy',
    0
  );
INSERT OR REPLACE INTO telemetry_traces (
    id, timestamp, feature, model, prompt_version, input_tokens, output_tokens,
    latency_ms, cost_usd, company_name, decision_summary, cached
  ) VALUES (
    'tr_1790630941956_sz3an',
    '2026-09-28T21:29:01.957Z',
    'outreach_generation',
    'openai/gpt-4o-mini',
    'v2',
    484,
    206,
    1521,
    0.000196,
    'PayFlow Technologies',
    'Generated sdr_direct outreach (1521ms, 690 tokens). Angle: Grounded copy',
    0
  );
INSERT OR REPLACE INTO telemetry_traces (
    id, timestamp, feature, model, prompt_version, input_tokens, output_tokens,
    latency_ms, cost_usd, company_name, decision_summary, cached
  ) VALUES (
    'tr_1790630943465_bu361',
    '2026-09-28T21:29:03.465Z',
    'outreach_generation',
    'openai/gpt-4o-mini',
    'v2',
    484,
    196,
    742,
    0.00019,
    'PayFlow Technologies',
    'Generated sdr_direct outreach (742ms, 680 tokens). Angle: This angle addresses the urgent need for security compliance without sacrificing developer speed, directly aligning with their current challenges.',
    0
  );
INSERT OR REPLACE INTO telemetry_traces (
    id, timestamp, feature, model, prompt_version, input_tokens, output_tokens,
    latency_ms, cost_usd, company_name, decision_summary, cached
  ) VALUES (
    'tr_1790631374612_z18v4',
    '2026-09-28T21:36:14.612Z',
    'outreach_generation',
    'openai/gpt-4o-mini',
    'v2',
    484,
    208,
    1075,
    0.000197,
    'PayFlow Technologies',
    'Generated sdr_direct outreach (1075ms, 692 tokens). Angle: This angle addresses the urgent compliance deadline and the need for efficient security solutions without increasing headcount, aligning directly with their current operational challenges.',
    0
  );
INSERT OR REPLACE INTO telemetry_traces (
    id, timestamp, feature, model, prompt_version, input_tokens, output_tokens,
    latency_ms, cost_usd, company_name, decision_summary, cached
  ) VALUES (
    'tr_1790631396047_8xbmf',
    '2026-09-28T21:36:36.047Z',
    'outreach_generation',
    'openai/gpt-4o-mini',
    'v2',
    492,
    600,
    1303,
    0.000434,
    'PayFlow Technologies',
    'Generated executive_vp outreach (1303ms, 1092 tokens). Angle: This outreach emphasizes urgent compliance needs and operational risks, aligning with the VP''s responsibility to balance growth and security.',
    0
  );
INSERT OR REPLACE INTO telemetry_traces (
    id, timestamp, feature, model, prompt_version, input_tokens, output_tokens,
    latency_ms, cost_usd, company_name, decision_summary, cached
  ) VALUES (
    'tr_1790631636492_kzz5k',
    '2026-09-28T21:40:36.492Z',
    'outreach_generation',
    'openai/gpt-4o-mini',
    'v2',
    442,
    600,
    920,
    0.000426,
    'AeroParts Global',
    'Generated sdr_direct outreach (920ms, 1042 tokens). Angle: This angle addresses the urgent need for compliance while highlighting the potential to enhance engineering productivity without increasing headcount.',
    0
  );
INSERT OR REPLACE INTO telemetry_traces (
    id, timestamp, feature, model, prompt_version, input_tokens, output_tokens,
    latency_ms, cost_usd, company_name, decision_summary, cached
  ) VALUES (
    'tr_1790632278143_tn6vv',
    '2026-09-28T21:51:18.143Z',
    'outreach_generation',
    'openai/gpt-4o-mini',
    'v2',
    358,
    600,
    1218,
    0.000414,
    'TestCorp AI',
    'Generated sdr_direct outreach (1218ms, 958 tokens). Angle: This angle addresses TestCorp AI''s urgent compliance needs while leveraging their existing growth without increasing operational costs.',
    0
  );
INSERT OR REPLACE INTO telemetry_traces (
    id, timestamp, feature, model, prompt_version, input_tokens, output_tokens,
    latency_ms, cost_usd, company_name, decision_summary, cached
  ) VALUES (
    'tr_1790632301050_ui92i',
    '2026-09-28T21:51:41.050Z',
    'outreach_generation',
    'openai/gpt-4o-mini',
    'v2',
    0,
    0,
    0,
    0,
    'TestCorp AI',
    'Served cached executive_vp outreach draft for TestCorp AI from client memory.',
    1
  );
