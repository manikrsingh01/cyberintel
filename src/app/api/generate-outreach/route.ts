import { NextRequest, NextResponse } from "next/server";
import { generateLiveOutreach } from "@/lib/openrouter";

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { company, tone, customInstruction, apiKey: bodyKey } = body;
    const customApiKey = req.headers.get("x-openrouter-key") || bodyKey;

    if (!company) {
      return NextResponse.json({ error: "Missing company payload" }, { status: 400 });
    }

    const result = await generateLiveOutreach(company, tone || "sdr_direct", customInstruction, customApiKey);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API /api/generate-outreach error:", error);
    return NextResponse.json(
      { 
        error: error?.message || "Failed to generate outreach",
        quotaExceeded: error?.message?.includes("quota") || error?.message?.includes("credit") || error?.message?.includes("402")
      },
      { status: 500 }
    );
  }
}
