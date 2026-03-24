"use client";
import { useState } from "react";
import Image from "next/image";

export default function NameSetup({ onDone }: { onDone: (name: string, role: "jp" | "en") => void }) {
  const [name, setName] = useState("");

  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(160deg, #1a3a5c 0%, #1d4ed8 60%, #1a3a5c 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px"
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
          <Image src="/followup-logo.png" alt="Follow Up" width={80} height={80}
            style={{ borderRadius: "50%", border: "3px solid rgba(255,255,255,0.4)" }} />
        </div>
        <div style={{ fontSize: "18pt", fontWeight: 900, color: "white", fontFamily: "Helvetica, sans-serif", letterSpacing: "2px" }}>
          FOLLOW UP
        </div>
        <div style={{ fontSize: "9pt", color: "#bfdbfe", letterSpacing: "1px", fontFamily: "Helvetica, sans-serif", marginTop: "2px" }}>
          フォローアップ株式会社
        </div>
        <div style={{ width: "44px", height: "2px", background: "#f59e0b", margin: "8px auto" }}></div>
        <div style={{ fontSize: "10pt", color: "#e0f2fe", fontFamily: "Helvetica, sans-serif" }}>
          Team Chat　チーム　チャット
        </div>
      </div>

      {/* Card */}
      <div style={{
        backgroundColor: "white", borderRadius: "20px", padding: "28px 24px",
        width: "100%", maxWidth: "360px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <p style={{ fontSize: "11px", color: "#6b7280", fontFamily: "Helvetica, sans-serif" }}>
            あなたの名前を入力してください<br/>
            <span style={{ fontSize: "10px", color: "#9ca3af" }}>Enter your name · Ilagay ang iyong pangalan</span>
          </p>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && name.trim() && onDone(name.trim(), "jp")}
            placeholder="例: 矢塚 / Karl / Anna / Vianne"
            autoFocus
            style={{
              width: "100%", padding: "13px 16px", borderRadius: "12px",
              border: "2px solid #d1d5db", fontSize: "16px", color: "#111827",
              backgroundColor: "white", outline: "none", boxSizing: "border-box",
              WebkitTextFillColor: "#111827", fontFamily: "Helvetica, sans-serif",
            }}
          />
        </div>

        {/* 3言語対応の説明 */}
        <div style={{
          backgroundColor: "#f0f9ff", borderRadius: "10px", padding: "10px 12px",
          marginBottom: "16px", border: "1px solid #bae6fd"
        }}>
          <p style={{ fontSize: "9.5px", color: "#0369a1", fontFamily: "Helvetica, sans-serif", lineHeight: "1.7", margin: 0 }}>
            🤖 AIが自動で翻訳します<br/>
            🇯🇵 日本語 ⇄ 🇺🇸 English ⇄ 🇵🇭 Tagalog<br/>
            <span style={{ fontSize: "9px", color: "#7dd3fc" }}>Language is automatically detected</span>
          </p>
        </div>

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

      {/* Footer */}
      <div style={{ marginTop: "16px", textAlign: "center" }}>
        <p style={{ fontSize: "9px", color: "#93c5fd", fontFamily: "Helvetica, sans-serif", margin: 0 }}>
          Philippine and Japan Cross Linking
        </p>
      </div>
    </div>
  );
}
