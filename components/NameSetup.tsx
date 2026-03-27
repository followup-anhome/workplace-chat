"use client";
import { useState } from "react";

export const LANGUAGES = [
  { code: "ja", label: "日本語",          flag: "🇯🇵", name: "日本" },
  { code: "tl", label: "Tagalog",         flag: "🇵🇭", name: "Philippines" },
  { code: "vi", label: "Viet Nam",      flag: "🇻🇳", name: "Việt Nam" },
  { code: "ne", label: "Nepali",           flag: "🇳🇵", name: "Nepal" },
  { code: "zh", label: "中文",             flag: "🇨🇳", name: "中国" },
  { code: "hi", label: "Hindi",            flag: "🇮🇳", name: "India" },
  { code: "ur", label: "Urdu",             flag: "🇵🇰", name: "Pakistan" },
  { code: "de", label: "Deutsch",         flag: "🇩🇪", name: "Deutschland" },
  { code: "id", label: "Indonesia",       flag: "🇮🇩", name: "Indonesia" },
  { code: "my", label: "Myanmar",            flag: "🇲🇲", name: "Myanmar" },
  { code: "en", label: "English",         flag: "🇺🇸", name: "English" },
];

export default function NameSetup({ onDone }: {
  onDone: (name: string, langCode: string) => void
}) {
  const [name, setName] = useState("");
  const [lang, setLang] = useState("");

  const canEnter = name.trim() && lang;
  const selected = LANGUAGES.find(l => l.code === lang);

  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(160deg, #0c3547 0%, #1a6b8a 45%, #0c3547 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px"
    }}>

      {/* 学校ヘッダー */}
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <div style={{
          background: "rgba(255,255,255,0.12)", borderRadius: "14px",
          padding: "10px 20px", marginBottom: "10px", border: "1px solid rgba(255,255,255,0.2)"
        }}>
          <div style={{ fontSize: "11pt", fontWeight: 900, color: "white", fontFamily: "Helvetica, sans-serif" }}>
            🏫 泉佐野市立佐野中学校　夜間学級
          </div>
          <div style={{ fontSize: "8pt", color: "#bfdbfe", fontFamily: "Helvetica, sans-serif", marginTop: "2px" }}>
            Sano Junior High School — Evening Class
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
          <img src="/followup-logo.png" alt="Follow Up" style={{ width: "36px", height: "36px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)" }} />
          <div style={{ fontSize: "8pt", color: "#93c5fd", fontFamily: "Helvetica, sans-serif" }}>
            AI翻訳チャット　by フォローアップ株式会社
          </div>
        </div>
      </div>

      {/* カード */}
      <div style={{
        backgroundColor: "white", borderRadius: "20px", padding: "20px 18px",
        width: "100%", maxWidth: "380px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
      }}>

        {/* STEP 1: 名前 */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "9pt", fontWeight: 700, color: "#0c3547", fontFamily: "Helvetica, sans-serif", marginBottom: "6px" }}>
            ① あなたの名前 / Your name
          </div>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
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
          <div style={{ fontSize: "9pt", fontWeight: 700, color: "#0c3547", fontFamily: "Helvetica, sans-serif", marginBottom: "7px" }}>
            ② あなたの言語を選んでください / Select your language
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                style={{
                  padding: "8px 4px", borderRadius: "9px", cursor: "pointer",
                  border: `2px solid ${lang === l.code ? "#1a6b8a" : "#e5e7eb"}`,
                  background: lang === l.code ? "linear-gradient(135deg, #ecfeff, #cffafe)" : "white",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "3px",
                  transition: "all 0.15s",
                }}
              >
                <span style={{
                  fontSize: "16pt", lineHeight: 1,
                  fontFamily: "'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif"
                }}>{l.flag}</span>
                <span style={{ fontSize: "8pt", fontWeight: lang === l.code ? 700 : 500,
                  color: lang === l.code ? "#0c3547" : "#374151", fontFamily: "Helvetica, sans-serif",
                  lineHeight: 1.2, textAlign: "center" }}>
                  {l.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 選択中の表示 */}
        {selected && (
          <div style={{
            backgroundColor: "#ecfeff", borderRadius: "8px", padding: "8px 12px",
            marginBottom: "12px", border: "1px solid #67e8f9", textAlign: "center"
          }}>
            <span style={{ fontSize: "16pt" }}>{selected.flag}</span>
            <span style={{ fontSize: "9pt", color: "#0c3547", fontWeight: 700,
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
            background: canEnter ? "linear-gradient(135deg, #1a6b8a, #0c3547)" : "#d1d5db",
            color: "white", border: "none", borderRadius: "12px",
            fontSize: "15px", fontWeight: 700,
            cursor: canEnter ? "pointer" : "not-allowed",
            fontFamily: "Helvetica, sans-serif",
          }}
        >
          入室する / Enter →
        </button>
      </div>
    </div>
  );
}
