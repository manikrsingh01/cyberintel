import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const apiKey = (body.apiKey || "").trim();

    if (!apiKey) {
      return NextResponse.json(
        { valid: false, error: "Please provide an API key." },
        { status: 400 }
      );
    }

    if (!apiKey.startsWith("sk-or-")) {
      return NextResponse.json(
        { 
          valid: false, 
          error: "Invalid format. OpenRouter API keys typically start with 'sk-or-v1-'." 
        },
        { status: 400 }
      );
    }

    // Call OpenRouter key verification endpoint
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/auth/key", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://cyberintel.pages.dev",
          "X-Title": "CyberIntel Sales Platform",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 200) {
        const json = await response.json();
        return NextResponse.json({
          valid: true,
          label: json.data?.label || "OpenRouter Key",
          usage: json.data?.usage || 0,
          limit: json.data?.limit,
          is_free_tier: json.data?.is_free_tier ?? false,
        });
      }

      if (response.status === 401) {
        return NextResponse.json(
          { valid: false, error: "API key is not working. The key was rejected by OpenRouter (Invalid Credentials)." },
          { status: 401 }
        );
      }

      if (response.status === 402) {
        return NextResponse.json(
          { valid: false, error: "OpenRouter account has insufficient credits or credit limit reached." },
          { status: 402 }
        );
      }

      return NextResponse.json(
        { valid: false, error: `OpenRouter returned status ${response.status}. Key verification failed.` },
        { status: 400 }
      );
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") {
        return NextResponse.json(
          { valid: false, error: "Verification timed out reaching OpenRouter. Please try again." },
          { status: 504 }
        );
      }
      return NextResponse.json(
        { valid: false, error: err?.message || "Failed connecting to OpenRouter authentication service." },
        { status: 500 }
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      { valid: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
