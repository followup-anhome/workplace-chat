"use client";
import { useState } from "react";

const PRESET_ROOMS = [
  { id: "uno-demo",  label: "UNO Demo Room", icon: "🌐", color: "#1a4a8a" },
  { id: "genba-1",   label: "現場A / Site A", icon: "🏗️", color: "#1d4ed8" },
  { id: "genba-2",   label: "現場B / Site B", icon: "🏠", color: "#1d4ed8" },
  { id: "souko",     label: "倉庫 / Warehouse", icon: "📦", color: "#1d4ed8" },
  { id: "jimu",      label: "事務所 / Office", icon: "🏢", color: "#1d4ed8" },
];

export default function RoomSelect({ name, onSelect }: { name: string; onSelect: (room: string) => void }) {
  const [custom, setCustom] = useState("");

  return (
    <div style={{ minHeight: "100dvh", background: "linear-gradient(160deg, #0f2d5c 0%, #1a4a8a 50%, #0f2d5c 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "28px 24px", width: "100%", maxWidth: "360px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>

        {/* Header */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontSize: "13px", color: "#6b7280", fontFamily: "Helvetica, sans-serif" }}>
            こんにちは / Hello, <strong style={{ color: "#0f2d5c" }}>{name}</strong> 👋
          </p>
          <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#0f2d5c", margin: "4px 0 0", fontFamily: "Helvetica, sans-serif" }}>
            現場を選んでください
          </h2>
          <p style={{ fontSize: "12px", color: "#9ca3af", margin: "2px 0 0", fontFamily: "Helvetica, sans-serif" }}>
            Select your room
          </p>
        </div>

        {/* Room Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
          {PRESET_ROOMS.map(r => (
            <button
              key={r.id}
              onClick={() => onSelect(r.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                borderRadius: "12px",
                border: `2px solid ${r.id === "uno-demo" ? "#1a4a8a" : "#e5e7eb"}`,
                background: r.id === "uno-demo" ? "linear-gradient(135deg, #1a4a8a, #0f2d5c)" : "white",
                color: r.id === "uno-demo" ? "white" : "#111827",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "Helvetica, sans-serif",
              }}
            >
              <span style={{ fontSize: "20px" }}>{r.icon}</span>
              <span style={{ fontSize: "14px", fontWeight: r.id === "uno-demo" ? 700 : 500 }}>
                {r.label}
              </span>
              {r.id === "uno-demo" && (
                <span style={{ marginLeft: "auto", fontSize: "10px", background: "#f59e0b", color: "white", padding: "2px 8px", borderRadius: "999px", fontWeight: 700 }}>
                  DEMO
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Custom Room */}
        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "14px" }}>
          <p style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "8px", fontFamily: "Helvetica, sans-serif" }}>
            カスタム / Custom room
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              value={custom}
              onChange={e => setCustom(e.target.value)}
              onKeyDown={e => e.key === "Enter" && custom.trim() && onSelect(custom.trim())}
              placeholder="部屋名を入力..."
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: "10px",
                border: "2px solid #d1d5db",
                fontSize: "14px",
                color: "#111827",
                backgroundColor: "white",
                outline: "none",
                WebkitTextFillColor: "#111827",
                fontFamily: "Helvetica, sans-serif",
              }}
            />
            <button
              onClick={() => custom.trim() && onSelect(custom.trim())}
              disabled={!custom.trim()}
              style={{
                padding: "10px 16px",
                background: custom.trim() ? "linear-gradient(135deg, #1a4a8a, #0f2d5c)" : "#d1d5db",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 700,
                cursor: custom.trim() ? "pointer" : "not-allowed",
              }}
            >→</button>
          </div>
        </div>
      </div>
    </div>
  );
}
