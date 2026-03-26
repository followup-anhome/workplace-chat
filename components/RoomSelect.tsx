"use client";
import { useState } from "react";

const ROOMS = [
  { id: "event-hall",  label: "🎉 イベント会場 / Event Hall",     badge: "TODAY",  desc: "3月28日 尼崎市フィリピンコミュニティ" },
  { id: "community",   label: "💬 コミュニティ / Community",        badge: "",       desc: "いつでも使えるコミュニティルーム" },
];

export default function RoomSelect({ name, onSelect }: { name: string; onSelect: (room: string) => void }) {
  const [custom, setCustom] = useState("");

  return (
    <div style={{ minHeight: "100dvh", background: "linear-gradient(160deg, #1a3a5c 0%, #0ea5e9 45%, #1a3a5c 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "22px 20px", width: "100%", maxWidth: "360px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>

        <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>
          Welcome, <strong style={{ color: "#1a3a5c" }}>{name}</strong> 👋
        </p>
        <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#1a3a5c", marginBottom: "4px" }}>
          ルームを選んでください / Select a room
        </h2>
        <p style={{ fontSize: "9px", color: "#9ca3af", marginBottom: "16px" }}>
          🇵🇭 Tagalog · 🇯🇵 日本語 · 🇺🇸 English　AI自動翻訳
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
          {ROOMS.map(r => (
            <button key={r.id} onClick={() => onSelect(r.id)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 16px", borderRadius: "12px",
                border: `2px solid ${r.badge === "TODAY" ? "#0ea5e9" : "#e5e7eb"}`,
                background: r.badge === "TODAY" ? "linear-gradient(135deg, #0ea5e9, #1a3a5c)" : "white",
                color: r.badge === "TODAY" ? "white" : "#111827",
                cursor: "pointer", flexDirection: "column", alignItems: "flex-start", gap: "4px"
              }}>
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                <span style={{ fontSize: "13px", fontWeight: 700 }}>{r.label}</span>
                {r.badge && <span style={{ fontSize: "9px", background: "#f59e0b", color: "white", padding: "2px 8px", borderRadius: "999px", fontWeight: 700, flexShrink: 0 }}>{r.badge}</span>}
              </div>
              <span style={{ fontSize: "9px", opacity: 0.8 }}>{r.desc}</span>
            </button>
          ))}
        </div>

        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "12px" }}>
          <p style={{ fontSize: "9px", color: "#9ca3af", marginBottom: "7px" }}>カスタムルーム / Custom room</p>
          <div style={{ display: "flex", gap: "7px" }}>
            <input type="text" value={custom} onChange={e => setCustom(e.target.value)}
              onKeyDown={e => e.key === "Enter" && custom.trim() && onSelect(custom.trim())}
              placeholder="ルーム名..."
              style={{ flex: 1, padding: "9px 12px", borderRadius: "10px", border: "2px solid #d1d5db", fontSize: "14px", color: "#111827", backgroundColor: "white", outline: "none", WebkitTextFillColor: "#111827" }}
            />
            <button onClick={() => custom.trim() && onSelect(custom.trim())} disabled={!custom.trim()}
              style={{ padding: "9px 14px", background: custom.trim() ? "linear-gradient(135deg, #0ea5e9, #1a3a5c)" : "#d1d5db", color: "white", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: 700, cursor: custom.trim() ? "pointer" : "not-allowed" }}>→</button>
          </div>
        </div>
      </div>
    </div>
  );
}
