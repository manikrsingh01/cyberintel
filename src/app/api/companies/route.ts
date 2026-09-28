import { NextResponse } from "next/server";
import { initialCompanies } from "@/lib/mockData";
import { scoreCompanyHybrid } from "@/lib/scoring";
import { Company } from "@/lib/types";
import { getD1, getCompaniesFromD1 } from "@/lib/db";

export const runtime = 'edge';

let inMemoryCompanies: Company[] = [...initialCompanies];

export async function GET() {
  try {
    const db = getD1();
    if (db) {
      const d1Companies = await getCompaniesFromD1(db);
      if (d1Companies && d1Companies.length > 0) {
        return NextResponse.json({
          success: true,
          source: "d1",
          total: d1Companies.length,
          companies: d1Companies,
        });
      }
    }

    return NextResponse.json({
      success: true,
      source: "memory",
      total: inMemoryCompanies.length,
      companies: inMemoryCompanies,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      source: "fallback",
      total: inMemoryCompanies.length,
      companies: inMemoryCompanies,
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (Array.isArray(body)) {
      const newlyScored = body.map((c) => scoreCompanyHybrid(c));
      inMemoryCompanies = [...newlyScored, ...inMemoryCompanies];
      return NextResponse.json({
        success: true,
        count: newlyScored.length,
        companies: newlyScored,
      });
    } else {
      const scored = scoreCompanyHybrid(body);
      inMemoryCompanies.unshift(scored);
      return NextResponse.json({ success: true, company: scored });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to parse company data" },
      { status: 400 }
    );
  }
}
