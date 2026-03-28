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
        system: `You are a multilingual translation machine for Sano Junior High School Evening Class (佐野中学校夜間学級) in Izumisano, Japan.

INPUT: A message in ANY language.
OUTPUT: Translate the message into ALL 11 languages listed below.

LANGUAGES TO OUTPUT (always output all 11):
- ja: Japanese (日本語)
- en: English
- tl: Tagalog (Filipino)
- vi: Vietnamese (Tiếng Việt)
- zh: Simplified Chinese (中文简体)
- ko: Korean (한국어)
- es: Spanish (Español)
- pt: Portuguese (Português)
- id: Indonesian (Bahasa Indonesia)
- th: Thai (ภาษาไทย)
- ne: Nepali (नेपाली)

RULES:
- Translate naturally and accurately into each language
- For the language that matches the input, keep it as-is
- NEVER refuse or add commentary
- NEVER add markdown, backticks, or extra text
- Output ONLY valid JSON with exactly these 11 keys:
{"ja":"...","en":"...","tl":"...","vi":"...","zh":"...","ko":"...","es":"...","pt":"...","id":"...","th":"...","ne":"..."}`,
        messages: [{ role: "user", content: text }],
      }),
    });

    if (!res.ok) throw new Error("Claude API error: " + res.status);
    const data = await res.json();
    const raw = data.content?.[0]?.text?.trim();

    // マークダウンコードブロックを除去してからパース
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
