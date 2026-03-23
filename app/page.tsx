"use client";
import { useState, useRef, useEffect } from "react";

type Message = {
  id: number;
  role: "jp" | "en";
  original: string;
  translation: string;
  translating: boolean;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "jp", original: "おはようございます！今日もよろしくお願いします。", translation: "Good morning! I'm counting on you again today.", translating: false },
    { id: 2, role: "en", original: "Good morning! Ready to work hard today.", translation: "おはようございます！今日も頑張ります。", translating: false },
  ]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"jp" | "en">("jp");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setSending(true);
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const id = Date.now();
    const newMsg: Message = { id, role: mode, original: text, translation: "", translating: true };
    setMessages(prev => [...prev, newMsg]);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode }),
      });
      const data = await res.json();
      setMessages(prev =>
        prev.map(m => m.id === id ? { ...m, translation: data.translated || "(translation failed)", translating: false } : m)
      );
    } catch {
      setMessages(prev =>
        prev.map(m => m.id === id ? { ...m, translation: "(error)", translating: false } : m)
      );
    }
    setSending(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shadow-sm">
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg flex-shrink-0">🤝</div>
        <div>
          <div className="font-semibold text-gray-900 text-sm">Workplace Chat — 職場チャット</div>
          <div className="text-xs text-gray-500">日本語 ⇄ English（AI自動翻訳）</div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex flex-col gap-1 max-w-[80%] ${msg.role === "jp" ? "ml-auto items-end" : "items-start"}`}>
            <span className="text-[11px] text-gray-400 px-1">
              {msg.role === "jp" ? "🇯🇵 Japanese" : "🌏 English"}
            </span>
            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
              msg.role === "jp"
                ? "bg-blue-600 text-white rounded-br-sm"
                : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
            }`}>
              {msg.original}
            </div>
            <div className="text-xs text-gray-500 bg-gray-100 rounded-xl px-3 py-1.5 max-w-full leading-relaxed">
              {msg.translating ? (
                <span className="flex gap-1 items-center">
                  <span className="animate-bounce">·</span>
                  <span className="animate-bounce" style={{animationDelay:"0.1s"}}>·</span>
                  <span className="animate-bounce" style={{animationDelay:"0.2s"}}>·</span>
                </span>
              ) : msg.translation}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 space-y-2">
        <div className="flex gap-2">
          <button
            onClick={() => setMode("jp")}
            className={`text-xs px-4 py-1.5 rounded-full border transition-all ${mode === "jp" ? "bg-blue-600 text-white border-blue-600 font-medium" : "text-gray-500 border-gray-300"}`}
          >🇯🇵 日本語</button>
          <button
            onClick={() => setMode("en")}
            className={`text-xs px-4 py-1.5 rounded-full border transition-all ${mode === "en" ? "bg-blue-600 text-white border-blue-600 font-medium" : "text-gray-500 border-gray-300"}`}
          >🌏 English</button>
        </div>
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKey}
            placeholder={mode === "jp" ? "メッセージを入力..." : "Type a message..."}
            rows={1}
            className="flex-1 resize-none rounded-2xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-gray-50"
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
