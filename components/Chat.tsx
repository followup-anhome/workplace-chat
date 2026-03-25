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
  const [online, setOnline] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      .on("postgres_changes", {
        event: "DELETE", schema: "public", table: "messages",
        filter: `room=eq.${room}`
      }, (payload) => {
        setMessages(prev => prev.filter(m => m.id !== payload.old.id));
      })
      .on("presence", { event: "sync" }, () => {
        setOnline(Object.keys(channel.presenceState()).length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ name, role });
        }
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
      // JSON形式（新）またはstring形式（旧）に対応
      const translationStr = data.translations
        ? JSON.stringify(data.translations)
        : data.translated || "";
      await supabase.from("messages").insert({
        room, sender: name, role,
        original: text,
        translation: translationStr,
      });
    } catch (e) {
      console.error(e);
    }
    setSending(false);
  };

  const deleteMessage = async (id: string) => {
    await supabase.from("messages").delete().eq("id", id);
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const roomLabel: Record<string, string> = {
    "uno-demo": "🌐 UNO Demo Room",
    "genba-1": "🏗️ 現場A / Site A",
    "genba-2": "🏠 現場B / Site B",
    "souko": "📦 倉庫 / Warehouse",
    "jimu": "🏢 事務所 / Office",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", maxWidth: "500px", margin: "0 auto", backgroundColor: "#f3f4f6" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#1d4ed8", padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
        <button onClick={onBack} style={{ color: "white", fontSize: "20px", background: "none", border: "none", cursor: "pointer", padding: "0 4px" }}>←</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: "white", fontWeight: 600, fontSize: "14px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {roomLabel[room] || `🏷️ ${room}`}
          </div>
          <div style={{ color: "#bfdbfe", fontSize: "12px" }}>
            {name} · {role === "jp" ? "🇯🇵 日本語" : "🌏 English"}
            {online > 0 && <span style={{ marginLeft: "8px", color: "#86efac" }}>● {online}人オンライン</span>}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", color: "#9ca3af", fontSize: "14px", marginTop: "32px" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>💬</div>
            まだメッセージがありません<br/>No messages yet
          </div>
        )}
        {messages.map(msg => {
          const isMe = msg.sender === name;
          const isJp = msg.role === "jp";
          return (
            <div key={msg.id} style={{ display: "flex", flexDirection: "column", gap: "4px", maxWidth: "80%", alignSelf: isMe ? "flex-end" : "flex-start", alignItems: isMe ? "flex-end" : "flex-start" }}>
              <span style={{ fontSize: "11px", color: "#9ca3af", padding: "0 4px" }}>
                {isJp ? "🇯🇵" : "🌏"} {msg.sender}
              </span>
              {/* Message + Delete button */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "6px", flexDirection: isMe ? "row-reverse" : "row" }}>
                <div style={{
                  padding: "10px 14px",
                  borderRadius: isJp ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  fontSize: "14px",
                  lineHeight: "1.55",
                  wordBreak: "break-word",
                  backgroundColor: isJp ? "#1d4ed8" : "white",
                  color: isJp ? "white" : "#111827",
                  border: isJp ? "none" : "1px solid #e5e7eb",
                }}>
                  {msg.original}
                </div>
                {/* ゴミ箱ボタン（自分のメッセージのみ） */}
                {isMe && (
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "14px",
                      color: "#d1d5db",
                      padding: "2px",
                      flexShrink: 0,
                      lineHeight: 1,
                      marginTop: "8px",
                    }}
                    title="削除 / Delete"
                  >🗑️</button>
                )}
              </div>
              {msg.translation && (() => {
                // JSON形式（新）またはstring形式（旧）に対応
                try {
                  const t = JSON.parse(msg.translation);
                  return (
                    <div style={{
                      fontSize: "12px", color: "#374151",
                      backgroundColor: "#e5e7eb", borderRadius: "10px",
                      padding: "5px 10px", lineHeight: "1.6",
                      wordBreak: "break-word", maxWidth: "100%",
                    }}>
                      {t.ja && msg.original !== t.ja && <div>🇯🇵 {t.ja}</div>}
                      {t.en && msg.original !== t.en && <div>🇺🇸 {t.en}</div>}
                    </div>
                  );
                } catch {
                  return (
                    <div style={{
                      fontSize: "12px", color: "#374151",
                      backgroundColor: "#e5e7eb", borderRadius: "10px",
                      padding: "5px 10px", lineHeight: "1.45",
                      wordBreak: "break-word", maxWidth: "100%",
                    }}>
                      {msg.translation}
                    </div>
                  );
                }
              })()}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ backgroundColor: "white", borderTop: "1px solid #e5e7eb", padding: "12px 16px", flexShrink: 0 }}>
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
            placeholder={role === "jp" ? "メッセージを入力..." : "Type a message..."}
            rows={1}
            style={{
              flex: 1,
              resize: "none",
              borderRadius: "20px",
              border: "2px solid #d1d5db",
              padding: "10px 16px",
              fontSize: "16px",
              color: "#111827",
              backgroundColor: "white",
              outline: "none",
              fontFamily: "inherit",
              minWidth: 0,
              WebkitTextFillColor: "#111827",
            }}
          />
          <button
            onClick={send}
            disabled={sending || !input.trim()}
            style={{
              width: "44px", height: "44px",
              borderRadius: "50%",
              backgroundColor: sending || !input.trim() ? "#9ca3af" : "#1d4ed8",
              border: "none",
              cursor: sending || !input.trim() ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
