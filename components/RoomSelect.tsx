"use client";
import { useState } from "react";

const PRESET_ROOMS = [
  { id: "karl-kumiko",  label: "Karl & Kumiko 🇵🇭", icon: "🏗️", color: "#1d4ed8", desc: "Karl・久美子との連絡用" },
  { id: "team-jp",      label: "チーム Japan 🇯🇵",   icon: "🏢", color: "#059669", desc: "日本スタッフ全体" },
  { id: "anna-vianne",  label: "Anna & Vianne",      icon: "🌏", color: "#7c3aed", desc: "フィリピンスタッフ" },
  { id: "construction", label: "建築部 / Architecture", icon: "📐", color: "#d97706", desc: "清水部長・カール" },
  { id: "management",   label: "経営会議 / Mgmt",     icon: "👔", color: "#0f2d5c", desc: "矢塚・アンナ" },
];

export default function RoomSelect({ name, onSelect }: { name: string; onSelect: (room: string) => void }) {
  const [custom, setCustom] = useState("");

  return (
    <div style={{ minHeight: "100dvh", background: "linear-gradient(160deg, #1a3a5c 0%, #1d4ed8 60%, #1a3a5c 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "24px 20px", width: "100%", maxWidth: "360px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>

        {/* ヘッダー */}
        <div style={{ marginBottom: "18px" }}>
          <p style={{ fontSize: "13px", color: "#6b7280", fontFamily: "Helvetica, sans-serif" }}>
            こんにちは / Hello, <strong style={{ color: "#1a3a5c" }}>{name}</strong> 👋
          </p>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1a3a5c", margin: "4px 0 2px", fontFamily: "Helvetica, sans-serif" }}>
            チームを選んでください
          </h2>
          <p style={{ fontSize: "11px", color: "#9ca3af", fontFamily: "Helvetica, sans-serif" }}>
            Select your room · Pumili ng kuwarto
          </p>
        </div>

        {/* ルームボタン */}
        <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginBottom: "14px" }}>
          {PRESET_ROOMS.map(r => (
            <button
              key={r.id}
              onClick={() => onSelect(r.id)}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "10px 14px", borderRadius: "12px",
                border: `2px solid ${r.id === "karl-kumiko" ? r.color : "#e5e7eb"}`,
                background: r.id === "karl-kumiko" ? `linear-gradient(135deg, ${r.color}, #1a3a5c)` : "white",
                color: r.id === "karl-kumiko" ? "white" : "#111827",
                cursor: "pointer", textAlign: "left",
                fontFamily: "Helvetica, sans-serif",
              }}
            >
              <span style={{ fontSize: "18px" }}>{r.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", fontWeight: r.id === "karl-kumiko" ? 700 : 500 }}>
                  {r.label}
                </div>
                <div style={{ fontSize: "10px", opacity: 0.65, marginTop: "1px" }}>
                  {r.desc}
                </div>
              </div>
              {r.id === "karl-kumiko" && (
                <span style={{ fontSize: "9px", background: "#f59e0b", color: "white", padding: "2px 7px", borderRadius: "999px", fontWeight: 700, flexShrink: 0 }}>
                  NEW
                </span>
              )}
            </button>
          ))}
        </div>

        {/* カスタムルーム */}
        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "12px" }}>
          <p style={{ fontSize: "10px", color: "#9ca3af", marginBottom: "7px", fontFamily: "Helvetica, sans-serif" }}>
            カスタムルーム / Custom room
          </p>
          <div style={{ display: "flex", gap: "7px" }}>
            <input
              type="text"
              value={custom}
              onChange={e => setCustom(e.target.value)}
              onKeyDown={e => e.key === "Enter" && custom.trim() && onSelect(custom.trim())}
              placeholder="ルーム名を入力..."
              style={{
                flex: 1, padding: "9px 12px", borderRadius: "10px",
                border: "2px solid #d1d5db", fontSize: "14px", color: "#111827",
                backgroundColor: "white", outline: "none",
                WebkitTextFillColor: "#111827", fontFamily: "Helvetica, sans-serif",
              }}
            />
            <button
              onClick={() => custom.trim() && onSelect(custom.trim())}
              disabled={!custom.trim()}
              style={{
                padding: "9px 14px", background: custom.trim() ? "linear-gradient(135deg, #1d4ed8, #1a3a5c)" : "#d1d5db",
                color: "white", border: "none", borderRadius: "10px",
                fontSize: "14px", fontWeight: 700,
                cursor: custom.trim() ? "pointer" : "not-allowed",
              }}
            >→</button>
          </div>
        </div>
      </div>
    </div>
  );
}
