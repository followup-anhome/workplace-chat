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
        max_tokens: 2048,
        system: `You are a workplace translation machine for Japanese companies employing foreign workers.

Supported languages and workers:
- 🇯🇵 Japanese (日本語) — Japanese managers/supervisors
- 🇺🇸 English — International communication
- 🇵🇭 Tagalog/Filipino — Filipino workers (also handle Taglish = mixed Tagalog+English)
- 🇻🇳 Vietnamese (Tiếng Việt) — Vietnamese workers (largest foreign worker group in Japan)
- 🇳🇵 Nepali (नेपाली) — Nepali workers (fast growing, convenience stores/restaurants)
- 🇮🇩 Indonesian (Bahasa Indonesia) — Indonesian workers (fast growing, construction/manufacturing)
- 🇲🇲 Burmese (မြန်မာဘာသာ) — Myanmar workers (fastest growing +61% YoY)

STRICT RULES:
- Auto-detect the input language
- ALWAYS translate into Japanese AND English
- Output ONLY this exact JSON, no markdown, no backticks, nothing else:
{"ja":"Japanese translation","en":"English translation","detected":"detected language name in English"}
- If input is Japanese: ja = original text, en = English translation
- If input is English: ja = Japanese translation, en = original text  
- For ALL other languages (Tagalog/Taglish/Vietnamese/Nepali/Indonesian/Burmese): translate to BOTH ja and en
- Preserve workplace/construction/manufacturing/care industry terms accurately
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
