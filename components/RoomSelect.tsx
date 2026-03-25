"use client";
import { useState } from "react";

const PRESET_ROOMS = [
  { id: "genba-a",    label: "現場A / Site A",          icon: "🏗️", color: "#1d4ed8" },
  { id: "genba-b",    label: "現場B / Site B",          icon: "🏠", color: "#1d4ed8" },
  { id: "souko",      label: "倉庫 / Warehouse",         icon: "📦", color: "#7c3aed" },
  { id: "kaigo",      label: "介護 / Care",              icon: "🤝", color: "#059669" },
  { id: "factory",    label: "工場 / Factory",           icon: "🏭", color: "#d97706" },
  { id: "jimu",       label: "事務所 / Office",          icon: "🏢", color: "#0891b2" },
  { id: "demo-room",  label: "DEMOルーム / Demo Room",   icon: "🌐", color: "#0f2d5c", badge: "DEMO" },
];

export default function RoomSelect({ name, onSelect }: { name: string; onSelect: (room: string) => void }) {
  const [custom, setCustom] = useState("");

  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(160deg, #0f2d5c 0%, #1a4a8a 40%, #0f2d5c 100%)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "16px"
    }}>
      <div style={{
        backgroundColor: "white", borderRadius: "20px", padding: "22px 20px",
        width: "100%", maxWidth: "380px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
      }}>
        <div style={{ marginBottom: "16px" }}>
          <p style={{ fontSize: "12px", color: "#6b7280", fontFamily: "Helvetica, sans-serif" }}>
            Welcome, <strong style={{ color: "#0f2d5c" }}>{name}</strong> 👋
          </p>
          <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#0f2d5c", margin: "3px 0 1px", fontFamily: "Helvetica, sans-serif" }}>
            現場を選んでください / Select your room
          </h2>
          <p style={{ fontSize: "9px", color: "#9ca3af", fontFamily: "Helvetica, sans-serif" }}>
            🇵🇭🇻🇳🇳🇵🇮🇩🇲🇲 どの言語でも自動翻訳 · Auto-translated in all languages
          </p>
        </div>

        {/* 2カラムグリッド */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px", marginBottom: "12px" }}>
          {PRESET_ROOMS.map(r => (
            <button
              key={r.id}
              onClick={() => onSelect(r.id)}
              style={{
                display: "flex",
                flexDirection: r.id === "demo-room" ? "row" : "column",
                alignItems: "center", justifyContent: "center",
                padding: "10px 8px", borderRadius: "10px", gap: "4px",
                border: `2px solid ${r.id === "demo-room" ? r.color : "#e5e7eb"}`,
                background: r.id === "demo-room"
                  ? "linear-gradient(135deg, #0f2d5c, #1a4a8a)"
                  : "white",
                color: r.id === "demo-room" ? "white" : "#111827",
                cursor: "pointer", fontFamily: "Helvetica, sans-serif",
                position: "relative",
                gridColumn: r.id === "demo-room" ? "1 / -1" : "auto",
              }}
            >
              <span style={{ fontSize: r.id === "demo-room" ? "18pt" : "16pt" }}>{r.icon}</span>
              <span style={{ fontSize: "11px", fontWeight: 600, textAlign: "center", lineHeight: 1.3 }}>
                {r.label}
              </span>
              {r.badge && (
                <span style={{
                  position: "absolute", top: "6px", right: "8px",
                  fontSize: "8px", background: "#f59e0b", color: "white",
                  padding: "1px 7px", borderRadius: "99px", fontWeight: 700
                }}>
                  {r.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* カスタム */}
        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "12px" }}>
          <p style={{ fontSize: "9px", color: "#9ca3af", marginBottom: "7px", fontFamily: "Helvetica, sans-serif" }}>
            カスタムルーム / Custom room name
          </p>
          <div style={{ display: "flex", gap: "7px" }}>
            <input
              type="text"
              value={custom}
              onChange={e => setCustom(e.target.value)}
              onKeyDown={e => e.key === "Enter" && custom.trim() && onSelect(custom.trim())}
              placeholder="例: 〇〇工場 / ABC Site"
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
                background: custom.trim() ? "linear-gradient(135deg, #1d4ed8, #0f2d5c)" : "#d1d5db",
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
