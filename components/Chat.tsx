"use client";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { LANGUAGES } from "./NameSetup";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Message = {
  id: string;
  sender: string;
  lang_code: string;
  original: string;
  translation: string; // JSON文字列 {ja,en,tl,vi,...}
  created_at: string;
};

type Translations = Record<string, string>;

const ROOM_LABELS: Record<string, string> = {
  "class-all": "🏫 全体チャット / All Class",
  "kokugo":    "📖 国語",
  "sugaku":    "📐 数学",
  "rika":      "🔬 理科",
  "shakai":    "🌍 社会",
  "eigo":      "🗣️ 英語",
  "nichigo":   "✍️ 日本語教室",
};

export default function Chat({ name, langCode, room, onBack }: {
  name: string; langCode: string; room: string; onBack: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState("");
  const [sending, setSending]   = useState(false);
  const [online, setOnline]     = useState(0);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const myLang = LANGUAGES.find(l => l.code === langCode);

  useEffect(() => {
    supabase.from("messages").select("*").eq("room", room)
      .order("created_at", { ascending: true }).limit(60)
      .then(({ data }) => { if (data) setMessages(data as Message[]); });

    const channel = supabase.channel(`room:${room}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `room=eq.${room}` },
        payload => setMessages(prev =>
          prev.find(m => m.id === payload.new.id) ? prev : [...prev, payload.new as Message]
        ))
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "messages", filter: `room=eq.${room}` },
        payload => setMessages(prev => prev.filter(m => m.id !== payload.old.id)))
      .on("presence", { event: "sync" }, () => {
        setOnline(Object.keys(channel.presenceState()).length);
      })
      .subscribe(async status => {
        if (status === "SUBSCRIBED") await channel.track({ name, langCode });
      });

    return () => { supabase.removeChannel(channel); };
  }, [room, name, langCode]);

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
        : "{}";

      await supabase.from("messages").insert({
        room, sender: name,
        lang_code: langCode,
        role: "en", // 後方互換
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

  // 自分の言語に合わせた翻訳を返す
  const getMyTranslation = (msg: Message): string => {
    try {
      const t: Translations = JSON.parse(msg.translation);
      // 送信者と同じ言語なら翻訳不要
      if (msg.lang_code === langCode) return "";
      return t[langCode] || t["en"] || "";
    } catch { return ""; }
  };

  // 送信者のフラグ
  const getSenderFlag = (msg: Message) => {
    const l = LANGUAGES.find(l => l.code === msg.lang_code);
    return l ? l.flag : "💬";
  };

  // 送信者の言語ラベル
  const getSenderLang = (msg: Message) => {
    const l = LANGUAGES.find(l => l.code === msg.lang_code);
    return l ? l.label : "";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", maxWidth: "500px", margin: "0 auto", backgroundColor: "#f3f4f6" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0c3547, #1a6b8a)", padding: "11px 16px", display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
        <button onClick={onBack} style={{ color: "white", fontSize: "20px", background: "none", border: "none", cursor: "pointer" }}>←</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: "white", fontWeight: 700, fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {ROOM_LABELS[room] || `🏷️ ${room}`}
          </div>
          <div style={{ color: "#bfdbfe", fontSize: "10px" }}>
            {myLang?.flag} {name}（{myLang?.label}）
            {online > 0 && <span style={{ marginLeft: "7px", color: "#86efac" }}>● {online}人</span>}
          </div>
        </div>
        <div style={{ fontSize: "9px", background: "rgba(255,255,255,0.12)", borderRadius: "7px", padding: "3px 8px", color: "#bfdbfe" }}>
          {myLang?.flag} で表示中
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", color: "#9ca3af", fontSize: "12px", marginTop: "30px" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>💬</div>
            <p>あなたの言語でメッセージを送れます</p>
            <p style={{ fontSize: "10px", marginTop: "4px", color: "#bae6fd" }}>
              {myLang?.flag} {myLang?.label} で表示されます
            </p>
          </div>
        )}

        {messages.map(msg => {
          const isMe = msg.sender === name;
          const myTranslation = getMyTranslation(msg);
          const senderFlag = getSenderFlag(msg);
          const senderLang = getSenderLang(msg);

          return (
            <div key={msg.id} style={{
              display: "flex", flexDirection: "column", gap: "3px",
              maxWidth: "85%", alignSelf: isMe ? "flex-end" : "flex-start",
              alignItems: isMe ? "flex-end" : "flex-start",
            }}>
              {/* 送信者名・言語 */}
              <span style={{ fontSize: "10px", color: "#9ca3af", padding: "0 4px" }}>
                {senderFlag} {msg.sender}
                {!isMe && <span style={{ fontSize: "9px", color: "#bae6fd", marginLeft: "4px" }}>({senderLang})</span>}
              </span>

              {/* メッセージ本体 */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "5px", flexDirection: isMe ? "row-reverse" : "row" }}>
                <div style={{
                  padding: "9px 13px",
                  borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  fontSize: "14px", lineHeight: "1.55", wordBreak: "break-word",
                  background: isMe ? "linear-gradient(135deg, #1a6b8a, #0c3547)" : "white",
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

              {/* 翻訳：自分の母国語で表示（送信者と言語が違う場合のみ） */}
              {!isMe && myTranslation && (
                <div style={{
                  fontSize: "12px", color: "#374151",
                  backgroundColor: "#e0f2fe",
                  border: "1px solid #bae6fd",
                  borderRadius: "10px", padding: "6px 11px",
                  lineHeight: "1.6", wordBreak: "break-word", maxWidth: "100%",
                }}>
                  <span style={{ fontSize: "10px", color: "#0891b2", fontWeight: 700 }}>
                    {myLang?.flag} {myLang?.label}
                  </span>
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
            <div style={{ position: "absolute", top: "8px", left: "12px", fontSize: "14px", pointerEvents: "none" }}>
              {myLang?.flag}
            </div>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => {
                setInput(e.target.value);
                e.currentTarget.style.height = "auto";
                e.currentTarget.style.height = Math.min(e.currentTarget.scrollHeight, 120) + "px";
              }}
              onKeyDown={handleKey}
              placeholder={`${myLang?.label}で入力... / Type in ${myLang?.label}`}
              rows={1}
              style={{
                width: "100%", resize: "none", borderRadius: "20px",
                border: "2px solid #d1d5db", padding: "10px 16px 10px 34px",
                fontSize: "14px", color: "#111827", backgroundColor: "white",
                outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                WebkitTextFillColor: "#111827",
              }}
            />
          </div>
          <button
            onClick={send}
            disabled={sending || !input.trim()}
            style={{
              width: "42px", height: "42px", borderRadius: "50%",
              background: sending || !input.trim() ? "#9ca3af" : "linear-gradient(135deg, #1a6b8a, #0c3547)",
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
          🏫 佐野中学校 夜間学級 · 11言語 AI翻訳 · by フォローアップ株式会社
        </p>
      </div>
    </div>
  );
}
