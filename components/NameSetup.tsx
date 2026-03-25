"use client";
import { useState } from "react";
import Image from "next/image";

const FLAGS = ["🇯🇵","🇺🇸","🇵🇭","🇻🇳","🇳🇵","🇮🇩","🇲🇲","🇨🇳","🇮🇳","🇵🇰","🇩🇪"];

export default function NameSetup({ onDone }: { onDone: (name: string, role: "jp" | "en") => void }) {
  const [name, setName] = useState("");
  const [frame, setFrame] = useState(0);

  // フラグのアニメーション用
  useState(() => {
    const id = setInterval(() => setFrame(f => (f + 1) % FLAGS.length), 800);
    return () => clearInterval(id);
  });

  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(160deg, #0f2d5c 0%, #1a4a8a 40%, #0f2d5c 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px"
    }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
          <Image src="/followup-logo.png" alt="Follow Up" width={76} height={76}
            style={{ borderRadius: "50%", border: "3px solid rgba(255,255,255,0.35)" }} />
        </div>
        <div style={{ fontSize: "16pt", fontWeight: 900, color: "white", fontFamily: "Helvetica, sans-serif", letterSpacing: "2px" }}>
          Workplace Chat
        </div>
        <div style={{ fontSize: "9pt", color: "#bfdbfe", fontFamily: "Helvetica, sans-serif", marginTop: "3px" }}>
          フォローアップ株式会社
        </div>
        <div style={{ width: "44px", height: "2px", background: "#f59e0b", margin: "8px auto" }}></div>
        {/* 7言語フラグ表示 */}
        <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "6px" }}>
          {FLAGS.map((flag, i) => (
            <span key={i} style={{
              fontSize: i === frame % FLAGS.length ? "20pt" : "14pt",
              transition: "font-size 0.3s",
              opacity: i === frame % FLAGS.length ? 1 : 0.5,
            }}>{flag}</span>
          ))}
        </div>
        <div style={{ fontSize: "9pt", color: "#e0f2fe", fontFamily: "Helvetica, sans-serif" }}>
          11言語対応 AI自動翻訳チャット
        </div>
        <div style={{ fontSize: "8pt", color: "#93c5fd", fontFamily: "Helvetica, sans-serif", marginTop: "2px" }}>
          🇯🇵🇺🇸🇵🇭🇻🇳🇳🇵🇮🇩🇲🇲🇨🇳🇮🇳🇵🇰🇩🇪 Auto-translated
        </div>
      </div>

      {/* Card */}
      <div style={{
        backgroundColor: "white", borderRadius: "20px", padding: "26px 22px",
        width: "100%", maxWidth: "360px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "14px" }}>
          <p style={{ fontSize: "11px", color: "#374151", fontWeight: 600, fontFamily: "Helvetica, sans-serif" }}>
            あなたの名前を入力 / Enter your name
          </p>
          <p style={{ fontSize: "9px", color: "#9ca3af", fontFamily: "Helvetica, sans-serif", marginTop: "3px" }}>
            どの言語でも入力できます · Type in any language
          </p>
        </div>

        <div style={{ marginBottom: "14px" }}>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && name.trim() && onDone(name.trim(), "jp")}
            placeholder="例: 田中 / Juan / Nguyen / Ram"
            autoFocus
            style={{
              width: "100%", padding: "13px 16px", borderRadius: "12px",
              border: "2px solid #d1d5db", fontSize: "16px", color: "#111827",
              backgroundColor: "white", outline: "none", boxSizing: "border-box",
              WebkitTextFillColor: "#111827", fontFamily: "Helvetica, sans-serif",
            }}
          />
        </div>

        {/* 7言語説明 */}
        <div style={{
          backgroundColor: "#f0f9ff", borderRadius: "10px", padding: "10px 12px",
          marginBottom: "14px", border: "1px solid #bae6fd"
        }}>
          <p style={{ fontSize: "9px", color: "#0369a1", fontFamily: "Helvetica, sans-serif", lineHeight: "1.8", margin: 0 }}>
            🤖 AIが自動で翻訳します / AI auto-translates<br/>
            🇯🇵 日本語　🇺🇸 English　🇵🇭 Tagalog<br/>
            🇻🇳 Tiếng Việt　🇳🇵 नेपाली　🇮🇩 Indonesian　🇲🇲 မြန်မာ
          </p>
        </div>

        <button
          onClick={() => name.trim() && onDone(name.trim(), "jp")}
          disabled={!name.trim()}
          style={{
            width: "100%", padding: "13px",
            background: name.trim() ? "linear-gradient(135deg, #1d4ed8, #0f2d5c)" : "#d1d5db",
            color: "white", border: "none", borderRadius: "12px",
            fontSize: "15px", fontWeight: 700,
            cursor: name.trim() ? "pointer" : "not-allowed",
            fontFamily: "Helvetica, sans-serif",
          }}
        >
          入室する / Enter →
        </button>
      </div>

      <div style={{ marginTop: "14px", textAlign: "center" }}>
        <p style={{ fontSize: "9px", color: "#60a5fa", fontFamily: "Helvetica, sans-serif", margin: 0 }}>
          Philippine and Japan Cross Linking
        </p>
      </div>
    </div>
  );
}
