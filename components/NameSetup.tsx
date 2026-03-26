"use client";
import { useState } from "react";

export default function NameSetup({ onDone }: { onDone: (name: string, role: "jp" | "en") => void }) {
  const [name, setName] = useState("");

  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(160deg, #1a1a2e 0%, #c0392b 55%, #1a1a2e 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px"
    }}>
      {/* ヘッダー */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <div style={{
          background: "rgba(255,255,255,0.12)", borderRadius: "16px",
          padding: "12px 28px", marginBottom: "10px", border: "1px solid rgba(255,255,255,0.25)"
        }}>
          <div style={{ fontSize: "22pt", fontWeight: 900, color: "white", fontFamily: "Helvetica, sans-serif", letterSpacing: "3px" }}>
            FIRST
          </div>
          <div style={{ fontSize: "11pt", fontWeight: 700, color: "#fca5a5", fontFamily: "Helvetica, sans-serif", letterSpacing: "4px", marginTop: "1px" }}>
            住建
          </div>
        </div>
        <div style={{ width: "40px", height: "2.5px", background: "#f59e0b", margin: "7px auto" }}></div>
        <div style={{ fontSize: "9pt", color: "#fecaca", fontFamily: "Helvetica, sans-serif" }}>
          Staff Chat　スタッフチャット
        </div>
        <div style={{ fontSize: "8pt", color: "#fca5a5", fontFamily: "Helvetica, sans-serif", marginTop: "4px" }}>
          🇯🇵 日本語 ⇄ 🇺🇸 English ⇄ 🇵🇭 Tagalog　AI自動翻訳
        </div>
      </div>

      {/* カード */}
      <div style={{
        backgroundColor: "white", borderRadius: "20px", padding: "24px 20px",
        width: "100%", maxWidth: "360px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "14px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#1a1a2e", fontFamily: "Helvetica, sans-serif" }}>
            あなたの名前を入力してください
          </p>
          <p style={{ fontSize: "9px", color: "#9ca3af", fontFamily: "Helvetica, sans-serif", marginTop: "3px" }}>
            Enter your name · Ilagay ang iyong pangalan
          </p>
        </div>

        <div style={{ marginBottom: "14px" }}>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && name.trim() && onDone(name.trim(), "jp")}
            placeholder="例: 田中 / Juan / Maria"
            autoFocus
            style={{
              width: "100%", padding: "13px 16px", borderRadius: "12px",
              border: "2px solid #d1d5db", fontSize: "16px", color: "#111827",
              backgroundColor: "white", outline: "none", boxSizing: "border-box",
              WebkitTextFillColor: "#111827", fontFamily: "Helvetica, sans-serif",
            }}
          />
        </div>

        <button
          onClick={() => name.trim() && onDone(name.trim(), "jp")}
          disabled={!name.trim()}
          style={{
            width: "100%", padding: "13px",
            background: name.trim() ? "linear-gradient(135deg, #c0392b, #1a1a2e)" : "#d1d5db",
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
        <p style={{ fontSize: "8px", color: "#fca5a5", fontFamily: "Helvetica, sans-serif", margin: 0 }}>
          Powered by フォローアップ株式会社
        </p>
      </div>
    </div>
  );
}
