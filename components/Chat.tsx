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

const ROOM_LABELS: Record<string, string> = {
  "genba-1": "🏗️ 現場A / Site A",
  "genba-2": "🏠 現場B / Site B",
  "souko": "📦 倉庫 / Warehouse",
  "jimu": "🏢 事務所 / Office",
};

export default function Chat({ name, role, room, onBack }: {
  name: string; role: "jp" | "en"; room: string; onBack: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [online, setOnline] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    supabase.from("messages").select("*").eq("room", room)
      .order("created_at", { ascending: true }).limit(50)
      .then(({ data }) => { if (data) setMessages(data as Message[]); });

    const channel = supabase.channel(`room:${room}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `room=eq.${room}` },
        (payload) => {
          setMessages(prev => prev.find(m => m.id === payload.new.id) ? prev : [...prev, payload.new as Message]);
        }
      )
      .on("presence", { event: "sync" }, () => {
        setOnline(Object.keys(channel.presenceState()).length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") await channel.track({ name, role });
      });

    return () => { supabase.removeChannel(channel); };
  }, [room, name, role]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setSending(true);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    try {
      const res = await fetch("/api/translate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode: role }),
      });
      const { translated } = await res.json();
      await supabase.from("messages").insert({ room, sender: name, role, original: text, translation: translated || "" });
    } catch (e) { console.error(e); }
    setSending(false);
  };

  return (
    <div style={{display:"flex", flexDirection:"column", height:"100vh", background:"#f0f4f8"}}>
      {/* Header */}
      <div style={{background:"#ffffff", borderBottom:"1px solid #e5e7eb", padding:"12px 16px", display:"flex", alignItems:"center", gap:"12px", boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
        <button onClick={onBack} style={{background:"none", border:"none", fontSize:"20px", cursor:"pointer", color:"#6b7280", padding:"0 4px"}}>←</button>
        <div style={{flex:1}}>
          <div style={{fontSize:"15px", fontWeight:"700", color:"#1a1a2e"}}>{ROOM_LABELS[room] || `🏷️ ${room}`}</div>
          <div style={{fontSize:"12px", color:"#6b7280"}}>
            {name} · {role === "jp" ? "🇯🇵 日本語" : "🌏 English"}
            {online > 0 && <span style={{color:"#16a34a", marginLeft:"8px"}}>● {online}人オンライン</span>}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{flex:1, overflowY:"auto", padding:"16px", display:"flex", flexDirection:"column", gap:"12px"}}>
        {messages.length === 0 && (
          <div style={{textAlign:"center", color:"#9ca3af", fontSize:"14px", marginTop:"40px"}}>
            <div style={{fontSize:"32px", marginBottom:"8px"}}>💬</div>
            まだメッセージがありません / No messages yet
          </div>
        )}
        {messages.map(msg => {
          const isMe = msg.sender === name;
          const isJp = msg.role === "jp";
          return (
            <div key={msg.id} style={{display:"flex", flexDirection:"column", gap:"4px", maxWidth:"80%", alignSelf: isMe ? "flex-end" : "flex-start", alignItems: isMe ? "flex-end" : "flex-start"}}>
              <span style={{fontSize:"11px", color:"#9ca3af", padding:"0 4px"}}>
                {isJp ? "🇯🇵" : "🌏"} {msg.sender}
              </span>
              <div style={{
                padding:"10px 14px", borderRadius: isJp ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                fontSize:"14px", lineHeight:"1.5",
                background: isJp ? "#2563eb" : "#ffffff",
                color: isJp ? "#ffffff" : "#1a1a2e",
                border: isJp ? "none" : "1px solid #e5e7eb",
                boxShadow:"0 1px 3px rgba(0,0,0,0.08)"
              }}>
                {msg.original}
              </div>
              {msg.translation && (
                <div style={{fontSize:"12px", color:"#6b7280", background:"#ffffff", border:"1px solid #e5e7eb", borderRadius:"10px", padding:"6px 12px", lineHeight:"1.4"}}>
                  {msg.translation}
                </div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{background:"#ffffff", borderTop:"1px solid #e5e7eb", padding:"12px 16px", boxShadow:"0 -1px 4px rgba(0,0,0,0.06)"}}>
        <div style={{display:"flex", gap:"8px", alignItems:"flex-end"}}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => { setInput(e.target.value); e.currentTarget.style.height = "auto"; e.currentTarget.style.height = Math.min(e.currentTarget.scrollHeight, 120) + "px"; }}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={role === "jp" ? "メッセージを入力..." : "Type a message..."}
            rows={1}
            style={{
              flex:1, resize:"none", borderRadius:"20px",
              border:"2px solid #e5e7eb", padding:"10px 16px",
              fontSize:"14px", color:"#1a1a2e", background:"#f9fafb",
              outline:"none", fontFamily:"inherit", lineHeight:"1.5"
            }}
            onFocus={e => e.target.style.borderColor = "#2563eb"}
            onBlur={e => e.target.style.borderColor = "#e5e7eb"}
          />
          <button
            onClick={send}
            disabled={sending || !input.trim()}
            style={{
              width:"44px", height:"44px", borderRadius:"50%", border:"none",
              background: (sending || !input.trim()) ? "#d1d5db" : "#2563eb",
              color:"#ffffff", cursor: (sending || !input.trim()) ? "not-allowed" : "pointer",
              display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
              fontSize:"18px", transition:"all 0.15s"
            }}
          >
            {sending ? "⏳" : "➤"}
          </button>
        </div>
      </div>
    </div>
  );
}
