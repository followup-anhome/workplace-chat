"use client";
import { useState } from "react";
import { BRAND, LANGUAGES, ROOMS, FEATURES, MODE } from "@/lib/config";

export default function RoomSelect({ name, langCode, onSelect }: {
  name: string; langCode: string; onSelect: (room: string) => void
}) {
  const [custom, setCustom] = useState("");
  const brand   = BRAND[MODE];
  const rooms   = ROOMS[MODE];
  const features = FEATURES[MODE];
  const myLang  = LANGUAGES.find(l => l.code === langCode);

  return (
    <div style={{ minHeight: "100dvh", background: brand.headerBg, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "22px 20px", width: "100%", maxWidth: "380px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>

        <div style={{ marginBottom: "14px" }}>
          <p style={{ fontSize: "12px", color: "#6b7280", fontFamily: "Helvetica, sans-serif" }}>
            Welcome, <strong style={{ color: brand.dark }}>{name}</strong> 👋
          </p>
          <h2 style={{ fontSize: "13px", fontWeight: 700, color: brand.dark, margin: "3px 0 2px", fontFamily: "Helvetica, sans-serif" }}>
            {MODE === "school" ? "教科を選んでください / Select your class" : "現場を選んでください / Select your room"}
          </h2>
          <p style={{ fontSize: "9px", color: "#9ca3af", fontFamily: "Helvetica, sans-serif" }}>
            {myLang?.flag} {myLang?.label} で表示されます · {LANGUAGES.length}言語 AI自動翻訳
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px", marginBottom: "12px" }}>
          {rooms.map(r => (
            <button key={r.id} onClick={() => onSelect(r.id)}
              style={{
                display: "flex",
                flexDirection: r.badge === "MAIN" || r.badge === "DEMO" ? "row" : "column",
                alignItems: "center", justifyContent: "center",
                padding: "10px 8px", borderRadius: "10px", gap: "5px",
                border: `2px solid ${(r.badge === "MAIN" || r.badge === "DEMO") ? brand.accent : "#e5e7eb"}`,
                background: (r.badge === "MAIN" || r.badge === "DEMO") ? `linear-gradient(135deg, ${brand.accent}, ${brand.dark})` : "white",
                color: (r.badge === "MAIN" || r.badge === "DEMO") ? "white" : "#111827",
                cursor: "pointer", fontFamily: "Helvetica, sans-serif",
                position: "relative",
                gridColumn: (r.badge === "MAIN" || r.badge === "DEMO") ? "1 / -1" : "auto",
              }}>
              <span style={{ fontSize: "16pt" }}>{r.icon}</span>
              <span style={{ fontSize: "11px", fontWeight: 600, textAlign: "center", lineHeight: 1.3 }}>{r.label}</span>
              {r.badge && (
                <span style={{ position: "absolute", top: "5px", right: "8px", fontSize: "8px", background: r.badge === "人気" ? "#0891b2" : "#f59e0b", color: "white", padding: "1px 7px", borderRadius: "99px", fontWeight: 700 }}>{r.badge}</span>
              )}
            </button>
          ))}
        </div>

        {features.customRoom && (
          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "12px" }}>
            <p style={{ fontSize: "9px", color: "#9ca3af", marginBottom: "7px", fontFamily: "Helvetica, sans-serif" }}>カスタムルーム / Custom room</p>
            <div style={{ display: "flex", gap: "7px" }}>
              <input type="text" value={custom} onChange={e => setCustom(e.target.value)}
                onKeyDown={e => e.key === "Enter" && custom.trim() && onSelect(custom.trim())}
                placeholder="ルーム名を入力..."
                style={{ flex: 1, padding: "9px 12px", borderRadius: "10px", border: "2px solid #d1d5db", fontSize: "14px", color: "#111827", backgroundColor: "white", outline: "none", WebkitTextFillColor: "#111827", fontFamily: "Helvetica, sans-serif" }}
              />
              <button onClick={() => custom.trim() && onSelect(custom.trim())} disabled={!custom.trim()}
                style={{ padding: "9px 14px", background: custom.trim() ? `linear-gradient(135deg, ${brand.accent}, ${brand.dark})` : "#d1d5db", color: "white", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: 700, cursor: custom.trim() ? "pointer" : "not-allowed" }}>→</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
