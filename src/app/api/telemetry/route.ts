import { NextRequest, NextResponse } from "next/server";
import { getTraces, getTelemetryStats, logTrace } from "@/lib/telemetry";

export async function GET() {
  try {
    const traces = getTraces();
    const stats = getTelemetryStats();

    return NextResponse.json({
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

    const recorded = logTrace(trace);
    return NextResponse.json({ success: true, trace: recorded });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to record telemetry trace" },
      { status: 500 }
    );
  }
}
