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

type Translations = { en?: string; ja?: string; tl?: string };

const ROOM_LABELS: Record<string, string> = {
  "followup-team": "🏢 Follow Up Team",
  "karl-design":   "🎨 Design / Karl",
  "anna-global":   "🌏 Global / Anna",
  "shimizu-arch":  "🏗️ Architecture / Shimizu",
  "walkin-support": "💻 Walk in Home サポート",
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
      // Walk in Homeサポートルームは専用AIを使用
      if (room === "walkin-support") {
        const res = await fetch("/api/walkin-support", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
        });
        const data = await res.json();
        await supabase.from("messages").insert({
          room, sender: name, role,
          original: text,
          translation: JSON.stringify({ en: data.reply, ja: "" }),
        });
        setSending(false);
        return;
      }

      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();

      // 3言語翻訳をJSONとして保存
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

  // 翻訳データをパース
  const parseTranslations = (msg: Message): Translations => {
    try {
      return JSON.parse(msg.translation) as Translations;
    } catch {
      return {};
    }
  };

  // 送信者の言語を推定してフラグ表示
  const getLangFlag = (msg: Message) => {
    const t = parseTranslations(msg);
    if (t.ja && msg.original === t.ja) return "🇯🇵";
    if (t.tl && msg.original === t.tl) return "🇵🇭";
    return "🌏";
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100dvh",
      maxWidth: "500px", margin: "0 auto", backgroundColor: "#f3f4f6"
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1a3a5c, #1d4ed8)",
        padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px", flexShrink: 0
      }}>
        <button onClick={onBack} style={{ color: "white", fontSize: "20px", background: "none", border: "none", cursor: "pointer" }}>←</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: "white", fontWeight: 700, fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {ROOM_LABELS[room] || `🏷️ ${room}`}
          </div>
          <div style={{ color: "#bfdbfe", fontSize: "11px" }}>
            {name}
            {online > 0 && <span style={{ marginLeft: "8px", color: "#86efac" }}>● {online}人オンライン</span>}
          </div>
        </div>
        {/* 3言語バッジ */}
        <div style={{
          fontSize: "10px", color: "#bfdbfe", background: "rgba(255,255,255,0.1)",
          borderRadius: "8px", padding: "3px 8px", whiteSpace: "nowrap"
        }}>
          🇯🇵 🇺🇸 🇵🇭
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", color: "#9ca3af", fontSize: "13px", marginTop: "32px" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>💬</div>
            <p>メッセージを送ってください</p>
            <p style={{ fontSize: "11px", marginTop: "4px" }}>Send a message · Magpadala ng mensahe</p>
          </div>
        )}
        {messages.map(msg => {
          const isMe = msg.sender === name;
          const t = parseTranslations(msg);
          const flag = getLangFlag(msg);

          return (
            <div key={msg.id} style={{
              display: "flex", flexDirection: "column", gap: "3px",
              maxWidth: "85%", alignSelf: isMe ? "flex-end" : "flex-start",
              alignItems: isMe ? "flex-end" : "flex-start"
            }}>
              <span style={{ fontSize: "10px", color: "#9ca3af", padding: "0 4px" }}>
                {flag} {msg.sender}
              </span>

              {/* メッセージ + 削除ボタン */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "5px", flexDirection: isMe ? "row-reverse" : "row" }}>
                <div style={{
                  padding: "9px 13px",
                  borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  fontSize: "13px", lineHeight: "1.55", wordBreak: "break-word",
                  background: isMe ? "linear-gradient(135deg, #1d4ed8, #1a3a5c)" : "white",
                  color: isMe ? "white" : "#111827",
                  border: isMe ? "none" : "1px solid #e5e7eb",
                }}>
                  {msg.original}
                </div>
                {isMe && (
                  <button onClick={() => deleteMessage(msg.id)} style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: "13px", color: "#d1d5db", padding: "2px",
                    flexShrink: 0, marginTop: "6px",
                  }}>🗑️</button>
                )}
              </div>

              {/* 翻訳表示（日本語・英語のみ） */}
              {(t.ja || t.en) && (
                <div style={{
                  fontSize: "11px", color: "#374151",
                  backgroundColor: "#e5e7eb", borderRadius: "10px",
                  padding: "6px 10px", lineHeight: "1.7",
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
            placeholder="メッセージ / Message / Mensahe..."
            rows={1}
            style={{
              flex: 1, resize: "none", borderRadius: "20px",
              border: "2px solid #d1d5db", padding: "10px 16px",
              fontSize: "15px", color: "#111827", backgroundColor: "white",
              outline: "none", fontFamily: "inherit", minWidth: 0,
              WebkitTextFillColor: "#111827",
            }}
          />
          <button
            onClick={send}
            disabled={sending || !input.trim()}
            style={{
              width: "42px", height: "42px", borderRadius: "50%",
              background: sending || !input.trim() ? "#9ca3af" : "linear-gradient(135deg, #1d4ed8, #1a3a5c)",
              border: "none", cursor: sending || !input.trim() ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="white">
              <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
            </svg>
          </button>
        </div>
        <p style={{ fontSize: "9px", color: "#9ca3af", textAlign: "center", marginTop: "4px" }}>
          🇯🇵 日本語 · 🇺🇸 English · 🇵🇭 Tagalog — 自動翻訳 / Auto-translated
        </p>
      </div>
    </div>
  );
}
