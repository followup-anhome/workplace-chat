"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export const LANGUAGES = [
  { code: "ja", label: "日本語",       flag: "🇯🇵", name: "日本" },
  { code: "tl", label: "Tagalog",      flag: "🇵🇭", name: "Philippines" },
  { code: "vi", label: "Tiếng Việt",   flag: "🇻🇳", name: "Việt Nam" },
  { code: "ne", label: "नेपाली",        flag: "🇳🇵", name: "Nepal" },
  { code: "zh", label: "中文",          flag: "🇨🇳", name: "中国" },
  { code: "hi", label: "हिन्दी",         flag: "🇮🇳", name: "India" },
  { code: "ur", label: "اردو",          flag: "🇵🇰", name: "Pakistan" },
  { code: "de", label: "Deutsch",      flag: "🇩🇪", name: "Deutschland" },
  { code: "id", label: "Indonesia",    flag: "🇮🇩", name: "Indonesia" },
  { code: "my", label: "မြန်မာ",         flag: "🇲🇲", name: "Myanmar" },
  { code: "en", label: "English",      flag: "🇺🇸", name: "English" },
];

export default function NameSetup({ onDone }: {
  onDone: (name: string, langCode: string) => void
}) {
  const [name, setName] = useState("");
  const [lang, setLang] = useState("");
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFrame(f => (f + 1) % LANGUAGES.length), 700);
    return () => clearInterval(id);
  }, []);

  const canEnter = name.trim() && lang;
  const selected = LANGUAGES.find(l => l.code === lang);

  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(160deg, #0f2d5c 0%, #1d4ed8 50%, #0f2d5c 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px"
    }}>

      {/* ヘッダー */}
      <div style={{ textAlign: "center", marginBottom: "18px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
          <Image src="/followup-logo.png" alt="Follow Up" width={64} height={64}
            style={{ borderRadius: "50%", border: "3px solid rgba(255,255,255,0.35)" }} />
        </div>
        <div style={{ fontSize: "16pt", fontWeight: 900, color: "white", fontFamily: "Helvetica, sans-serif", letterSpacing: "2px" }}>
          Workplace Chat
        </div>
        <div style={{ fontSize: "9pt", color: "#bfdbfe", fontFamily: "Helvetica, sans-serif", marginTop: "2px" }}>
          フォローアップ株式会社
        </div>
        <div style={{ width: "40px", height: "2px", background: "#f59e0b", margin: "7px auto" }}></div>

        {/* フラグアニメーション */}
        <div style={{ display: "flex", justifyContent: "center", gap: "5px", marginBottom: "5px" }}>
          {LANGUAGES.map((l, i) => (
            <span key={i} style={{
              fontSize: i === frame ? "18pt" : "12pt",
              transition: "font-size 0.3s",
              opacity: i === frame ? 1 : 0.4,
            }}>{l.flag}</span>
          ))}
        </div>
        <div style={{ fontSize: "8.5pt", color: "#93c5fd", fontFamily: "Helvetica, sans-serif" }}>
          11言語 AI自動翻訳 · どの言語でも入力できます
        </div>
      </div>

      {/* カード */}
      <div style={{
        backgroundColor: "white", borderRadius: "20px", padding: "20px 18px",
        width: "100%", maxWidth: "380px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
      }}>

        {/* STEP 1: 名前 */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "9pt", fontWeight: 700, color: "#0f2d5c", fontFamily: "Helvetica, sans-serif", marginBottom: "6px" }}>
            ① あなたの名前 / Your name
          </div>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && canEnter && onDone(name.trim(), lang)}
            placeholder="例: 田中 / Maria / Nguyen / Ram"
            autoFocus
            style={{
              width: "100%", padding: "11px 14px", borderRadius: "10px",
              border: "2px solid #d1d5db", fontSize: "16px", color: "#111827",
              backgroundColor: "white", outline: "none", boxSizing: "border-box",
              WebkitTextFillColor: "#111827", fontFamily: "Helvetica, sans-serif",
            }}
          />
        </div>

        {/* STEP 2: 母国語選択 */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "9pt", fontWeight: 700, color: "#0f2d5c", fontFamily: "Helvetica, sans-serif", marginBottom: "7px" }}>
            ② あなたの言語を選んでください / Select your language
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                style={{
                  padding: "8px 4px", borderRadius: "9px", cursor: "pointer",
                  border: `2px solid ${lang === l.code ? "#1d4ed8" : "#e5e7eb"}`,
                  background: lang === l.code ? "linear-gradient(135deg, #eff6ff, #dbeafe)" : "white",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "3px",
                }}
              >
                <span style={{ fontSize: "18pt" }}>{l.flag}</span>
                <span style={{ fontSize: "8pt", fontWeight: lang === l.code ? 700 : 500,
                  color: lang === l.code ? "#0f2d5c" : "#374151",
                  fontFamily: "Helvetica, sans-serif", lineHeight: 1.2, textAlign: "center" }}>
                  {l.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 選択確認 */}
        {selected && (
          <div style={{
            backgroundColor: "#eff6ff", borderRadius: "8px", padding: "7px 12px",
            marginBottom: "12px", border: "1px solid #bfdbfe", textAlign: "center"
          }}>
            <span style={{ fontSize: "15pt" }}>{selected.flag}</span>
            <span style={{ fontSize: "9pt", color: "#0f2d5c", fontWeight: 700,
              marginLeft: "6px", fontFamily: "Helvetica, sans-serif" }}>
              {selected.label}　で表示します
            </span>
          </div>
        )}

        <button
          onClick={() => canEnter && onDone(name.trim(), lang)}
          disabled={!canEnter}
          style={{
            width: "100%", padding: "13px",
            background: canEnter ? "linear-gradient(135deg, #1d4ed8, #0f2d5c)" : "#d1d5db",
            color: "white", border: "none", borderRadius: "12px",
            fontSize: "15px", fontWeight: 700,
            cursor: canEnter ? "pointer" : "not-allowed",
            fontFamily: "Helvetica, sans-serif",
          }}
        >
          入室する / Enter →
        </button>
      </div>

      <div style={{ marginTop: "12px", textAlign: "center" }}>
        <p style={{ fontSize: "9px", color: "#60a5fa", fontFamily: "Helvetica, sans-serif", margin: 0 }}>
          Philippine and Japan Cross Linking
        </p>
      </div>
    </div>
  );
}
