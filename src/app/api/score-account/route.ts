import { NextRequest, NextResponse } from "next/server";
import { scoreLiveAccount } from "@/lib/openrouter";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { company } = body;

    if (!company) {
      return NextResponse.json({ error: "Missing company payload" }, { status: 400 });
    }

    const result = await scoreLiveAccount(company);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API /api/score-account error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to score account" },
      { status: 500 }
    );
  }
}
