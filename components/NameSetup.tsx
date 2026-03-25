"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const FLAGS = ["🇯🇵","🇵🇭","🇻🇳","🇳🇵","🇨🇳","🇮🇳","🇵🇰","🇩🇪","🇮🇩","🇲🇲","🇺🇸"];

export default function NameSetup({ onDone }: { onDone: (name: string, role: "jp" | "en") => void }) {
  const [name, setName] = useState("");
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFrame(f => (f + 1) % FLAGS.length), 700);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(160deg, #0c3547 0%, #1a6b8a 45%, #0c3547 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px"
    }}>

      {/* ヘッダー */}
      <div style={{ textAlign: "center", marginBottom: "18px" }}>

        {/* 学校ロゴエリア */}
        <div style={{
          background: "rgba(255,255,255,0.12)", borderRadius: "16px",
          padding: "12px 20px", marginBottom: "12px", border: "1px solid rgba(255,255,255,0.2)"
        }}>
          <div style={{ fontSize: "11pt", fontWeight: 900, color: "white", fontFamily: "Helvetica, sans-serif", letterSpacing: "1px" }}>
            🏫 泉佐野市立佐野中学校
          </div>
          <div style={{ fontSize: "9pt", color: "#bfdbfe", fontFamily: "Helvetica, sans-serif", marginTop: "2px" }}>
            夜間学級
          </div>
          <div style={{ width: "40px", height: "2px", background: "#f59e0b", margin: "6px auto" }}></div>
          <div style={{ fontSize: "8.5pt", color: "#e0f2fe", fontFamily: "Helvetica, sans-serif" }}>
            Izumisano City Sano Junior High School — Evening Class
          </div>
        </div>

        {/* フォローアップロゴ */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <Image src="/followup-logo.png" alt="Follow Up" width={44} height={44}
            style={{ borderRadius: "50%", border: "2px solid rgba(255,255,255,0.35)" }} />
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: "9pt", color: "white", fontWeight: 700, fontFamily: "Helvetica, sans-serif" }}>
              Workplace Chat
            </div>
            <div style={{ fontSize: "7.5pt", color: "#93c5fd", fontFamily: "Helvetica, sans-serif" }}>
              by フォローアップ株式会社
            </div>
          </div>
        </div>

        {/* フラグアニメーション */}
        <div style={{ display: "flex", justifyContent: "center", gap: "5px", marginBottom: "5px" }}>
          {FLAGS.map((flag, i) => (
            <span key={i} style={{
              fontSize: i === frame % FLAGS.length ? "18pt" : "12pt",
              transition: "font-size 0.3s",
              opacity: i === frame % FLAGS.length ? 1 : 0.45,
            }}>{flag}</span>
          ))}
        </div>
        <div style={{ fontSize: "8pt", color: "#93c5fd", fontFamily: "Helvetica, sans-serif" }}>
          11言語 AI自動翻訳対応
        </div>
      </div>

      {/* カード */}
      <div style={{
        backgroundColor: "white", borderRadius: "20px", padding: "22px 20px",
        width: "100%", maxWidth: "360px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
      }}>

        {/* 多言語歓迎メッセージ */}
        <div style={{
          backgroundColor: "#f0f9ff", borderRadius: "10px", padding: "10px 12px",
          marginBottom: "14px", border: "1px solid #bae6fd"
        }}>
          <p style={{ fontSize: "9px", color: "#0369a1", fontFamily: "Helvetica, sans-serif", lineHeight: "1.9", margin: 0, textAlign: "center" }}>
            ようこそ！ Welcome! Maligayang pagdating!<br/>
            Chào mừng! स्वागत छ! Selamat datang!<br/>
            ကြိုဆိုပါသည်! 欢迎! स्वागत है! خوش آمدید! Willkommen!
          </p>
        </div>

        <div style={{ textAlign: "center", marginBottom: "12px" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, color: "#0c3547", fontFamily: "Helvetica, sans-serif" }}>
            あなたの名前を入力してください
          </p>
          <p style={{ fontSize: "9px", color: "#9ca3af", fontFamily: "Helvetica, sans-serif", marginTop: "3px" }}>
            Enter your name · どの言語でも入力できます
          </p>
        </div>

        <div style={{ marginBottom: "14px" }}>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && name.trim() && onDone(name.trim(), "jp")}
            placeholder="例: 田中 / Maria / Nguyen / Ram"
            autoFocus
            style={{
              width: "100%", padding: "13px 16px", borderRadius: "12px",
              border: "2px solid #d1d5db", fontSize: "16px", color: "#111827",
              backgroundColor: "white", outline: "none", boxSizing: "border-box",
              WebkitTextFillColor: "#111827", fontFamily: "Helvetica, sans-serif",
            }}
          />
        </div>

        <button
          onClick={() => name.trim() && onDone(name.trim(), "jp")}
          disabled={!name.trim()}
          style={{
            width: "100%", padding: "13px",
            background: name.trim() ? "linear-gradient(135deg, #1a6b8a, #0c3547)" : "#d1d5db",
            color: "white", border: "none", borderRadius: "12px",
            fontSize: "15px", fontWeight: 700,
            cursor: name.trim() ? "pointer" : "not-allowed",
            fontFamily: "Helvetica, sans-serif",
          }}
        >
          入室する / Enter →
        </button>
      </div>

      {/* フッター */}
      <div style={{ marginTop: "12px", textAlign: "center" }}>
        <p style={{ fontSize: "8.5px", color: "#60a5fa", fontFamily: "Helvetica, sans-serif", margin: 0 }}>
          Powered by フォローアップ株式会社 · Philippine and Japan Cross Linking
        </p>
      </div>
    </div>
  );
}
