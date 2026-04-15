export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

const MODEL =
  process.env.ANTHROPIC_MODEL?.trim() || "claude-haiku-4-5-20251001";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string")
      return NextResponse.json({ error: "text required" }, { status: 400 });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey)
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: `You are a translation assistant for a Japanese construction company (ファースト住建).
Translate between Japanese (ja), Filipino/Taglish (tl), and Vietnamese (vi).

Return ONLY valid JSON with exactly these keys: ja, tl, vi, detected.
Shape: {"ja":"...","tl":"...","vi":"...","detected":"..."}

Rules:
- "detected": source language name in English (Japanese, Tagalog, Taglish, Vietnamese).
- For the key matching the source language, use "" (empty string).
- Every other key must contain a natural translation.
- No markdown, no code fences, no commentary. JSON only.`,
        messages: [{ role: "user", content: text }],
      }),
    });

    const rawBody = await res.text();
    if (!res.ok) {
      let detail = rawBody.slice(0, 900);
      try {
        const errJson = JSON.parse(rawBody) as { error?: { message?: string } };
        detail = errJson.error?.message || detail;
      } catch {
        /* keep detail */
      }
      return NextResponse.json(
        { error: `Claude API error ${res.status}: ${detail}` },
        { status: 502 }
      );
    }

    const apiData = JSON.parse(rawBody) as {
      content?: { type?: string; text?: string }[];
    };
    const raw = apiData.content?.[0]?.text?.trim();
    if (!raw)
      return NextResponse.json({ error: "Empty model response" }, { status: 502 });

    const clean = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    try {
      const parsed = JSON.parse(clean) as Record<string, string>;
      return NextResponse.json({ translations: parsed, original: text });
    } catch {
      return NextResponse.json(
        { error: "Could not parse translation JSON", translated: clean, original: text },
        { status: 502 }
      );
    }
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
