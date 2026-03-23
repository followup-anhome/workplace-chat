"use client";
import { useState } from "react";

export default function NameSetup({ onDone }: { onDone: (name: string, role: "jp" | "en") => void }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState<"jp" | "en">("jp");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🤝</div>
          <h1 className="text-xl font-semibold text-gray-900">Workplace Chat</h1>
          <p className="text-sm text-gray-500 mt-1">職場チャット — AI翻訳</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              あなたの名前 / Your name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && name.trim() && onDone(name.trim(), role)}
              placeholder="例: 田中 / Juan"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              言語 / Language
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setRole("jp")}
                className={`py-3 rounded-xl text-sm font-medium border transition-all ${role === "jp" ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600"}`}
              >🇯🇵 日本語</button>
              <button
                onClick={() => setRole("en")}
                className={`py-3 rounded-xl text-sm font-medium border transition-all ${role === "en" ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600"}`}
              >🌏 English</button>
            </div>
          </div>

          <button
            onClick={() => name.trim() && onDone(name.trim(), role)}
            disabled={!name.trim()}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium text-sm disabled:opacity-40 hover:bg-blue-700 transition-colors"
          >
            次へ → / Next →
          </button>
        </div>
      </div>
    </div>
  );
}
