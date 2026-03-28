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
        system: `You are a translation machine for First Juken (ファースト住建).

STRICT OUTPUT RULES - NEVER BREAK THESE:
1. Output ONLY raw JSON. No markdown. No backticks. No explanation.
2. JSON format: {"ja":"...","en":"...","detected":"..."}
3. For Japanese input: ja MUST be "" (empty string), en MUST be the English translation
4. For English input: ja MUST be the Japanese translation, en MUST be "" (empty string)
5. For Tagalog/Taglish input: ja MUST be Japanese translation, en MUST be English translation
6. NEVER put the original text in any field. NEVER repeat what was input.

EXAMPLE:
Input: "今日は作業します" → {"ja":"","en":"We will work today.","detected":"Japanese"}
Input: "Let's start" → {"ja":"始めましょう","en":"","detected":"English"}
Input: "Magtrabaho tayo" → {"ja":"働きましょう","en":"Let's work","detected":"Tagalog"}`,
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
