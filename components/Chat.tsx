"use client";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { BRAND, LANGUAGES, ROOMS, FEATURES, FOOTER_TEXT, MODE } from "@/lib/config";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Message = {
  id: string; sender: string; lang_code: string;
  original: string; translation: string; created_at: string;
};

export default function Chat({ name, langCode, room, onBack }: {
  name: string; langCode: string; room: string; onBack: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState("");
  const [sending, setSending]   = useState(false);
  const [online, setOnline]     = useState(0);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const brand    = BRAND[MODE];
  const features = FEATURES[MODE];
  const myLang   = LANGUAGES.find(l => l.code === langCode);
  const allRooms = ROOMS[MODE] as { id: string; label: string; icon: string }[];
  const roomLabel = allRooms.find(r => r.id === room)?.label || `🏷️ ${room}`;

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
      .subscribe(async s => { if (s === "SUBSCRIBED") await channel.track({ name, langCode }); });

    return () => { supabase.removeChannel(channel); };
  }, [room, name, langCode]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput(""); setSending(true);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    try {
      const res = await fetch("/api/translate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
      const data = await res.json();
      await supabase.from("messages").insert({ room, sender: name, lang_code: langCode, role: "en", original: text, translation: data.translations ? JSON.stringify(data.translations) : "{}" });
    } catch (e) { console.error(e); }
    setSending(false);
  };

  const handleKey = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

  const getMyTranslation = (msg: Message) => {
    try {
      const t = JSON.parse(msg.translation);
      if (msg.lang_code === langCode) return "";
      return t[langCode] || t["en"] || "";
    } catch { return ""; }
  };

  const getSenderInfo = (msg: Message) => {
    const l = LANGUAGES.find(l => l.code === msg.lang_code);
    return { flag: l?.flag || "💬", label: l?.label || "" };
  };

  const deleteMessage = async (id: string) => {
    await supabase.from("messages").delete().eq("id", id);
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", maxWidth: "500px", margin: "0 auto", backgroundColor: "#f3f4f6" }}>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${brand.dark}, ${brand.accent})`, padding: "11px 16px", display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
        <button onClick={onBack} style={{ color: "white", fontSize: "20px", background: "none", border: "none", cursor: "pointer" }}>←</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: "white", fontWeight: 700, fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{roomLabel}</div>
          <div style={{ color: "#bfdbfe", fontSize: "10px" }}>
            {myLang?.flag} {name}（{myLang?.label}）
            {features.onlineCount && online > 0 && <span style={{ marginLeft: "7px", color: "#86efac" }}>● {online}人</span>}
          </div>
        </div>
        <div style={{ fontSize: "9px", background: "rgba(255,255,255,0.12)", borderRadius: "7px", padding: "3px 8px", color: "#bfdbfe", whiteSpace: "nowrap" }}>{myLang?.flag} で表示中</div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", color: "#9ca3af", fontSize: "12px", marginTop: "30px" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>💬</div>
            <p>あなたの言語でメッセージを送れます</p>
            <p style={{ fontSize: "10px", marginTop: "4px", color: "#bfdbfe" }}>{myLang?.flag} {myLang?.label} で表示されます</p>
          </div>
        )}
        {messages.map(msg => {
          const isMe = msg.sender === name;
          const myTranslation = getMyTranslation(msg);
          const { flag, label } = getSenderInfo(msg);
          return (
            <div key={msg.id} style={{ display: "flex", flexDirection: "column", gap: "3px", maxWidth: "85%", alignSelf: isMe ? "flex-end" : "flex-start", alignItems: isMe ? "flex-end" : "flex-start" }}>
              <span style={{ fontSize: "10px", color: "#9ca3af", padding: "0 4px" }}>
                {flag} {msg.sender}
                {!isMe && <span style={{ fontSize: "9px", color: "#bfdbfe", marginLeft: "4px" }}>({label})</span>}
              </span>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "5px", flexDirection: isMe ? "row-reverse" : "row" }}>
                <div style={{ padding: "9px 13px", borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px", fontSize: "14px", lineHeight: "1.55", wordBreak: "break-word", background: isMe ? `linear-gradient(135deg, ${brand.accent}, ${brand.dark})` : "white", color: isMe ? "white" : "#111827", border: isMe ? "none" : "1px solid #e5e7eb" }}>
                  {msg.original}
                </div>
                {isMe && features.deleteMessage && (
                  <button onClick={() => deleteMessage(msg.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#d1d5db", padding: "2px", flexShrink: 0, marginTop: "6px" }}>🗑️</button>
                )}
              </div>
              {!isMe && myTranslation && (
                <div style={{ fontSize: "12px", color: "#374151", backgroundColor: "#dbeafe", border: "1px solid #bfdbfe", borderRadius: "10px", padding: "6px 11px", lineHeight: "1.6", wordBreak: "break-word", maxWidth: "100%" }}>
                  <span style={{ fontSize: "10px", color: brand.accent, fontWeight: 700 }}>{myLang?.flag} {myLang?.label}</span>
                  <div style={{ marginTop: "2px" }}>{myTranslation}</div>
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
          <div style={{ position: "relative", flex: 1 }}>
            <div style={{ position: "absolute", top: "10px", left: "12px", fontSize: "14px", pointerEvents: "none" }}>{myLang?.flag}</div>
            <textarea ref={textareaRef} value={input}
              onChange={e => { setInput(e.target.value); e.currentTarget.style.height = "auto"; e.currentTarget.style.height = Math.min(e.currentTarget.scrollHeight, 120) + "px"; }}
              onKeyDown={handleKey}
              placeholder={`${myLang?.label}で入力 / Type in ${myLang?.label}`}
              rows={1}
              style={{ width: "100%", resize: "none", borderRadius: "20px", border: "2px solid #d1d5db", padding: "10px 16px 10px 34px", fontSize: "14px", color: "#111827", backgroundColor: "white", outline: "none", fontFamily: "inherit", boxSizing: "border-box", WebkitTextFillColor: "#111827" }}
            />
          </div>
          <button onClick={send} disabled={sending || !input.trim()}
            style={{ width: "42px", height: "42px", borderRadius: "50%", background: sending || !input.trim() ? "#9ca3af" : `linear-gradient(135deg, ${brand.accent}, ${brand.dark})`, border: "none", cursor: sending || !input.trim() ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
          </button>
        </div>
        <p style={{ fontSize: "8.5px", color: "#9ca3af", textAlign: "center", marginTop: "4px" }}>{FOOTER_TEXT[MODE]}</p>
      </div>
    </div>
  );
}
