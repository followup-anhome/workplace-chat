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
  "followup-team":  "🏢 Follow Up Team",
  "karl-design":    "🎨 Design / Karl",
  "anna-global":    "🌏 Global / Anna",
  "shimizu-arch":   "🏗️ Architecture / Shimizu",
  "walkin-support": "💻 Walk in Home サポート",
};

export default function Chat({ name, role, room, onBack }: {
  name: string; role: "jp" | "en"; room: string; onBack: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [online, setOnline] = useState(0);
  const [aiTyping, setAiTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isWalkin = room === "walkin-support";

  useEffect(() => {
    // 初期メッセージ読み込み
    supabase
      .from("messages")
      .select("*")
      .eq("room", room)
      .order("created_at", { ascending: true })
      .limit(100)
      .then(({ data }) => { if (data) setMessages(data as Message[]); });

    const channel = supabase
      .channel(`room:${room}:${Date.now()}`)
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "messages",
        filter: `room=eq.${room}`
      }, (payload) => {
        setMessages(prev => {
          // 重複チェック（自分が送ったメッセージは既に楽観的に追加済みの場合がある）
          if (prev.find(m => m.id === payload.new.id)) return prev;
          return [...prev, payload.new as Message];
        });
      })
      // DELETEリスナーはローカル管理のみに変更（フィルタの不具合対策）
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
  }, [messages, aiTyping]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setSending(true);
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      if (isWalkin) {
        // ── Walk in Home AIチャット ──
        // 1) ユーザーメッセージをDBに保存
        await supabase.from("messages").insert({
          room,
          sender: name,
          role,
          original: text,
          translation: "",
        });

        // 2) AIタイピング表示ON
        setAiTyping(true);

        // 3) AI APIを呼ぶ
        const res = await fetch("/api/walkin-support", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
        });
        const data = await res.json();
        setAiTyping(false);

        // 4) AIの返信をDBに保存（別メッセージとして）
        if (data.reply) {
          await supabase.from("messages").insert({
            room,
            sender: "🤖 Walk in Home AI",
            role: "en",
            original: data.reply,
            translation: "",
          });
        } else {
          // エラー時のフォールバック
          await supabase.from("messages").insert({
            room,
            sender: "🤖 Walk in Home AI",
            role: "en",
            original: "⚠️ Sorry, I couldn't process your question. Please try again.\n\n⚠️ 申し訳ありません。もう一度お試しください。",
            translation: "",
          });
        }

      } else {
        // ── 通常翻訳チャット ──
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
      }
    } catch (e) {
      console.error(e);
      setAiTyping(false);
    }
    setSending(false);
  };

  // 削除：ローカルのみで管理（Supabase DELETEフィルタ不具合の回避）
  const deleteMessage = async (id: string) => {
    // まずローカルから削除（即時反映）
    setMessages(prev => prev.filter(m => m.id !== id));
    // バックグラウンドでDBからも削除
    try {
      await supabase.from("messages").delete().eq("id", id);
    } catch (e) {
      console.error("Delete error:", e);
      // 失敗してもUIは維持（次回リロード時に復活するがUXを優先）
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const parseTranslations = (msg: Message): Translations => {
    if (!msg.translation) return {};
    try {
      return JSON.parse(msg.translation) as Translations;
    } catch {
      return {};
    }
  };

  const getLangFlag = (msg: Message) => {
    if (msg.sender.startsWith("🤖")) return "🤖";
    const t = parseTranslations(msg);
    if (t.ja && msg.original === t.ja) return "🇯🇵";
    if (t.tl && msg.original === t.tl) return "🇵🇭";
    return "🌏";
  };

  const isAI = (msg: Message) => msg.sender.startsWith("🤖");

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100dvh",
      maxWidth: "500px", margin: "0 auto", backgroundColor: "#f3f4f6"
    }}>
      {/* Header */}
      <div style={{
        background: isWalkin
          ? "linear-gradient(135deg, #0c4a6e, #0891b2)"
          : "linear-gradient(135deg, #1a3a5c, #1d4ed8)",
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
        <div style={{
          fontSize: "10px", color: "white", background: "rgba(255,255,255,0.15)",
          borderRadius: "8px", padding: "3px 8px", whiteSpace: "nowrap"
        }}>
          {isWalkin ? "🤖 AI CAD支援" : "🇯🇵 🇺🇸 🇵🇭"}
        </div>
      </div>

      {/* Walk in Home AI 説明バナー */}
      {isWalkin && (
        <div style={{
          background: "linear-gradient(135deg, #ecfeff, #cffafe)",
          borderBottom: "1px solid #bae6fd",
          padding: "8px 16px",
          fontSize: "10.5px", color: "#0369a1", lineHeight: "1.6",
          flexShrink: 0,
        }}>
          <strong>💡 Karl専用 Walk in Home AIサポート</strong><br />
          CAD操作・日本建築基準・建築用語を英語で質問できます。<br />
          <span style={{ color: "#0891b2" }}>Ask anything about Walk in Home CAD, Japanese architecture, or building codes!</span>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {messages.length === 0 && !aiTyping && (
          <div style={{ textAlign: "center", color: "#9ca3af", fontSize: "13px", marginTop: "32px" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>{isWalkin ? "🤖" : "💬"}</div>
            {isWalkin ? (
              <>
                <p style={{ fontWeight: 600, color: "#0891b2" }}>Walk in Home AI Assistant</p>
                <p style={{ fontSize: "11px", marginTop: "4px" }}>Ask your first question in English!</p>
                <div style={{
                  marginTop: "16px", background: "#f0f9ff", borderRadius: "12px",
                  padding: "12px", border: "1px solid #bae6fd", textAlign: "left"
                }}>
                  <p style={{ fontSize: "10px", color: "#0369a1", margin: "0 0 6px", fontWeight: 700 }}>💡 試しに聞いてみよう / Try asking:</p>
                  {[
                    "How do I input walls in Walk in Home?",
                    "What is seismic grade 3 in Japan?",
                    "What is 確認申請 (building permit)?",
                    "How is Japanese wooden frame different from RC?",
                  ].map((q, i) => (
                    <button key={i} onClick={() => { setInput(q); textareaRef.current?.focus(); }}
                      style={{
                        display: "block", width: "100%", textAlign: "left",
                        background: "white", border: "1px solid #bae6fd",
                        borderRadius: "8px", padding: "6px 10px", marginBottom: "4px",
                        fontSize: "10px", color: "#0369a1", cursor: "pointer"
                      }}>
                      💬 {q}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p>メッセージを送ってください</p>
                <p style={{ fontSize: "11px", marginTop: "4px" }}>Send a message · Magpadala ng mensahe</p>
              </>
            )}
          </div>
        )}

        {messages.map(msg => {
          const isMe = msg.sender === name;
          const ai = isAI(msg);
          const t = parseTranslations(msg);
          const flag = getLangFlag(msg);

          return (
            <div key={msg.id} style={{
              display: "flex", flexDirection: "column", gap: "3px",
              maxWidth: ai ? "92%" : "85%",
              alignSelf: isMe ? "flex-end" : "flex-start",
              alignItems: isMe ? "flex-end" : "flex-start"
            }}>
              <span style={{ fontSize: "10px", color: ai ? "#0891b2" : "#9ca3af", padding: "0 4px" }}>
                {flag} {msg.sender}
              </span>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "5px", flexDirection: isMe ? "row-reverse" : "row" }}>
                <div style={{
                  padding: ai ? "12px 14px" : "9px 13px",
                  borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  fontSize: "13px", lineHeight: "1.7", wordBreak: "break-word",
                  background: ai
                    ? "linear-gradient(135deg, #ecfeff, #e0f2fe)"
                    : isMe
                    ? "linear-gradient(135deg, #1d4ed8, #1a3a5c)"
                    : "white",
                  color: isMe ? "white" : "#111827",
                  border: ai ? "1px solid #bae6fd" : isMe ? "none" : "1px solid #e5e7eb",
                  whiteSpace: "pre-wrap",
                }}>
                  {msg.original}
                </div>
                {isMe && !ai && (
                  <button onClick={() => deleteMessage(msg.id)} style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: "13px", color: "#d1d5db", padding: "2px",
                    flexShrink: 0, marginTop: "6px",
                  }}>🗑️</button>
                )}
              </div>

              {/* 翻訳表示（通常ルームのみ） */}
              {!isWalkin && (t.ja || t.en) && (
                <div style={{
                  fontSize: "11px", color: "#374151",
                  backgroundColor: "#e5e7eb", borderRadius: "10px",
                  padding: "6px 10px", lineHeight: "1.7",
                  wordBreak: "break-word", maxWidth: "100%",
                }}>
                  {t.ja &&  <div>🇯🇵 {t.ja}</div>}
                  {t.en && <div>🇺🇸 {t.en}</div>}
                </div>
              )}
            </div>
          );
        })}

        {/* AIタイピングインジケーター */}
        {aiTyping && (
          <div style={{
            alignSelf: "flex-start", display: "flex", flexDirection: "column", gap: "3px"
          }}>
            <span style={{ fontSize: "10px", color: "#0891b2", padding: "0 4px" }}>🤖 Walk in Home AI</span>
            <div style={{
              padding: "12px 16px",
              borderRadius: "16px 16px 16px 4px",
              background: "linear-gradient(135deg, #ecfeff, #e0f2fe)",
              border: "1px solid #bae6fd",
              display: "flex", gap: "4px", alignItems: "center"
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: "7px", height: "7px", borderRadius: "50%",
                  background: "#0891b2",
                  animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

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
            placeholder={isWalkin
              ? "Ask about Walk in Home, Japanese architecture... (English OK!)"
              : "メッセージ / Message / Mensahe..."}
            rows={1}
            style={{
              flex: 1, resize: "none", borderRadius: "20px",
              border: `2px solid ${isWalkin ? "#bae6fd" : "#d1d5db"}`,
              padding: "10px 16px",
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
              background: sending || !input.trim()
                ? "#9ca3af"
                : isWalkin
                ? "linear-gradient(135deg, #0891b2, #0c4a6e)"
                : "linear-gradient(135deg, #1d4ed8, #1a3a5c)",
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
          {isWalkin
            ? "🤖 Powered by Claude AI · Karl専用サポート"
            : "🇯🇵 日本語 · 🇺🇸 English · 🇵🇭 Tagalog — 自動翻訳 / Auto-translated"}
        </p>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
