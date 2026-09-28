import { NextResponse } from "next/server";
import { getTraces } from "@/lib/telemetry";

export const runtime = 'edge';

export async function GET() {
  const traces = getTraces();
  return NextResponse.json({
    success: true,
    total: traces.length,
    traces
  });
}
