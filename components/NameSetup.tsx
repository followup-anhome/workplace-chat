"use client";
import { useState } from "react";
import Image from "next/image";

export default function NameSetup({ onDone }: { onDone: (name: string, role: "jp" | "en") => void }) {
  const [name, setName] = useState("");

  return (
    <div style={{ minHeight: "100dvh", background: "linear-gradient(160deg, #1a3a5c 0%, #1d4ed8 60%, #1a3a5c 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px" }}>

      {/* ヘッダー */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
          <Image src="/followup-logo.png" alt="Follow Up" width={80} height={80} style={{ borderRadius: "50%", border: "3px solid rgba(255,255,255,0.4)" }} />
        </div>
        <div style={{ fontSize: "11px", color: "#bfdbfe", letterSpacing: "3px", fontFamily: "Helvetica, sans-serif", marginBottom: "2px" }}>
          FOLLOW UP Co., Ltd.
        </div>
        <div style={{ fontSize: "18px", fontWeight: 900, color: "white", fontFamily: "Helvetica, sans-serif", letterSpacing: "2px" }}>
          社内チャット
        </div>
        <div style={{ fontSize: "10px", color: "#93c5fd", fontFamily: "Helvetica, sans-serif", marginTop: "2px" }}>
          Internal Communication Tool
        </div>
        <div style={{ width: "40px", height: "2px", background: "#f59e0b", margin: "8px auto" }}></div>
        <div style={{ fontSize: "10px", color: "#bfdbfe", fontFamily: "Helvetica, sans-serif" }}>
          🇯🇵 日本語 &nbsp;·&nbsp; 🇵🇭 Tagalog &nbsp;·&nbsp; 🇺🇸 English
        </div>
      </div>

      {/* カード */}
      <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "28px 24px", width: "100%", maxWidth: "360px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ textAlign: "center", marginBottom: "18px" }}>
          <p style={{ fontSize: "13px", color: "#374151", fontFamily: "Helvetica, sans-serif", lineHeight: "1.6" }}>
            あなたの名前を入力してください<br/>
            <span style={{ fontSize: "11px", color: "#9ca3af" }}>Please enter your name · Ilagay ang iyong pangalan</span>
          </p>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && name.trim() && onDone(name.trim(), "jp")}
            placeholder="例: 矢塚 / Karl / Anna"
            autoFocus
            style={{
              width: "100%", padding: "12px 16px", borderRadius: "12px",
              border: "2px solid #d1d5db", fontSize: "16px", color: "#111827",
              backgroundColor: "white", outline: "none", boxSizing: "border-box",
              WebkitTextFillColor: "#111827", fontFamily: "Helvetica, sans-serif",
            }}
          />
        </div>

        <p style={{ fontSize: "10px", color: "#9ca3af", textAlign: "center", marginBottom: "16px", fontFamily: "Helvetica, sans-serif", lineHeight: "1.6" }}>
          💡 送信した言語を自動で検出・翻訳します<br/>
          Language is auto-detected and translated
        </p>

        <button
          onClick={() => name.trim() && onDone(name.trim(), "jp")}
          disabled={!name.trim()}
          style={{
            width: "100%", padding: "13px",
            background: name.trim() ? "linear-gradient(135deg, #1d4ed8, #1a3a5c)" : "#d1d5db",
            color: "white", border: "none", borderRadius: "12px",
            fontSize: "15px", fontWeight: 700,
            cursor: name.trim() ? "pointer" : "not-allowed",
            fontFamily: "Helvetica, sans-serif",
          }}
        >
          入室する / Enter →
        </button>
      </div>

      {/* フッター */}
      <div style={{ marginTop: "16px", textAlign: "center" }}>
        <p style={{ fontSize: "10px", color: "#60a5fa", fontFamily: "Helvetica, sans-serif", margin: 0 }}>
          Philippine and Japan Cross Linking
        </p>
      </div>
    </div>
  );
}
