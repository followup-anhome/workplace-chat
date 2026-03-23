"use client";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Message = {
  id: string;
  sender: string;
  role: "jp" | "en";
  original: string;
  translation: string;
  created_at: string;
};

export default function Chat({ name, role, room, onBack }: {
  name: string; role: "jp" | "en"; room: string; onBack: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase
      .from("messages")
      .select("*")
      .eq("room", room)
      .order("created_at", { ascending: true })
      .limit(50)
      .then(({ data }) => { if (data) setMessages(data as Message[]); });

    const channel = supabase
      .channel(`room:${room}`)
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "messages",
        filter: `room=eq.${room}`
      }, (payload) => {
        setMessages(prev => {
          if (prev.find(m => m.id === payload.new.id)) return prev;
          return [...prev, payload.new as Message];
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [room]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode: role }),
      });
      const { translated } = await res.json();

      await supabase.from("messages").insert({
        room, sender: name, role,
        original: text,
        translation: translated || "",
      });
    } catch (e) {
      console.error(e);
    }
    setSending(false);
    inputRef.current?.focus();
  };

  const roomLabel: Record<string, string> = {
    "genba-1": "🏗️ 現場A", "genba-2": "🏠 現場B",
    "souko": "📦 倉庫", "jimu": "🏢 事務所",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: "#f9fafb" }}>
      {/* Header */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #e5e7eb",
        padding: "12px 16px", display: "flex", alignItems: "center", gap: 10,
        flexShrink: 0
      }}>
        <button onClick={onBack} style={{
          background: "none", border: "none", fontSize: 20,
          color: "#9ca3af", cursor: "pointer", padding: "0 4px"
        }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>
            {roomLabel[room] || `🏷️ ${room}`}
          </div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>
            {name} · {role === "jp" ? "🇯🇵 日本語" : "🌏 English"}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", color: "#9ca3af", fontSize: 14, marginTop: 32 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
            まだメッセージがありません<br />No messages yet
          </div>
        )}
        {messages.map(msg => {
          const isMe = msg.sender === name;
          const isJp = msg.role === "jp";
          return (
            <div key={msg.id} style={{
              display: "flex", flexDirection: "column", gap: 4,
              maxWidth: "80%", alignSelf: isMe ? "flex-end" : "flex-start",
              alignItems: isMe ? "flex-end" : "flex-start"
            }}>
              <span style={{ fontSize: 11, color: "#9ca3af", padding: "0 4px" }}>
                {isJp ? "🇯🇵" : "🌏"} {msg.sender}
              </span>
              <div style={{
                padding: "10px 14px",
                borderRadius: isJp ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                fontSize: 15, lineHeight: 1.5,
                background: isJp ? "#2563eb" : "#ffffff",
                color: isJp ? "#ffffff" : "#111827",
                border: isJp ? "none" : "1px solid #e5e7eb"
              }}>
                {msg.original}
              </div>
              {msg.translation && (
                <div style={{
                  fontSize: 12, color: "#6b7280",
                  background: "#f3f4f6", borderRadius: 10,
                  padding: "5px 10px", lineHeight: 1.4, maxWidth: "100%"
                }}>
                  {msg.translation}
                </div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input - スマホ対応 */}
      <div style={{
        background: "#fff", borderTop: "1px solid #e5e7eb",
        padding: "10px 12px",
        paddingBottom: "max(10px, env(safe-area-inset-bottom))",
        display: "flex", alignItems: "center", gap: 8,
        flexShrink: 0
      }}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") send(); }}
          placeholder={role === "jp" ? "メッセージを入力..." : "Type a message..."}
          style={{
            flex: 1,
            padding: "11px 16px",
            borderRadius: 24,
            border: "1.5px solid #d1d5db",
            fontSize: 16,
            color: "#111827",
            background: "#f9fafb",
            outline: "none",
            WebkitAppearance: "none",
          }}
        />
        <button
          onClick={send}
          disabled={sending || !input.trim()}
          style={{
            width: 44, height: 44, borderRadius: "50%",
            background: sending || !input.trim() ? "#93c5fd" : "#2563eb",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, transition: "background 0.15s"
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
