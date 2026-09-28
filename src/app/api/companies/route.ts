import { NextResponse } from "next/server";
import { initialCompanies } from "@/lib/mockData";
import { scoreCompanyHybrid } from "@/lib/scoring";
import { Company } from "@/lib/types";

let companiesList: Company[] = [...initialCompanies];

export async function GET() {
  return NextResponse.json({
    success: true,
    total: companiesList.length,
    companies: companiesList
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (Array.isArray(body)) {
      const newlyScored = body.map(c => scoreCompanyHybrid(c));
      companiesList = [...newlyScored, ...companiesList];
      return NextResponse.json({ success: true, count: newlyScored.length, companies: newlyScored });
    } else {
      const scored = scoreCompanyHybrid(body);
      companiesList.unshift(scored);
      return NextResponse.json({ success: true, company: scored });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to parse company data" }, { status: 400 });
  }
}
