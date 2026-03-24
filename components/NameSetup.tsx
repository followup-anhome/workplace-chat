"use client";
import { useState } from "react";

export default function NameSetup({ onDone }: { onDone: (name: string, role: "jp" | "en") => void }) {
  const [name, setName] = useState("");

  return (
    <div style={{ minHeight: "100dvh", background: "linear-gradient(160deg, #0f2d5c 0%, #1a4a8a 50%, #0f2d5c 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px" }}>

      {/* UNO Logo Area */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div style={{ fontSize: "13px", color: "#93c5fd", letterSpacing: "3px", fontFamily: "Helvetica, sans-serif", marginBottom: "6px" }}>
          POWERED BY
        </div>
        <div style={{ fontSize: "52px", fontWeight: 900, color: "white", fontFamily: "Helvetica, sans-serif", letterSpacing: "6px", lineHeight: 1 }}>
          UNO
        </div>
        <div style={{ fontSize: "11px", color: "#bfdbfe", letterSpacing: "2px", fontFamily: "Helvetica, sans-serif", marginTop: "4px" }}>
          OVERSEAS PLACEMENT, INC.
        </div>
        <div style={{ width: "60px", height: "2px", background: "#f59e0b", margin: "10px auto" }}></div>
        <div style={{ fontSize: "13px", color: "#e0f2fe", fontFamily: "Helvetica, sans-serif", letterSpacing: "1px" }}>
          Workplace Communication Tool
        </div>
      </div>

      {/* Card */}
      <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "32px 28px", width: "100%", maxWidth: "360px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>

        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "28px", marginBottom: "8px" }}>🤝</div>
          <h1 style={{ fontSize: "18px", fontWeight: 700, color: "#0f2d5c", margin: 0, fontFamily: "Helvetica, sans-serif" }}>
            Workplace Chat
          </h1>
          <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px", fontFamily: "Helvetica, sans-serif" }}>
            職場チャット — AI自動翻訳
          </p>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "8px", fontFamily: "Helvetica, sans-serif" }}>
            あなたの名前 / Your name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && name.trim() && onDone(name.trim(), "jp")}
            placeholder="例: 田中 / Juan"
            autoFocus
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "12px",
              border: "2px solid #d1d5db",
              fontSize: "16px",
              color: "#111827",
              backgroundColor: "white",
              outline: "none",
              boxSizing: "border-box",
              WebkitTextFillColor: "#111827",
              fontFamily: "Helvetica, sans-serif",
            }}
          />
        </div>

        <p style={{ fontSize: "11px", color: "#9ca3af", textAlign: "center", marginBottom: "18px", fontFamily: "Helvetica, sans-serif" }}>
          💡 言語は自動で検出されます<br/>Language is detected automatically
        </p>

        <button
          onClick={() => name.trim() && onDone(name.trim(), "jp")}
          disabled={!name.trim()}
          style={{
            width: "100%",
            padding: "14px",
            background: name.trim() ? "linear-gradient(135deg, #1a4a8a, #0f2d5c)" : "#d1d5db",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: 700,
            cursor: name.trim() ? "pointer" : "not-allowed",
            fontFamily: "Helvetica, sans-serif",
            letterSpacing: "0.5px",
          }}
        >
          次へ → / Next →
        </button>
      </div>

      {/* Footer */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <p style={{ fontSize: "11px", color: "#60a5fa", fontFamily: "Helvetica, sans-serif" }}>
          In partnership with Follow Up Co., Ltd.
        </p>
      </div>
    </div>
  );
}
