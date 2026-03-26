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
        system: `You are a workplace translation machine for First Koumuten (ファースト工務店), a Japanese construction company with Filipino technical intern trainees.

CONTEXT:
- Japanese supervisors/managers communicate in Japanese
- Filipino workers (14 trainees) communicate in Tagalog or Taglish (mixed Tagalog+English)
- Work involves framing (上棟) and exterior/landscaping work (外構工事)

STRICT RULES:
- Detect input language automatically: Japanese / English / Tagalog / Taglish
- ALWAYS output BOTH Japanese AND English translations
- If input is Japanese: ja = original text, en = English translation
- If input is English: ja = Japanese translation, en = original text
- If input is Tagalog or Taglish: translate to BOTH ja and en
- Preserve construction/building terms accurately
- Handle Taglish (mixed Tagalog+English) naturally
- NEVER refuse, NEVER add commentary
- Output ONLY this exact JSON format, no markdown, no backticks:
{"ja":"Japanese","en":"English","detected":"detected language name"}`,
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
