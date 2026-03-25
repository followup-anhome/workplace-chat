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

type Translations = { ja?: string; en?: string; detected?: string };

const ROOM_LABELS: Record<string, string> = {
  "genba-a":   "🏗️ 現場A / Site A",
  "genba-b":   "🏠 現場B / Site B",
  "souko":     "📦 倉庫 / Warehouse",
  "kaigo":     "🤝 介護 / Care",
  "factory":   "🏭 工場 / Factory",
  "jimu":      "🏢 事務所 / Office",
  "demo-room": "🌐 DEMOルーム / Demo Room",
};

// 言語検出フラグ
const LANG_FLAG: Record<string, string> = {
  "Japanese": "🇯🇵", "English": "🇺🇸",
  "Tagalog": "🇵🇭", "Filipino": "🇵🇭", "Taglish": "🇵🇭",
  "Vietnamese": "🇻🇳", "Nepali": "🇳🇵",
  "Indonesian": "🇮🇩", "Burmese": "🇲🇲", "Myanmar": "🇲🇲",
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
          setMessages(prev => {
            if (prev.find(m => m.id === payload.new.id)) return prev;
            return [...prev, payload.new as Message];
          });
        })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "messages", filter: `room=eq.${room}` },
        (payload) => setMessages(prev => prev.filter(m => m.id !== payload.old.id)))
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      const translationStr = data.translations
        ? JSON.stringify(data.translations)
        : data.translated || "";
      await supabase.from("messages").insert({
        room, sender: name, role,
        original: text,
        translation: translationStr,
      });
    } catch (e) { console.error(e); }
    setSending(false);
  };

  const deleteMessage = async (id: string) => {
    await supabase.from("messages").delete().eq("id", id);
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const parseTranslations = (msg: Message): Translations => {
    try { return JSON.parse(msg.translation) as Translations; }
    catch { return {}; }
  };

  const getFlag = (msg: Message) => {
    const t = parseTranslations(msg);
    if (t.detected && LANG_FLAG[t.detected]) return LANG_FLAG[t.detected];
    return "💬";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", maxWidth: "500px", margin: "0 auto", backgroundColor: "#f3f4f6" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0f2d5c, #1d4ed8)", padding: "11px 16px", display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
        <button onClick={onBack} style={{ color: "white", fontSize: "20px", background: "none", border: "none", cursor: "pointer" }}>←</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: "white", fontWeight: 700, fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {ROOM_LABELS[room] || `🏷️ ${room}`}
          </div>
          <div style={{ color: "#bfdbfe", fontSize: "10px" }}>
            {name}
            {online > 0 && <span style={{ marginLeft: "7px", color: "#86efac" }}>● {online}人オンライン</span>}
          </div>
        </div>
        {/* 7言語バッジ */}
        <div style={{ fontSize: "10px", background: "rgba(255,255,255,0.12)", borderRadius: "8px", padding: "3px 8px", color: "#bfdbfe", whiteSpace: "nowrap" }}>
          🇯🇵🇺🇸🇵🇭🇻🇳🇳🇵🇮🇩🇲🇲
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", color: "#9ca3af", fontSize: "12px", marginTop: "30px" }}>
            <div style={{ fontSize: "28px", marginBottom: "6px" }}>💬</div>
            <p>どの言語でもメッセージを送れます</p>
            <p style={{ fontSize: "10px", marginTop: "3px", lineHeight: "1.8" }}>
              🇯🇵 日本語 · 🇺🇸 English · 🇵🇭 Tagalog<br/>
              🇻🇳 Việt · 🇳🇵 नेपाली · 🇮🇩 Indonesia · 🇲🇲 မြန်မာ
            </p>
          </div>
        )}

        {messages.map(msg => {
          const isMe = msg.sender === name;
          const t = parseTranslations(msg);
          const flag = getFlag(msg);

          return (
            <div key={msg.id} style={{
              display: "flex", flexDirection: "column", gap: "3px",
              maxWidth: "85%", alignSelf: isMe ? "flex-end" : "flex-start",
              alignItems: isMe ? "flex-end" : "flex-start"
            }}>
              <span style={{ fontSize: "10px", color: "#9ca3af", padding: "0 4px" }}>
                {flag} {msg.sender}
              </span>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "5px", flexDirection: isMe ? "row-reverse" : "row" }}>
                <div style={{
                  padding: "9px 13px",
                  borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  fontSize: "14px", lineHeight: "1.55", wordBreak: "break-word",
                  background: isMe ? "linear-gradient(135deg, #1d4ed8, #0f2d5c)" : "white",
                  color: isMe ? "white" : "#111827",
                  border: isMe ? "none" : "1px solid #e5e7eb",
                }}>
                  {msg.original}
                </div>
                {isMe && (
                  <button onClick={() => deleteMessage(msg.id)} style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: "13px", color: "#d1d5db", padding: "2px", flexShrink: 0, marginTop: "6px",
                  }}>🗑️</button>
                )}
              </div>

              {/* 翻訳表示：日本語 + 英語 */}
              {(t.ja || t.en) && (
                <div style={{
                  fontSize: "11px", color: "#374151", backgroundColor: "#e5e7eb",
                  borderRadius: "10px", padding: "5px 10px", lineHeight: "1.7",
                  wordBreak: "break-word", maxWidth: "100%",
                }}>
                  {t.ja && msg.original !== t.ja && <div>🇯🇵 {t.ja}</div>}
                  {t.en && msg.original !== t.en && <div>🇺🇸 {t.en}</div>}
                </div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ backgroundColor: "white", borderTop: "1px solid #e5e7eb", padding: "10px 14px", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => {
              setInput(e.target.value);
              e.currentTarget.style.height = "auto";
              e.currentTarget.style.height = Math.min(e.currentTarget.scrollHeight, 120) + "px";
            }}
            onKeyDown={handleKey}
            placeholder="🇯🇵日本語 · 🇺🇸English · 🇵🇭Tagalog · 🇻🇳Việt · 🇳🇵नेपाली · 🇮🇩Indonesia · 🇲🇲မြန်မာ"
            rows={1}
            style={{
              flex: 1, resize: "none", borderRadius: "20px",
              border: "2px solid #d1d5db", padding: "10px 16px",
              fontSize: "14px", color: "#111827", backgroundColor: "white",
              outline: "none", fontFamily: "inherit", minWidth: 0,
              WebkitTextFillColor: "#111827",
            }}
          />
          <button
            onClick={send}
            disabled={sending || !input.trim()}
            style={{
              width: "42px", height: "42px", borderRadius: "50%",
              background: sending || !input.trim() ? "#9ca3af" : "linear-gradient(135deg, #1d4ed8, #0f2d5c)",
              border: "none", cursor: sending || !input.trim() ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="white">
              <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
            </svg>
          </button>
        </div>
        <p style={{ fontSize: "8.5px", color: "#9ca3af", textAlign: "center", marginTop: "4px" }}>
          7言語 AI自動翻訳 · Powered by Claude AI
        </p>
      </div>
    </div>
  );
}
