export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, mode } = await req.json();
    if (!text) return NextResponse.json({ error: "text required" }, { status: 400 });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "API key not configured" }, { status: 500 });

    const src = mode === "jp" ? "Japanese" : "English";
    const dst = mode === "jp" ? "English" : "Japanese";

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 512,
        system: `You are a translation machine. Your ONLY job is to translate text from ${src} to ${dst}. Output ONLY the translated text. Do NOT add any explanation, advice, commentary, or additional sentences. Just translate and output nothing else.`,
        messages: [{ role: "user", content: text }],
      }),
    });

    if (!res.ok) throw new Error("Claude API error: " + res.status);
    const data = await res.json();
    const translated = data.content?.[0]?.text?.trim();
    return NextResponse.json({ translated });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
