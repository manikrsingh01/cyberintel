import { TelemetryTrace } from "./types";

// In-memory ring buffer for client-side live trace inspection
let tracesStore: TelemetryTrace[] = [
  {
    id: "tr_init_001",
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    feature: "account_scoring",
    model: "gpt-4o-mini",
    prompt_version: "v2",
    input_tokens: 390,
    output_tokens: 165,
    latency_ms: 312,
    cost_usd: 0.000157,
    company_name: "PayFlow Technologies",
    decision_summary: "Tier 1 Critical (Score 94). Flagged APRA CPS 234 audit & 42% eng growth with 0 security staff.",
    cached: false
  },
  {
    id: "tr_init_002",
    timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    feature: "outreach_generation",
    model: "gpt-4o-mini",
    prompt_version: "v2",
    input_tokens: 410,
    output_tokens: 180,
    latency_ms: 345,
    cost_usd: 0.000169,
    company_name: "Nexus Health AI",
    decision_summary: "Drafted clinical EHR compliance pitch to CTO targeting hospital procurement audit.",
    cached: false
  },
  {
    id: "tr_init_003",
    timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    feature: "account_scoring",
    model: "gpt-4o-mini",
    prompt_version: "v2",
    input_tokens: 385,
    output_tokens: 140,
    latency_ms: 288,
    cost_usd: 0.000141,
    company_name: "Acme Local Bakery Chain",
    decision_summary: "Disqualified (Score 12). Zero proprietary code or cloud exposure detected.",
    cached: true
  }
];

export function logTrace(trace: Omit<TelemetryTrace, "id" | "timestamp">): TelemetryTrace {
  const newTrace: TelemetryTrace = {
    id: `tr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    ...trace
  };

  tracesStore.unshift(newTrace);
  if (tracesStore.length > 200) {
    tracesStore.pop();
  }

  // Attempt to append to data/traces.jsonl on server side
  try {
    if (typeof window === "undefined") {
      const fs = require("fs");
      const path = require("path");
      const logFile = path.join(process.cwd(), "data", "traces.jsonl");
      fs.appendFileSync(logFile, JSON.stringify(newTrace) + "\n", "utf8");
    }
  } catch (err) {
    // Non-fatal if fs unavailable in certain edge contexts
  }

  return newTrace;
}

export function getTraces(): TelemetryTrace[] {
  // Read persistent traces from data/traces.jsonl if on server
  try {
    if (typeof window === "undefined") {
      const fs = require("fs");
      const path = require("path");
      const logFile = path.join(process.cwd(), "data", "traces.jsonl");
      if (fs.existsSync(logFile)) {
        const content = fs.readFileSync(logFile, "utf8");
        const lines = content.split("\n").filter((l: string) => l.trim().length > 0);
        const diskTraces: TelemetryTrace[] = [];
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed && parsed.id) {
              diskTraces.push(parsed);
            }
          } catch {
            // Ignore malformed line
          }
        }
        if (diskTraces.length > 0) {
          // Return disk traces in reverse chronological order (newest first)
          return diskTraces.reverse();
        }
      }
    }
  } catch (err) {
    console.warn("Could not read traces from disk, falling back to memory:", err);
  }

  return [...tracesStore];
}

export function getTelemetryStats() {
  const allTraces = getTraces();
  const totalCalls = allTraces.length;
  const liveCalls = allTraces.filter(t => !t.cached).length;
  const cachedCalls = allTraces.filter(t => t.cached).length;
  const totalTokens = allTraces.reduce((acc, t) => acc + ((t.input_tokens || 0) + (t.output_tokens || 0)), 0);
  const totalCost = allTraces.reduce((acc, t) => acc + (t.cost_usd || 0), 0);
  const avgLatency = liveCalls > 0
    ? Math.round(allTraces.filter(t => !t.cached).reduce((acc, t) => acc + (t.latency_ms || 0), 0) / liveCalls)
    : 0;

  return {
    totalCalls,
    liveCalls,
    cachedCalls,
    totalTokens,
    totalCost: Number(totalCost.toFixed(6)),
    avgLatencyMs: avgLatency,
  };
}

export function calculateCost(tokensIn: number, tokensOut: number, model: string = "gpt-4o-mini"): number {
  // Pricing: gpt-4o-mini = $0.15/1M input, $0.60/1M output
  const costIn = (tokensIn / 1_000_000) * 0.15;
  const costOut = (tokensOut / 1_000_000) * 0.60;
  return Number((costIn + costOut).toFixed(6));
}

