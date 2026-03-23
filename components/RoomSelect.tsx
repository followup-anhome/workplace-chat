"use client";
import { useState } from "react";

const PRESET_ROOMS = [
  { id: "genba-1", label: "現場A / Site A", icon: "🏗️" },
  { id: "genba-2", label: "現場B / Site B", icon: "🏠" },
  { id: "souko",   label: "倉庫 / Warehouse", icon: "📦" },
  { id: "jimu",    label: "事務所 / Office", icon: "🏢" },
];

export default function RoomSelect({ name, onSelect }: { name: string; onSelect: (room: string) => void }) {
  const [custom, setCustom] = useState("");

  return (
    <div style={{minHeight:"100vh", background:"#f0f4f8", display:"flex", alignItems:"center", justifyContent:"center", padding:"16px"}}>
      <div style={{background:"#ffffff", borderRadius:"20px", boxShadow:"0 4px 24px rgba(0,0,0,0.10)", padding:"32px", width:"100%", maxWidth:"360px"}}>
        <div style={{marginBottom:"24px"}}>
          <p style={{fontSize:"13px", color:"#6b7280", margin:"0 0 4px"}}>こんにちは / Hello, <strong style={{color:"#1a1a2e"}}>{name}</strong> 👋</p>
          <h2 style={{fontSize:"18px", fontWeight:"700", color:"#1a1a2e", margin:"0"}}>現場を選んでください<br/><span style={{fontSize:"14px", fontWeight:"400", color:"#6b7280"}}>Select your room</span></h2>
        </div>

        <div style={{display:"flex", flexDirection:"column", gap:"8px", marginBottom:"16px"}}>
          {PRESET_ROOMS.map(r => (
            <button
              key={r.id}
              onClick={() => onSelect(r.id)}
              style={{
                display:"flex", alignItems:"center", gap:"12px",
                padding:"14px 16px", borderRadius:"12px",
                border:"2px solid #e5e7eb", background:"#ffffff",
                cursor:"pointer", textAlign:"left", transition:"all 0.15s"
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#2563eb"; (e.currentTarget as HTMLButtonElement).style.background = "#eff6ff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb"; (e.currentTarget as HTMLButtonElement).style.background = "#ffffff"; }}
            >
              <span style={{fontSize:"22px"}}>{r.icon}</span>
              <span style={{fontSize:"14px", fontWeight:"600", color:"#1a1a2e"}}>{r.label}</span>
            </button>
          ))}
        </div>

        <div style={{borderTop:"1px solid #e5e7eb", paddingTop:"16px"}}>
          <p style={{fontSize:"12px", color:"#9ca3af", margin:"0 0 8px"}}>カスタム / Custom room</p>
          <div style={{display:"flex", gap:"8px"}}>
            <input
              type="text"
              value={custom}
              onChange={e => setCustom(e.target.value)}
              onKeyDown={e => e.key === "Enter" && custom.trim() && onSelect(custom.trim())}
              placeholder="部屋名を入力..."
              style={{
                flex:1, padding:"10px 14px", borderRadius:"10px",
                border:"2px solid #e5e7eb", fontSize:"14px",
                color:"#1a1a2e", background:"#ffffff",
                outline:"none", fontFamily:"inherit"
              }}
            />
            <button
              onClick={() => custom.trim() && onSelect(custom.trim())}
              disabled={!custom.trim()}
              style={{
                padding:"10px 16px", borderRadius:"10px",
                background: custom.trim() ? "#2563eb" : "#d1d5db",
                color:"#ffffff", border:"none",
                fontSize:"16px", cursor: custom.trim() ? "pointer" : "not-allowed"
              }}
            >→</button>
          </div>
        </div>
      </div>
    </div>
  );
}
