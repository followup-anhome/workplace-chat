"use client";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { BRAND, LANGUAGES, ROOMS, FEATURES, FOOTER_TEXT, MODE } from "@/lib/config";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Message = {
  id: string; sender_name: string; sender_lang: string;
  original_text: string; translations: Record<string, string> | string; created_at: string;
};

// 表示テキストを返す
// 自分のメッセージ → 原文のみ
// 他人のメッセージ → { main: 母国語訳, sub: 日本語訳 } (日本語ユーザーは母国語訳のみ)
function getDisplayText(msg: Message, viewerLang: string, isMe: boolean): { main: string; sub: string } {
  if (isMe) {
    return { main: msg.original_text, sub: "" };
  }
  let t: Record<string, string>;
  try {
    t = typeof msg.translations === "string" ? JSON.parse(msg.translations) : msg.translations;
  } catch {
    return { main: msg.original_text, sub: "" };
  }
  const v = (k: string) => (t[k] ?? "").trim();

  if (viewerLang === "ja") {
    // 日本語ユーザー：日本語訳のみ表示
    return { main: v("ja") || msg.original_text, sub: "" };
  }
  // 外国語ユーザー：母国語訳＋日本語訳の2行
  const native = v(viewerLang) || msg.original_text;
  const japanese = v("ja") || "";
  return { main: native, sub: japanese };
}

export default function Chat({ name, langCode, room, onBack }: {
  name: string; langCode: string; room: string; onBack: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState("");
  const [sending, setSending]   = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [online, setOnline]     = useState(0);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const brand    = BRAND[MODE];
  const features = FEATURES[MODE];
  const myLang   = LANGUAGES.find(l => l.code === langCode);
  const allRooms = ROOMS[MODE] as { id: string; label: string; icon: string }[];
  const roomLabel = allRooms.find(r => r.id === room)?.label || `🏷️ ${room}`;

  const fetchMessages = async () => {
    const { data } = await supabase.from("messages").select("*").eq("room", room)
      .order("created_at", { ascending: true }).limit(60);
    if (data) setMessages(data as Message[]);
  };

  useEffect(() => {
    fetchMessages();

    // Realtime
    const channel = supabase.channel(`room:${room}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `room=eq.${room}` },
        () => fetchMessages())
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "messages", filter: `room=eq.${room}` },
        () => fetchMessages())
      .on("presence", { event: "sync" }, () => setOnline(Object.keys(channel.presenceState()).length))
      .subscribe(async s => { if (s === "SUBSCRIBED") await channel.track({ name, langCode }); });

    // フォールバック：3秒ポーリング
    const timer = setInterval(fetchMessages, 3000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(timer);
    };
  }, [room, name, langCode]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setSendError(null);
    setInput(""); setSending(true);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    try {
      const res = await fetch("/api/translate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
      const data = await res.json() as { translations?: unknown; error?: string };
      if (!res.ok) {
        setSendError(
          typeof data.error === "string" ? data.error : "翻訳APIエラー (" + res.status + ")"
        );
        setInput(text);
        setSending(false);
        return;
      }
      if (!data.translations || typeof data.translations !== "object") {
        setSendError("翻訳結果を取得できませんでした");
        setInput(text);
        setSending(false);
        return;
      }
      const { error: insErr } = await supabase.from("messages").insert({
        room,
        sender_name: name,
        sender_lang: langCode,
        original_text: text,
        translations: data.translations,
      });
      if (insErr) {
        setSendError(insErr.message || "メッセージの保存に失敗しました");
        setInput(text);
      }
    } catch (e) {
      console.error(e);
      setSendError("送信に失敗しました");
      setInput(text);
    }
    setSending(false);
  };

  const handleKey = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

  const getSenderInfo = (msg: Message) => {
    const l = LANGUAGES.find(l => l.code === msg.sender_lang);
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
          const isMe = msg.sender_name === name;
          const { main: displayMain, sub: displaySub } = getDisplayText(msg, langCode, isMe);
          const { flag, label } = getSenderInfo(msg);
          return (
            <div key={msg.id} style={{ display: "flex", flexDirection: "column", gap: "3px", maxWidth: "85%", alignSelf: isMe ? "flex-end" : "flex-start", alignItems: isMe ? "flex-end" : "flex-start" }}>
              <span style={{ fontSize: "10px", color: "#9ca3af", padding: "0 4px" }}>
                {flag} {msg.sender_name}
                {!isMe && <span style={{ fontSize: "9px", color: "#9ca3af", marginLeft: "4px" }}>({label})</span>}
              </span>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "5px", flexDirection: isMe ? "row-reverse" : "row" }}>
                <div style={{ padding: "9px 13px", borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px", fontSize: "14px", lineHeight: "1.55", wordBreak: "break-word", background: isMe ? `linear-gradient(135deg, ${brand.accent}, ${brand.dark})` : "white", color: isMe ? "white" : "#111827", border: isMe ? "none" : "1px solid #e5e7eb" }}>
                  <div>{displayMain}</div>
                  {displaySub && (
                    <div style={{ fontSize: "12px", color: isMe ? "rgba(255,255,255,0.75)" : "#6b7280", marginTop: "4px", borderTop: isMe ? "1px solid rgba(255,255,255,0.2)" : "1px solid #e5e7eb", paddingTop: "4px" }}>
                      🇯🇵 {displaySub}
                    </div>
                  )}
                </div>
                {isMe && features.deleteMessage && (
                  <button onClick={() => deleteMessage(msg.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#d1d5db", padding: "2px", flexShrink: 0, marginTop: "6px" }}>🗑️</button>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ backgroundColor: "white", borderTop: "1px solid #e5e7eb", padding: "10px 14px", flexShrink: 0 }}>
        {sendError && (
          <p style={{ fontSize: "11px", color: "#b91c1c", marginBottom: "8px", lineHeight: 1.45 }}>{sendError}</p>
        )}
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
