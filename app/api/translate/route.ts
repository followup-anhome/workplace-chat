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
        max_tokens: 3000,
        system: `You are a translation machine for a Japanese school with students from many countries.

Translate the input text into ALL of the following languages simultaneously:
- ja: Japanese（日本語）
- en: English
- tl: Tagalog/Filipino
- vi: Vietnamese（Tiếng Việt）
- ne: Nepali（नेपाली）
- id: Indonesian（Bahasa Indonesia）
- my: Burmese（မြန်မာဘာသာ）
- zh: Chinese Simplified（中文）
- hi: Hindi（हिन्दी）
- ur: Urdu（اردو）
- de: German（Deutsch）

STRICT RULES:
- Detect the source language automatically
- Translate into ALL 11 languages listed above
- For the source language field, copy the original text unchanged
- Output ONLY this exact JSON format, nothing else, no markdown, no backticks:
{"ja":"...","en":"...","tl":"...","vi":"...","ne":"...","id":"...","my":"...","zh":"...","hi":"...","ur":"...","de":"...","detected":"language code of source"}
- NEVER refuse, NEVER add commentary`,
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
