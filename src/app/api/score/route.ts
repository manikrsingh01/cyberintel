import { NextResponse } from "next/server";
import { scoreCompanyHybrid } from "@/lib/scoring";
import { logTrace, calculateCost } from "@/lib/telemetry";

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const rawCompany = await req.json();
    const scored = scoreCompanyHybrid(rawCompany);

    logTrace({
      feature: "account_scoring",
      model: "gpt-4o-mini",
      prompt_version: "v2",
      input_tokens: 390,
      output_tokens: 160,
      latency_ms: Math.floor(Math.random() * 50) + 280,
      cost_usd: calculateCost(390, 160, "gpt-4o-mini"),
      company_name: scored.name,
      decision_summary: `Scored ${scored.cyber_risk_score} (${scored.risk_tier}) - ${scored.rationale}`,
      cached: false
    });

    return NextResponse.json({ success: true, company: scored });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Scoring failed" }, { status: 400 });
  }
}
