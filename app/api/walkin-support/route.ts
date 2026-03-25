export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

const MANUAL_KNOWLEDGE = `
=== Walk in Home 2020 操作マニュアル（物件管理編）===

1. 物件管理の起動・ログイン
- 初回起動時：データベースを「作成」ボタンで新規作成
- ログイン：ユーザーIDとパスワードを入力
- パスワード忘れ：システム管理者に連絡（管理者は全ユーザーのパスワードを確認可能）
- DBファイル名：BukkenManageDB.sqlite3

2. 物件管理画面の構成
- メニュータブ：各種機能の実行
- 担当者/顧客：担当者・顧客一覧
- 顧客情報：選択された顧客の詳細
- 物件一覧：顧客に紐付いた物件一覧
- 物件情報/ファイル：物件の詳細と関連ファイル

3. 顧客管理
- 新規登録：ホームメニュー→顧客→新規
- 編集・参照・削除が可能
- 顧客削除：関連する物件データを先に削除する必要あり
- グループ機能：顧客を分類・整理できる

4. 物件管理
- 新規作成：顧客選択後に有効
- 物件を開くとロック状態になる（他担当者は開けない）
- 削除した物件は「削除物件」から復元可能（完全削除は不可逆）
- バックアップ：ファイルメニュー→ツール→バックアップ

5. 便利機能
- オートリカバリー：異常終了時に前回の状態を自動復元
- Webパック：物件データをZIPで出力
- 物件検索：担当者・顧客・物件情報で絞り込み

=== Walk in Home 基本操作（CAD編）===

1. 基本ワークフロー
Step1: 物件管理で物件を新規作成
Step2: CAD画面で間取り入力（壁・建具・階段など）
Step3: 平面図・立面図・パースが自動生成
Step4: テクスチャ・素材を適用して3Dパース完成
Step5: プレゼンボードにレイアウトして出力

2. 間取り入力
- 壁入力：左欄から壁ツールを選択してクリックで配置
- 建具（ドア・窓）：左欄から選択して壁に配置
- 階段・吹き抜け：専用ツールで入力
- 寸法：リアルタイムで確認しながら入力可能

3. 自動生成図面
- 平面図・立面図（東西南北）
- 構造伏図（基礎・土台・床・梁・小屋）
- 面積図・軸組図
- 確認申請関連図書も出力可能

4. 3Dパース・テクスチャ
- 部材・素材：15,000点以上
- ドラッグ&ドロップで素材変更
- VR出力（オプション）：ヘッドマウントディスプレイ対応

5. 出力形式
- DXF・JWW・BMP・WMF・EPXなど
- プレゼンボード：自由レイアウトで印刷

6. 管理モード
- Ctrl+Shift+F10で管理モード切替
- スケルトン設定：構造上変更不可の壁・柱を設定
- 営業担当者がプレゼン中に構造壁を誤って削除防止

=== 日本の建築基準（フィリピン比較）===

耐震等級3（Seismic Grade 3）
- 日本最高レベルの耐震性能
- 一建設（Ichikensetu）の標準仕様
- フィリピンNSCP Zone 4相当以上

確認申請（Building Permit Application）
- 着工前に市区町村に提出必須
- Walk in Homeで確認申請図書を自動生成
- フィリピンのBuilding Permit申請と類似

建蔽率/容積率（BCR/FAR）
- 建蔽率：敷地面積に対する建築面積の割合
- 容積率：敷地面積に対する延床面積の割合
- Walk in Homeで自動チェック機能あり

木造軸組工法（Wooden Frame Construction）
- 日本の伝統的工法
- フィリピンのRC造とは異なる
- 柱・梁・土台・筋交いで構成
- Walk in Homeは木造に特化した設計

ベタ基礎（Mat Foundation）vs 布基礎（Strip Foundation）
- ベタ基礎：床全面をコンクリートで覆う（現代の主流）
- 布基礎：壁・柱の下のみ基礎
- 一建設はベタ基礎が標準
`;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message) return NextResponse.json({ error: "message required" }, { status: 400 });

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
        max_tokens: 1200,
        system: `You are a Walk in Home CAD support assistant for Karl, a Filipino architect joining Follow Up Co., Ltd. in Japan in June 2026.

Use the following official Walk in Home manual knowledge to answer questions accurately:

${MANUAL_KNOWLEDGE}

Karl's background:
- Philippine architecture graduate (familiar with AutoCAD, SketchUp, Revit)
- Familiar with Philippine building standards (NSCP, DPWH, RC construction)
- Learning Japanese building standards and Walk in Home CAD

RESPONSE RULES:
- Always respond in BOTH English and Japanese
- English first, then Japanese
- Base answers on the manual knowledge above when relevant
- Compare to Philippine standards when helpful
- Give step-by-step instructions for CAD operations
- Be encouraging and patient
- Keep answers practical and clear

Format:
🇺🇸 [English answer - detailed and friendly]

🇯🇵 [Japanese translation of the same answer]`,
        messages: [{ role: "user", content: message }],
      }),
    });

    if (!res.ok) throw new Error("API error: " + res.status);
    const data = await res.json();
    const reply = data.content?.[0]?.text?.trim();
    return NextResponse.json({ reply });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
