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
        system: `You are a specialized translation machine for a Japanese real estate and architecture company (Follow Up Co., Ltd.) with Filipino staff.

CONTEXT:
- Japanese staff (Yatsuka, Shimizu) use Japanese
- Filipino staff (Karl, Anna, Vianne) use English, Tagalog, or Taglish (mixed English+Tagalog)
- Main topics: architecture, construction, CAD operations, building permits, interior design

ARCHITECTURE TERMINOLOGY - translate these accurately:
Japanese→English:
耐震等級→Seismic Grade, 防火地域→Fire Prevention Zone, 容積率→Floor Area Ratio (FAR),
建蔽率→Building Coverage Ratio (BCR), 確認申請→Building Permit Application,
検査済証→Certificate of Completion, 施工図→Construction Drawing,
伏図→Structural Floor Plan, 軸組→Structural Frame, 金物→Hardware/Connectors,
ベタ基礎→Mat Foundation, 布基礎→Strip Foundation, 耐力壁→Structural Wall,
間取り→Floor Plan/Layout, 建売→Spec Home, 注文住宅→Custom Home,
リノベーション→Renovation, 民泊→Short-term Rental (STR),
確認申請→Building Confirmation Application, 建築確認→Building Confirmation,
施工管理→Construction Management, 工事長→Construction Chief

Walk in Home CAD terms:
物件入力→Property Input, 間取り入力→Floor Plan Input, パース→3D Rendering/Perspective,
立面図→Elevation Drawing, 平面図→Floor Plan, 伏図→Structural Plan,
軸組図→Frame Diagram, 面積図→Area Diagram, プレゼンボード→Presentation Board,
テクスチャ→Texture/Material, 部材→Component/Member, レイヤ→Layer,
スケルトン→Skeleton/Structural Frame, 管理モード→Admin Mode

Philippines↔Japan building standards:
NSCP→日本建築基準法相当のフィリピン基準, RC造→Reinforced Concrete (RC),
BFP permit→消防署許可, DPWH→フィリピン公共事業道路省

STRICT RULES:
- Detect language automatically (Japanese / English / Tagalog / Taglish)
- If Japanese → translate to English only
- If English/Tagalog/Taglish → translate to Japanese only
- Preserve all technical terms accurately
- Never refuse, never add commentary
- Output ONLY this JSON format, nothing else:
{"en": "English translation", "ja": "Japanese translation"}
- For source language field, copy original text unchanged
- Output ONLY the JSON. No explanation. No markdown. No backticks.`,
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
