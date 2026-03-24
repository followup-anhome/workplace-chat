"use client";
import { useState } from "react";

export default function NameSetup({ onDone }: { onDone: (name: string, role: "jp" | "en") => void }) {
  const [name, setName] = useState("");

  return (
    <div style={{ minHeight: "100dvh", backgroundColor: "#1e3a5f", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "36px 28px", width: "100%", maxWidth: "360px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🤝</div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#111827", margin: 0 }}>Workplace Chat</h1>
          <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "6px" }}>職場チャット — AI自動翻訳</p>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "8px" }}>
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
            }}
          />
        </div>

        <p style={{ fontSize: "12px", color: "#9ca3af", textAlign: "center", marginBottom: "20px" }}>
          💡 言語は自動で検出されます<br/>Language is detected automatically
        </p>

        <button
          onClick={() => name.trim() && onDone(name.trim(), "jp")}
          disabled={!name.trim()}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: name.trim() ? "#1d4ed8" : "#d1d5db",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: 600,
            cursor: name.trim() ? "pointer" : "not-allowed",
          }}
        >
          次へ → / Next →
        </button>
      </div>
    </div>
  );
}
