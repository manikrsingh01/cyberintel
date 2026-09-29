import { NextResponse } from "next/server";
import { initialCompanies } from "@/lib/mockData";
import { scoreCompanyHybrid } from "@/lib/scoring";
import { Company } from "@/lib/types";
import { getD1, getCompaniesFromD1, getCompanyStatsFromD1 } from "@/lib/db";

export const runtime = 'edge';

let inMemoryCompanies: Company[] = [...initialCompanies];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "1000", 10), 1000);
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const offset = (page - 1) * limit;

    const db = getD1();
    if (db) {
      const [d1Companies, stats] = await Promise.all([
        getCompaniesFromD1(db, limit, offset),
        getCompanyStatsFromD1(db),
      ]);

      if (d1Companies && d1Companies.length > 0) {
        return NextResponse.json({
          success: true,
          source: "d1",
          total: stats.total || d1Companies.length,
          page,
          limit,
          totalPages: Math.ceil((stats.total || d1Companies.length) / limit),
          counts: stats,
          companies: d1Companies,
        });
      }
    }

    return NextResponse.json({
      success: true,
      source: "memory",
      total: inMemoryCompanies.length,
      page: 1,
      limit: inMemoryCompanies.length,
      totalPages: 1,
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
