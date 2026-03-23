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
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const roomLabel: Record<string, string> = {
    "genba-1": "🏗️ 現場A / Site A",
    "genba-2": "🏠 現場B / Site B",
    "souko": "📦 倉庫 / Warehouse",
    "jimu": "🏢 事務所 / Office",
  };

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 text-xl w-8 flex-shrink-0">←</button>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 text-sm truncate">
            {roomLabel[room] || `🏷️ ${room}`}
          </div>
          <div className="text-xs text-gray-400 truncate">
            {name} · {role === "jp" ? "🇯🇵 日本語" : "🌏 English"}
            {online > 0 && <span className="ml-2 text-green-500">● {online}人オンライン</span>}
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 text-sm mt-8">
            <div className="text-3xl mb-2">💬</div>
            まだメッセージがありません<br/>No messages yet
          </div>
        )}
        {messages.map(msg => {
          const isMe = msg.sender === name;
          const isJp = msg.role === "jp";
          return (
            <div key={msg.id} className={`flex flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}
              style={{ maxWidth: "80%", alignSelf: isMe ? "flex-end" : "flex-start", width: "fit-content", marginLeft: isMe ? "auto" : "0" }}>
              <span className="text-xs text-gray-400 px-1">
                {isJp ? "🇯🇵" : "🌏"} {msg.sender}
              </span>
              <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
                isJp
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
              }`} style={{ maxWidth: "100%", wordBreak: "break-word" }}>
                {msg.original}
              </div>
              {msg.translation && (
                <div className="text-xs text-gray-500 bg-gray-100 rounded-xl px-3 py-1.5 leading-relaxed break-words"
                  style={{ maxWidth: "100%", wordBreak: "break-word" }}>
                  {msg.translation}
                </div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex gap-2 items-end">
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
            className="flex-1 resize-none rounded-2xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-gray-50"
            style={{ minWidth: 0 }}
          />
          <button
            onClick={send}
            disabled={sending || !input.trim()}
            className="w-10 h-10 rounded-full bg-blue-600 disabled:opacity-40 flex items-center justify-center flex-shrink-0 hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
