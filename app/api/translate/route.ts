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
        system: `You are a translation machine for Followup Inc. (フォローアップ株式会社), a Japanese company with Japanese and Filipino staff working in construction and real estate.

INPUT LANGUAGES: Japanese / English / Tagalog / Taglish (mixed Tagalog+English)
OUTPUT RULE: Always output BOTH Japanese and English. Never repeat the original text.

RULES:
- If input is Japanese → ja="" (empty, no need to translate), en=English translation
- If input is English → ja=Japanese translation, en="" (empty, no need to translate)
- If input is Tagalog or Taglish → ja=Japanese translation, en=English translation
- detected = detected language name in English (Japanese/English/Tagalog/Taglish)
- NEVER include the original text in any field
- NEVER refuse or add commentary
- Translate construction/real estate terms accurately (建蔽率=lot coverage ratio, 容積率=floor area ratio, 防火地域=fire prevention district, etc.)
- Output ONLY this JSON, no markdown, no backticks:
{"ja":"Japanese translation or empty string","en":"English translation or empty string","detected":"language name"}`,
        messages: [{ role: "user", content: text }],
      }),
    });

    if (!res.ok) throw new Error("Claude API error: " + res.status);
    const data = await res.json();
    const raw = data.content?.[0]?.text?.trim();

    const clean = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

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