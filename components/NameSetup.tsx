"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { BRAND, LANGUAGES, MODE } from "@/lib/config";

export default function NameSetup({ onDone }: {
  onDone: (name: string, langCode: string) => void
}) {
  const [name, setName] = useState("");
  const [lang, setLang] = useState("");
  const [frame, setFrame] = useState(0);
  const brand = BRAND[MODE];
  const canEnter = name.trim() && lang;
  const selected = LANGUAGES.find(l => l.code === lang);

  useEffect(() => {
    const id = setInterval(() => setFrame(f => (f + 1) % LANGUAGES.length), 700);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      minHeight: "100dvh",
      background: brand.headerBg,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px"
    }}>
      {/* ヘッダー */}
      <div style={{ textAlign: "center", marginBottom: "18px" }}>
        {MODE === "school" ? (
          <div>
            <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: "14px", padding: "10px 20px", marginBottom: "10px", border: "1px solid rgba(255,255,255,0.2)" }}>
              <div style={{ fontSize: "11pt", fontWeight: 900, color: "white", fontFamily: "Helvetica, sans-serif" }}>{brand.title}</div>
              <div style={{ fontSize: "8pt", color: "#bfdbfe", marginTop: "2px", fontFamily: "Helvetica, sans-serif" }}>Sano Junior High School — Evening Class</div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
              <Image src="/followup-logo.png" alt="Follow Up" width={36} height={36}
                style={{ borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)" }} />
              <div style={{ fontSize: "8pt", color: "#93c5fd", fontFamily: "Helvetica, sans-serif" }}>{brand.subtitle}</div>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
              <Image src="/followup-logo.png" alt="Follow Up" width={64} height={64}
                style={{ borderRadius: "50%", border: "3px solid rgba(255,255,255,0.35)" }} />
            </div>
            <div style={{ fontSize: "16pt", fontWeight: 900, color: "white", fontFamily: "Helvetica, sans-serif", letterSpacing: "2px" }}>{brand.title}</div>
            <div style={{ fontSize: "9pt", color: "#bfdbfe", fontFamily: "Helvetica, sans-serif", marginTop: "2px" }}>{brand.subtitle}</div>
            <div style={{ width: "40px", height: "2px", background: "#f59e0b", margin: "7px auto" }}></div>
          </div>
        )}

        {/* フラグアニメーション */}
        <div style={{ display: "flex", justifyContent: "center", gap: "4px", marginBottom: "4px", flexWrap: "wrap" }}>
          {LANGUAGES.map((l, i) => (
            <span key={i} style={{ fontSize: i === frame % LANGUAGES.length ? "18pt" : "12pt", transition: "font-size 0.3s", opacity: i === frame % LANGUAGES.length ? 1 : 0.4 }}>{l.flag}</span>
          ))}
        </div>
        <div style={{ fontSize: "8.5pt", color: "#93c5fd", fontFamily: "Helvetica, sans-serif" }}>
          {LANGUAGES.length}言語 AI自動翻訳
        </div>
      </div>

      {/* カード */}
      <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "20px 18px", width: "100%", maxWidth: "380px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>

        {/* STEP 1 */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "9pt", fontWeight: 700, color: brand.dark, fontFamily: "Helvetica, sans-serif", marginBottom: "6px" }}>
            ① あなたの名前 / Your name
          </div>
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && canEnter && onDone(name.trim(), lang)}
            placeholder="例: 田中 / Maria / Nguyen / Ram" autoFocus
            style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: "2px solid #d1d5db", fontSize: "16px", color: "#111827", backgroundColor: "white", outline: "none", boxSizing: "border-box", WebkitTextFillColor: "#111827", fontFamily: "Helvetica, sans-serif" }}
          />
        </div>

        {/* STEP 2 */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "9pt", fontWeight: 700, color: brand.dark, fontFamily: "Helvetica, sans-serif", marginBottom: "7px" }}>
            ② あなたの言語を選んでください / Select your language
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
            {LANGUAGES.map(l => (
              <button key={l.code} onClick={() => setLang(l.code)}
                style={{ padding: "8px 4px", borderRadius: "9px", cursor: "pointer", border: `2px solid ${lang === l.code ? brand.accent : "#e5e7eb"}`, background: lang === l.code ? "#eff6ff" : "white", display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                <span style={{ fontSize: "18pt" }}>{l.flag}</span>
                <span style={{ fontSize: "8pt", fontWeight: lang === l.code ? 700 : 500, color: lang === l.code ? brand.dark : "#374151", fontFamily: "Helvetica, sans-serif", lineHeight: 1.2, textAlign: "center" }}>{l.label}</span>
              </button>
            ))}
          </div>
        </div>

        {selected && (
          <div style={{ backgroundColor: "#eff6ff", borderRadius: "8px", padding: "7px 12px", marginBottom: "12px", border: `1px solid ${brand.accent}30`, textAlign: "center" }}>
            <span style={{ fontSize: "15pt" }}>{selected.flag}</span>
            <span style={{ fontSize: "9pt", color: brand.dark, fontWeight: 700, marginLeft: "6px", fontFamily: "Helvetica, sans-serif" }}>{selected.label}　で表示します</span>
          </div>
        )}

        <button onClick={() => canEnter && onDone(name.trim(), lang)} disabled={!canEnter}
          style={{ width: "100%", padding: "13px", background: canEnter ? `linear-gradient(135deg, ${brand.accent}, ${brand.dark})` : "#d1d5db", color: "white", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 700, cursor: canEnter ? "pointer" : "not-allowed", fontFamily: "Helvetica, sans-serif" }}>
          入室する / Enter →
        </button>
      </div>
    </div>
  );
}
