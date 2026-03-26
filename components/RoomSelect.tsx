"use client";
import { useState } from "react";

const PRESET_ROOMS = [
  { id: "all-staff",    label: "全体 / All Staff",       icon: "🏢", color: "#c0392b", badge: "MAIN" },
  { id: "joto",         label: "上棟班 / Framing Team",  icon: "🏗️", color: "#1a1a2e" },
  { id: "gaiko",        label: "外構班 / Exterior Team", icon: "🌿", color: "#1a1a2e" },
  { id: "kanri",        label: "管理 / Management",      icon: "📋", color: "#1a1a2e" },
];

export default function RoomSelect({ name, onSelect }: { name: string; onSelect: (room: string) => void }) {
  const [custom, setCustom] = useState("");

  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(160deg, #1a1a2e 0%, #c0392b 55%, #1a1a2e 100%)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "16px"
    }}>
      <div style={{
        backgroundColor: "white", borderRadius: "20px", padding: "22px 20px",
        width: "100%", maxWidth: "360px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
      }}>
        <div style={{ marginBottom: "16px" }}>
          <p style={{ fontSize: "12px", color: "#6b7280", fontFamily: "Helvetica, sans-serif" }}>
            Welcome, <strong style={{ color: "#1a1a2e" }}>{name}</strong> 👋
          </p>
          <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a2e", margin: "3px 0 2px", fontFamily: "Helvetica, sans-serif" }}>
            チャットルームを選んでください
          </h2>
          <p style={{ fontSize: "9px", color: "#9ca3af", fontFamily: "Helvetica, sans-serif" }}>
            🇯🇵 日本語 · 🇺🇸 English · 🇵🇭 Tagalog　自動翻訳対応
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginBottom: "14px" }}>
          {PRESET_ROOMS.map(r => (
            <button
              key={r.id}
              onClick={() => onSelect(r.id)}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "12px 14px", borderRadius: "12px",
                border: `2px solid ${r.badge === "MAIN" ? r.color : "#e5e7eb"}`,
                background: r.badge === "MAIN"
                  ? "linear-gradient(135deg, #c0392b, #1a1a2e)"
                  : "white",
                color: r.badge === "MAIN" ? "white" : "#111827",
                cursor: "pointer", fontFamily: "Helvetica, sans-serif",
                position: "relative",
              }}
            >
              <span style={{ fontSize: "18pt" }}>{r.icon}</span>
              <span style={{ fontSize: "13px", fontWeight: r.badge === "MAIN" ? 700 : 500, flex: 1 }}>
                {r.label}
              </span>
              {r.badge && (
                <span style={{
                  fontSize: "9px", background: "#f59e0b", color: "white",
                  padding: "2px 8px", borderRadius: "999px", fontWeight: 700
                }}>{r.badge}</span>
              )}
            </button>
          ))}
        </div>

        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "12px" }}>
          <p style={{ fontSize: "9px", color: "#9ca3af", marginBottom: "7px", fontFamily: "Helvetica, sans-serif" }}>
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
                padding: "9px 14px",
                background: custom.trim() ? "linear-gradient(135deg, #c0392b, #1a1a2e)" : "#d1d5db",
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
