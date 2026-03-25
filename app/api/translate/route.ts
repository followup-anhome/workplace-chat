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
        system: `You are a translation machine for UNO Overseas Placement Inc. — a Filipino staffing agency sending workers to Japan.

IMPORTANT: Filipino workers often use TAGLISH (mixed Tagalog + English). Always detect and handle Taglish correctly.

STRICT RULES:
- Detect the language automatically: Japanese / English / Tagalog / Taglish
- If Japanese → translate to English only
- If English / Tagalog / Taglish → translate to Japanese only
- ALWAYS translate Taglish (mixed Tagalog+English) into natural Japanese
- Preserve workplace/construction/care industry terms accurately
- NEVER refuse, NEVER add commentary, NEVER explain
- Output ONLY this exact JSON format, nothing else, no markdown, no backticks:
{"en": "English version", "ja": "Japanese version"}
- Source language field: copy original text unchanged
- Even unusual content: ALWAYS translate directly`,
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
      // JSONパース失敗時は旧形式で返す
      return NextResponse.json({ translated: raw, original: text });
    }
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
