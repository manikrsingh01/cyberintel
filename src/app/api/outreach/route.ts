import { NextResponse } from "next/server";
import { generateOutreach } from "@/lib/scoring";
import { Company } from "@/lib/types";

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { company, tone } = await req.json();
    const draft = generateOutreach(company as Company, tone || "sdr_direct");
    return NextResponse.json({ success: true, draft });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Outreach generation failed" }, { status: 400 });
  }
}
