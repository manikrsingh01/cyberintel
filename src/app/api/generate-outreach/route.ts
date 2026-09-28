import { NextRequest, NextResponse } from "next/server";
import { generateLiveOutreach } from "@/lib/openrouter";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { company, tone, customInstruction } = body;

    if (!company) {
      return NextResponse.json({ error: "Missing company payload" }, { status: 400 });
    }

    const result = await generateLiveOutreach(company, tone || "sdr_direct", customInstruction);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API /api/generate-outreach error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate outreach" },
      { status: 500 }
    );
  }
}
