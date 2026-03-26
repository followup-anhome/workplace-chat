export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: "text required" }, { status: 400 });
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "API key not configured" }, { status: 500 });

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: `You are a community translation machine for Filipino residents in Japan.
INPUT: Japanese / English / Tagalog / Taglish
RULES:
- If input is Japanese → en=English translation, ja="" (empty)
- If input is English → ja=Japanese translation, en="" (empty)  
- If input is Tagalog or Taglish → ja=Japanese, en=English (both)
- NEVER repeat the original text in any field
- Output ONLY this JSON, no markdown, no backticks:
{"ja":"Japanese or empty","en":"English or empty","detected":"language name"}`,
        messages: [{ role: "user", content: text }],
      }),
    });

    if (!res.ok) throw new Error("Claude API error: " + res.status);
    const data = await res.json();
    const raw = data.content?.[0]?.text?.trim() || "";
    const clean = raw.replace(/^```json\s*/i,"").replace(/^```\s*/i,"").replace(/\s*```$/i,"").trim();
    try {
      const parsed = JSON.parse(clean);
      return NextResponse.json({ translations: parsed, original: text });
    } catch {
      return NextResponse.json({ translated: clean, original: text });
    }
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
