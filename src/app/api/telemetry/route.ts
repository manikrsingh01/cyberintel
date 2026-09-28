import { NextRequest, NextResponse } from "next/server";
import { getTraces, getTelemetryStats, logTrace } from "@/lib/telemetry";
import { getD1, getTracesFromD1, saveTraceToD1 } from "@/lib/db";
import { TelemetryTrace } from "@/lib/types";

export const runtime = 'edge';

export async function GET() {
  try {
    const db = getD1();
    if (db) {
      const d1Traces = await getTracesFromD1(db, 100);
      if (d1Traces && d1Traces.length > 0) {
        const totalCalls = d1Traces.length;
        const liveCalls = d1Traces.filter((t) => !t.cached).length;
        const cachedCalls = d1Traces.filter((t) => t.cached).length;
        const totalTokens = d1Traces.reduce(
          (acc, t) => acc + ((t.input_tokens || 0) + (t.output_tokens || 0)),
          0
        );
        const totalCost = Number(
          d1Traces.reduce((acc, t) => acc + (t.cost_usd || 0), 0).toFixed(6)
        );
        const avgLatencyMs =
          liveCalls > 0
            ? Math.round(
                d1Traces
                  .filter((t) => !t.cached)
                  .reduce((acc, t) => acc + (t.latency_ms || 0), 0) / liveCalls
              )
            : 0;

        return NextResponse.json({
          source: "d1",
          traces: d1Traces,
          stats: {
            totalCalls,
            liveCalls,
            cachedCalls,
            totalTokens,
            totalCost,
            avgLatencyMs,
          },
        });
      }
    }

    // Fallback to in-memory / local storage
    const traces = getTraces();
    const stats = getTelemetryStats();

    return NextResponse.json({
      source: "memory",
      traces,
      stats,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch telemetry" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { trace } = body;
    if (!trace) {
      return NextResponse.json({ error: "Missing trace payload" }, { status: 400 });
    }

    // Log to local memory / disk fallback
    const recorded = logTrace(trace);

    // Save directly to Cloudflare D1 if running on Edge
    const db = getD1();
    if (db) {
      await saveTraceToD1(db, recorded);
    }

    return NextResponse.json({ success: true, trace: recorded, storedInD1: !!db });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to record telemetry trace" },
      { status: 500 }
    );
  }
}
