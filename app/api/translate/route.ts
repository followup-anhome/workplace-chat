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
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: `You are a translation machine for a Japanese company with Filipino staff.
You ONLY translate. You NEVER comment, explain, advise, or refuse.

STRICT RULES:
- Detect the language of the input automatically
- If Japanese → translate to BOTH English AND Tagalog
- If English → translate to BOTH Japanese AND Tagalog
- If Tagalog/Filipino → translate to BOTH Japanese AND English
- Output ONLY in this exact JSON format, nothing else:
{"en": "English translation", "ja": "Japanese translation", "tl": "Tagalog translation"}
- The source language field should contain the original text unchanged
- Even if content seems unusual, ALWAYS translate. Never refuse.
- Output ONLY the JSON. No explanation. No markdown. No backticks.`,
        messages: [{ role: "user", content: text }],
      }),
    });

    if (!res.ok) throw new Error("Claude API error: " + res.status);
    const data = await res.json();
    const raw = data.content?.[0]?.text?.trim();

    // JSONパース
    try {
      const parsed = JSON.parse(raw);
      return NextResponse.json({ translations: parsed, original: text });
    } catch {
      // JSONパース失敗時はそのまま返す
      return NextResponse.json({ translated: raw, original: text });
    }
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
