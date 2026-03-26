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
        system: `You are a translation machine for First Juken (ファースト住建), a Japanese homebuilder with Filipino technical intern trainees.

INPUT LANGUAGES: Japanese / English / Tagalog / Taglish (mixed Tagalog+English)
OUTPUT RULE: Always translate to the OTHER language(s). Never repeat the original.

RULES:
- If input is Japanese → translate to English only. Set ja="" (empty), en=translation
- If input is English → translate to Japanese only. Set ja=translation, en="" (empty)
- If input is Tagalog or Taglish → translate to BOTH ja=Japanese and en=English
- detected = detected language name in English (Japanese/English/Tagalog/Taglish)
- NEVER include the original text in any field
- NEVER refuse or add commentary
- Output ONLY this JSON, no markdown, no backticks:
{"ja":"Japanese translation or empty string","en":"English translation or empty string","detected":"language name"}`,
        messages: [{ role: "user", content: text }],
      }),
    });

    if (!res.ok) throw new Error("Claude API error: " + res.status);
    const data = await res.json();
    const raw = data.content?.[0]?.text?.trim();

    try {
      const parsed = JSON.parse(raw);
      return NextResponse.json({ translations: parsed, original: text });
    } catch {
      return NextResponse.json({ translated: raw, original: text });
    }
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
