"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function NameSetup({ onDone }: { onDone: (name: string, role: "jp" | "en") => void }) {
  const [name, setName] = useState("");
  const [frame, setFrame] = useState(0);
  const flags = ["🇵🇭","🇯🇵","🇺🇸","🌏","🇵🇭","🇯🇵"];

  useEffect(() => {
    const id = setInterval(() => setFrame(f => (f + 1) % flags.length), 600);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(160deg, #1a3a5c 0%, #0ea5e9 45%, #1a3a5c 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px"
    }}>
      {/* ヘッダー */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>

        {/* フォローアップロゴ */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
          <Image src="/followup-logo.png" alt="Follow Up" width={64} height={64}
            style={{ borderRadius: "50%", border: "3px solid rgba(255,255,255,0.4)" }} />
        </div>

        <div style={{ fontSize: "13pt", fontWeight: 900, color: "white", fontFamily: "Helvetica, sans-serif", letterSpacing: "2px" }}>
          フォローアップ株式会社
        </div>
        <div style={{ fontSize: "9pt", color: "#bae6fd", fontFamily: "Helvetica, sans-serif", marginTop: "2px" }}>
          Follow Up Co., Ltd.
        </div>
        <div style={{ width: "40px", height: "2.5px", background: "#f59e0b", margin: "8px auto" }}></div>

        {/* イベントバッジ */}
        <div style={{
          background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.3)",
          borderRadius: "12px", padding: "8px 16px", marginBottom: "8px", display: "inline-block"
        }}>
          <div style={{ fontSize: "10pt", fontWeight: 700, color: "#fcd34d", fontFamily: "Helvetica, sans-serif" }}>
            🎉 Amagasaki Filipino Community
          </div>
          <div style={{ fontSize: "7.5pt", color: "#bae6fd", fontFamily: "Helvetica, sans-serif", marginTop: "2px" }}>
            March 28, 2026　尼崎市
          </div>
        </div>

        {/* フラグアニメーション */}
        <div style={{ display: "flex", justifyContent: "center", gap: "5px", marginBottom: "4px" }}>
          {flags.map((f, i) => (
            <span key={i} style={{ fontSize: i === frame ? "20pt" : "13pt", transition: "font-size 0.3s", opacity: i === frame ? 1 : 0.4 }}>{f}</span>
          ))}
        </div>
        <div style={{ fontSize: "8.5pt", color: "#bae6fd", fontFamily: "Helvetica, sans-serif" }}>
          🇵🇭 Tagalog ⇄ 🇯🇵 日本語 ⇄ 🇺🇸 English　AI翻訳
        </div>
      </div>

      {/* カード */}
      <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "22px 18px", width: "100%", maxWidth: "360px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ textAlign: "center", marginBottom: "14px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#1a3a5c", fontFamily: "Helvetica, sans-serif" }}>
            あなたの名前を入力してください
          </p>
          <p style={{ fontSize: "9px", color: "#9ca3af", fontFamily: "Helvetica, sans-serif", marginTop: "3px" }}>
            Enter your name · Ilagay ang iyong pangalan
          </p>
        </div>

        <div style={{ marginBottom: "14px" }}>
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && name.trim() && onDone(name.trim(), "en")}
            placeholder="例: Maria / 田中 / Juan"
            autoFocus
            style={{ width: "100%", padding: "13px 16px", borderRadius: "12px", border: "2px solid #d1d5db", fontSize: "16px", color: "#111827", backgroundColor: "white", outline: "none", boxSizing: "border-box", WebkitTextFillColor: "#111827", fontFamily: "Helvetica, sans-serif" }}
          />
        </div>

        <button onClick={() => name.trim() && onDone(name.trim(), "en")} disabled={!name.trim()}
          style={{ width: "100%", padding: "13px", background: name.trim() ? "linear-gradient(135deg, #0ea5e9, #1a3a5c)" : "#d1d5db", color: "white", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 700, cursor: name.trim() ? "pointer" : "not-allowed", fontFamily: "Helvetica, sans-serif" }}>
          入室する / Enter →
        </button>
      </div>

      <div style={{ marginTop: "12px", textAlign: "center" }}>
        <p style={{ fontSize: "8px", color: "#bae6fd", fontFamily: "Helvetica, sans-serif" }}>
          Philippine and Japan Cross Linking
        </p>
      </div>
    </div>
  );
}
