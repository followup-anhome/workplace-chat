"use client";
import { useState } from "react";

export default function NameSetup({ onDone }: { onDone: (name: string, role: "jp" | "en") => void }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState<"jp" | "en">("jp");

  return (
    <div style={{minHeight:"100vh", background:"#f0f4f8", display:"flex", alignItems:"center", justifyContent:"center", padding:"16px"}}>
      <div style={{background:"#ffffff", borderRadius:"20px", boxShadow:"0 4px 24px rgba(0,0,0,0.10)", padding:"40px 32px", width:"100%", maxWidth:"360px"}}>
        <div style={{textAlign:"center", marginBottom:"32px"}}>
          <div style={{fontSize:"40px", marginBottom:"12px"}}>🤝</div>
          <h1 style={{fontSize:"22px", fontWeight:"700", color:"#1a1a2e", margin:"0 0 4px"}}>Workplace Chat</h1>
          <p style={{fontSize:"13px", color:"#6b7280", margin:"0"}}>職場チャット — AI翻訳</p>
        </div>

        <div style={{marginBottom:"20px"}}>
          <label style={{display:"block", fontSize:"13px", fontWeight:"600", color:"#374151", marginBottom:"8px"}}>
            あなたの名前 / Your name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && name.trim() && onDone(name.trim(), role)}
            placeholder="例: 田中 / Juan"
            style={{
              width:"100%", padding:"12px 16px", borderRadius:"12px",
              border:"2px solid #e5e7eb", fontSize:"15px",
              color:"#1a1a2e", background:"#ffffff",
              outline:"none", boxSizing:"border-box",
              fontFamily:"inherit"
            }}
            onFocus={e => e.target.style.borderColor = "#2563eb"}
            onBlur={e => e.target.style.borderColor = "#e5e7eb"}
          />
        </div>

        <div style={{marginBottom:"28px"}}>
          <label style={{display:"block", fontSize:"13px", fontWeight:"600", color:"#374151", marginBottom:"8px"}}>
            言語 / Language
          </label>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px"}}>
            <button
              onClick={() => setRole("jp")}
              style={{
                padding:"12px", borderRadius:"12px", fontSize:"14px", fontWeight:"600",
                border: role === "jp" ? "2px solid #2563eb" : "2px solid #e5e7eb",
                background: role === "jp" ? "#2563eb" : "#ffffff",
                color: role === "jp" ? "#ffffff" : "#6b7280",
                cursor:"pointer", transition:"all 0.15s"
              }}
            >🇯🇵 日本語</button>
            <button
              onClick={() => setRole("en")}
              style={{
                padding:"12px", borderRadius:"12px", fontSize:"14px", fontWeight:"600",
                border: role === "en" ? "2px solid #2563eb" : "2px solid #e5e7eb",
                background: role === "en" ? "#2563eb" : "#ffffff",
                color: role === "en" ? "#ffffff" : "#6b7280",
                cursor:"pointer", transition:"all 0.15s"
              }}
            >🌏 English</button>
          </div>
        </div>

        <button
          onClick={() => name.trim() && onDone(name.trim(), role)}
          disabled={!name.trim()}
          style={{
            width:"100%", padding:"14px", borderRadius:"12px",
            fontSize:"15px", fontWeight:"700",
            background: name.trim() ? "#2563eb" : "#d1d5db",
            color:"#ffffff", border:"none",
            cursor: name.trim() ? "pointer" : "not-allowed",
            transition:"all 0.15s"
          }}
        >
          次へ → / Next →
        </button>
      </div>
    </div>
  );
}
