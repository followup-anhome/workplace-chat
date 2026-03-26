"use client";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Message = { id: string; sender: string; role: "jp" | "en"; original: string; translation: string; created_at: string; };
type T = { ja?: string; en?: string; tl?: string; detected?: string };

const ROOM_LABELS: Record<string, string> = {
  "event-hall": "🎉 イベント会場 / Event Hall",
  "community":  "💬 コミュニティ / Community",
};
const DETECTED_FLAG: Record<string, string> = {
  "Japanese":"🇯🇵","English":"🇺🇸","Tagalog":"🇵🇭","Taglish":"🇵🇭","Filipino":"🇵🇭",
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
      .order("created_at", { ascending: true }).limit(60)
      .then(({ data }) => { if (data) setMessages(data as Message[]); });

    const channel = supabase.channel(`room:${room}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `room=eq.${room}` },
        p => setMessages(prev => prev.find(m => m.id === p.new.id) ? prev : [...prev, p.new as Message]))
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "messages", filter: `room=eq.${room}` },
        p => setMessages(prev => prev.filter(m => m.id !== p.old.id)))
      .on("presence", { event: "sync" }, () => setOnline(Object.keys(channel.presenceState()).length))
      .subscribe(async s => { if (s === "SUBSCRIBED") await channel.track({ name, role }); });

    return () => { supabase.removeChannel(channel); };
  }, [room, name, role]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput(""); setSending(true);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    try {
      const res = await fetch("/api/translate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      await supabase.from("messages").insert({
        room, sender: name, role, original: text,
        translation: data.translations ? JSON.stringify(data.translations) : "{}",
      });
    } catch (e) { console.error(e); }
    setSending(false);
  };

  const handleKey = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };
  const parseT = (msg: Message): T => { try { return JSON.parse(msg.translation); } catch { return {}; } };
  const getFlag = (msg: Message) => { const t = parseT(msg); return (t.detected && DETECTED_FLAG[t.detected]) || "💬"; };
  const deleteMessage = async (id: string) => {
    await supabase.from("messages").delete().eq("id", id);
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", maxWidth: "500px", margin: "0 auto", backgroundColor: "#f0f9ff" }}>
      <div style={{ background: "linear-gradient(135deg, #1a3a5c, #0ea5e9)", padding: "11px 16px", display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
        <button onClick={onBack} style={{ color: "white", fontSize: "20px", background: "none", border: "none", cursor: "pointer" }}>←</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: "white", fontWeight: 700, fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {ROOM_LABELS[room] || `🏷️ ${room}`}
          </div>
          <div style={{ color: "#bae6fd", fontSize: "10px" }}>
            {name} {online > 0 && <span style={{ marginLeft: "7px", color: "#86efac" }}>● {online}人</span>}
          </div>
        </div>
        <div style={{ fontSize: "9px", background: "rgba(255,255,255,0.12)", borderRadius: "7px", padding: "3px 8px", color: "#bae6fd" }}>🇵🇭 🇯🇵 🇺🇸</div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", color: "#9ca3af", fontSize: "12px", marginTop: "30px" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>💬</div>
            <p>メッセージを送ってください</p>
            <p style={{ fontSize: "10px", marginTop: "4px" }}>🇵🇭 Tagalog · 🇯🇵 日本語 · 🇺🇸 English</p>
          </div>
        )}
        {messages.map(msg => {
          const isMe = msg.sender === name;
          const t = parseT(msg);
          const hasJa = !!(t.ja && t.ja.trim());
          const hasEn = !!(t.en && t.en.trim());
          return (
            <div key={msg.id} style={{ display: "flex", flexDirection: "column", gap: "3px", maxWidth: "85%", alignSelf: isMe ? "flex-end" : "flex-start", alignItems: isMe ? "flex-end" : "flex-start" }}>
              <span style={{ fontSize: "10px", color: "#9ca3af", padding: "0 4px" }}>{getFlag(msg)} {msg.sender}</span>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "5px", flexDirection: isMe ? "row-reverse" : "row" }}>
                <div style={{ padding: "9px 13px", borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px", fontSize: "14px", lineHeight: "1.55", wordBreak: "break-word", background: isMe ? "linear-gradient(135deg, #0ea5e9, #1a3a5c)" : "white", color: isMe ? "white" : "#111827", border: isMe ? "none" : "1px solid #e0f2fe" }}>
                  {msg.original}
                </div>
                {isMe && <button onClick={() => deleteMessage(msg.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#d1d5db", padding: "2px", flexShrink: 0, marginTop: "6px" }}>🗑️</button>}
              </div>
              {(hasJa || hasEn) && (
                <div style={{ fontSize: "11px", color: "#374151", backgroundColor: "#e0f2fe", borderRadius: "10px", padding: "6px 11px", lineHeight: "1.8", wordBreak: "break-word", maxWidth: "100%" }}>
                  {hasJa && <div>🇯🇵 {t.ja}</div>}
                  {hasEn && <div>🇺🇸 {t.en}</div>}
                </div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div style={{ backgroundColor: "white", borderTop: "1px solid #e0f2fe", padding: "10px 14px", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
          <textarea ref={textareaRef} value={input}
            onChange={e => { setInput(e.target.value); e.currentTarget.style.height = "auto"; e.currentTarget.style.height = Math.min(e.currentTarget.scrollHeight, 120) + "px"; }}
            onKeyDown={handleKey}
            placeholder="Tagalog / 日本語 / English..."
            rows={1}
            style={{ flex: 1, resize: "none", borderRadius: "20px", border: "2px solid #d1d5db", padding: "10px 16px", fontSize: "15px", color: "#111827", backgroundColor: "white", outline: "none", fontFamily: "inherit", minWidth: 0, WebkitTextFillColor: "#111827" }}
          />
          <button onClick={send} disabled={sending || !input.trim()}
            style={{ width: "42px", height: "42px", borderRadius: "50%", background: sending || !input.trim() ? "#9ca3af" : "linear-gradient(135deg, #0ea5e9, #1a3a5c)", border: "none", cursor: sending || !input.trim() ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
          </button>
        </div>
        <p style={{ fontSize: "8.5px", color: "#9ca3af", textAlign: "center", marginTop: "4px" }}>
          フォローアップ株式会社 · AI翻訳 · Philippine and Japan Cross Linking
        </p>
      </div>
    </div>
  );
}
