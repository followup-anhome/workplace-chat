"use client";
import { useState } from "react";

const PRESET_ROOMS = [
  { id: "followup-team", label: "🏢 Follow Up Team", icon: "🏢", color: "#1d4ed8", badge: "MAIN" },
  { id: "karl-design",   label: "🎨 Design / Karl", icon: "🎨", color: "#7c3aed", badge: null },
  { id: "anna-global",   label: "🌏 Global / Anna", icon: "🌏", color: "#059669", badge: null },
  { id: "shimizu-arch",  label: "🏗️ Architecture / Shimizu", icon: "🏗️", color: "#d97706", badge: null },
];

export default function RoomSelect({ name, onSelect }: { name: string; onSelect: (room: string) => void }) {
  const [custom, setCustom] = useState("");

  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(160deg, #1a3a5c 0%, #1d4ed8 60%, #1a3a5c 100%)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "16px"
    }}>
      <div style={{
        backgroundColor: "white", borderRadius: "20px", padding: "24px 20px",
        width: "100%", maxWidth: "360px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
      }}>
        {/* Header */}
        <div style={{ marginBottom: "18px" }}>
          <p style={{ fontSize: "12px", color: "#6b7280", fontFamily: "Helvetica, sans-serif" }}>
            Welcome, <strong style={{ color: "#1a3a5c" }}>{name}</strong> 👋
          </p>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1a3a5c", margin: "4px 0 2px", fontFamily: "Helvetica, sans-serif" }}>
            チャットルームを選択
          </h2>
          <p style={{ fontSize: "10px", color: "#9ca3af", fontFamily: "Helvetica, sans-serif" }}>
            Select room · Pumili ng silid
          </p>
        </div>

        {/* Rooms */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
          {PRESET_ROOMS.map(r => (
            <button
              key={r.id}
              onClick={() => onSelect(r.id)}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "12px 14px", borderRadius: "12px",
                border: `2px solid ${r.id === "followup-team" ? r.color : "#e5e7eb"}`,
                background: r.id === "followup-team"
                  ? `linear-gradient(135deg, ${r.color}, #1a3a5c)`
                  : "white",
                color: r.id === "followup-team" ? "white" : "#111827",
                cursor: "pointer", textAlign: "left",
                fontFamily: "Helvetica, sans-serif",
              }}
            >
              <span style={{ fontSize: "20px" }}>{r.icon}</span>
              <span style={{ fontSize: "13px", fontWeight: r.id === "followup-team" ? 700 : 500, flex: 1 }}>
                {r.label}
              </span>
              {r.badge && (
                <span style={{
                  fontSize: "9px", background: "#f59e0b", color: "white",
                  padding: "2px 8px", borderRadius: "999px", fontWeight: 700
                }}>
                  {r.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Custom */}
        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "14px" }}>
          <p style={{ fontSize: "10px", color: "#9ca3af", marginBottom: "8px", fontFamily: "Helvetica, sans-serif" }}>
            カスタムルーム / Custom room
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              value={custom}
              onChange={e => setCustom(e.target.value)}
              onKeyDown={e => e.key === "Enter" && custom.trim() && onSelect(custom.trim())}
              placeholder="ルーム名を入力..."
              style={{
                flex: 1, padding: "10px 12px", borderRadius: "10px",
                border: "2px solid #d1d5db", fontSize: "14px", color: "#111827",
                backgroundColor: "white", outline: "none",
                WebkitTextFillColor: "#111827", fontFamily: "Helvetica, sans-serif",
              }}
            />
            <button
              onClick={() => custom.trim() && onSelect(custom.trim())}
              disabled={!custom.trim()}
              style={{
                padding: "10px 16px",
                background: custom.trim() ? "linear-gradient(135deg, #1d4ed8, #1a3a5c)" : "#d1d5db",
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
