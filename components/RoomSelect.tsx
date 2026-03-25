"use client";
import { LANGUAGES } from "./NameSetup";
import { useState } from "react";

const PRESET_ROOMS = [
  { id: "class-all",  label: "全体チャット / All Class",    icon: "🏫", color: "#1a6b8a", badge: "MAIN" },
  { id: "kokugo",     label: "国語 / Japanese Language",    icon: "📖", color: "#1d4ed8" },
  { id: "sugaku",     label: "数学 / Mathematics",          icon: "📐", color: "#7c3aed" },
  { id: "rika",       label: "理科 / Science",              icon: "🔬", color: "#059669" },
  { id: "shakai",     label: "社会 / Social Studies",       icon: "🌍", color: "#d97706" },
  { id: "eigo",       label: "英語 / English",              icon: "🗣️", color: "#dc2626" },
  { id: "nichigo",    label: "日本語教室 / Japanese Class", icon: "✍️", color: "#0891b2", badge: "人気" },
];

export default function RoomSelect({ name, langCode, onSelect }: { name: string; langCode: string; onSelect: (room: string) => void }) {
  const [custom, setCustom] = useState("");

  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(160deg, #0c3547 0%, #1a6b8a 45%, #0c3547 100%)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "16px"
    }}>
      <div style={{
        backgroundColor: "white", borderRadius: "20px", padding: "22px 20px",
        width: "100%", maxWidth: "380px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
      }}>

        {/* ヘッダー */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span style={{ fontSize: "18pt" }}>🏫</span>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#0c3547", fontFamily: "Helvetica, sans-serif" }}>
                佐野中学校 夜間学級
              </div>
              <div style={{ fontSize: "9px", color: "#9ca3af", fontFamily: "Helvetica, sans-serif" }}>
                Sano Junior High — Evening Class
              </div>
            </div>
          </div>
          <p style={{ fontSize: "11px", color: "#6b7280", fontFamily: "Helvetica, sans-serif", marginTop: "4px" }}>
            こんにちは <strong style={{ color: "#0c3547" }}>{name}</strong> さん 👋
          </p>
          <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#0c3547", margin: "3px 0 1px", fontFamily: "Helvetica, sans-serif" }}>
            教科を選んでください / Select your class
          </h2>
          {(() => {
            const myLang = LANGUAGES.find(l => l.code === langCode);
            return (
              <p style={{ fontSize: "9px", color: "#9ca3af", fontFamily: "Helvetica, sans-serif" }}>
                {myLang?.flag} {myLang?.label} で表示されます · 11言語 AI自動翻訳
              </p>
            );
          })()}
        </div>

        {/* 2カラムルームグリッド */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px", marginBottom: "12px" }}>
          {PRESET_ROOMS.map(r => (
            <button
              key={r.id}
              onClick={() => onSelect(r.id)}
              style={{
                display: "flex",
                flexDirection: r.id === "class-all" ? "row" : "column",
                alignItems: "center", justifyContent: "center",
                padding: "10px 8px", borderRadius: "10px", gap: "5px",
                border: `2px solid ${r.id === "class-all" ? r.color : r.id === "nichigo" ? "#bae6fd" : "#e5e7eb"}`,
                background: r.id === "class-all"
                  ? "linear-gradient(135deg, #1a6b8a, #0c3547)"
                  : r.id === "nichigo"
                  ? "linear-gradient(135deg, #ecfeff, #cffafe)"
                  : "white",
                color: r.id === "class-all" ? "white" : "#111827",
                cursor: "pointer", fontFamily: "Helvetica, sans-serif",
                position: "relative",
                gridColumn: r.id === "class-all" ? "1 / -1" : "auto",
              }}
            >
              <span style={{ fontSize: r.id === "class-all" ? "18pt" : "16pt" }}>{r.icon}</span>
              <span style={{ fontSize: "11px", fontWeight: 600, textAlign: "center", lineHeight: 1.3,
                color: r.id === "nichigo" ? "#0891b2" : "inherit" }}>
                {r.label}
              </span>
              {r.badge && (
                <span style={{
                  position: "absolute", top: "5px", right: "7px",
                  fontSize: "8px",
                  background: r.id === "nichigo" ? "#0891b2" : "#f59e0b",
                  color: "white", padding: "1px 7px", borderRadius: "99px", fontWeight: 700
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
            その他のルーム / Other room
          </p>
          <div style={{ display: "flex", gap: "7px" }}>
            <input
              type="text"
              value={custom}
              onChange={e => setCustom(e.target.value)}
              onKeyDown={e => e.key === "Enter" && custom.trim() && onSelect(custom.trim())}
              placeholder="例: 自習室 / Study room"
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
                background: custom.trim() ? "linear-gradient(135deg, #1a6b8a, #0c3547)" : "#d1d5db",
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
