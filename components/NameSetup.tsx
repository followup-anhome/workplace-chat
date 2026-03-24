"use client";
import { useState } from "react";
import Image from "next/image";

export default function NameSetup({ onDone }: { onDone: (name: string, role: "jp" | "en") => void }) {
  const [name, setName] = useState("");

  return (
    <div style={{ minHeight: "100dvh", backgroundColor: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "32px 28px", width: "100%", maxWidth: "360px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb" }}>

        {/* Follow Up Logo */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
            <Image src="/followup-logo.png" alt="Follow Up Co., Ltd." width={72} height={72} style={{ borderRadius: "50%" }} />
          </div>
          <h1 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", margin: 0, fontFamily: "Helvetica, sans-serif" }}>
            Workplace Chat
          </h1>
          <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px", fontFamily: "Helvetica, sans-serif" }}>
            職場チャット — AI自動翻訳（開発版）
          </p>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "7px", fontFamily: "Helvetica, sans-serif" }}>
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
              width: "100%", padding: "11px 16px", borderRadius: "12px",
              border: "2px solid #d1d5db", fontSize: "16px", color: "#111827",
              backgroundColor: "white", outline: "none", boxSizing: "border-box",
              WebkitTextFillColor: "#111827", fontFamily: "Helvetica, sans-serif",
            }}
          />
        </div>

        <p style={{ fontSize: "11px", color: "#9ca3af", textAlign: "center", marginBottom: "16px", fontFamily: "Helvetica, sans-serif" }}>
          💡 言語は自動で検出されます / Language detected automatically
        </p>

        <button
          onClick={() => name.trim() && onDone(name.trim(), "jp")}
          disabled={!name.trim()}
          style={{
            width: "100%", padding: "13px",
            background: name.trim() ? "#1d4ed8" : "#d1d5db",
            color: "white", border: "none", borderRadius: "12px",
            fontSize: "15px", fontWeight: 700,
            cursor: name.trim() ? "pointer" : "not-allowed",
            fontFamily: "Helvetica, sans-serif",
          }}
        >
          次へ → / Next →
        </button>
      </div>
    </div>
  );
}
