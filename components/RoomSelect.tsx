"use client";
import { useState } from "react";

const PRESET_ROOMS = [
  { id: "genba-1", label: "現場A / Site A", icon: "🏗️" },
  { id: "genba-2", label: "現場B / Site B", icon: "🏠" },
  { id: "souko",   label: "倉庫 / Warehouse", icon: "📦" },
  { id: "jimu",    label: "事務所 / Office", icon: "🏢" },
];

export default function RoomSelect({ name, onSelect }: { name: string; onSelect: (room: string) => void }) {
  const [custom, setCustom] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-sm">
        <div className="mb-6">
          <p className="text-sm text-gray-500">こんにちは / Hello, <span className="font-medium text-gray-800">{name}</span> 👋</p>
          <h2 className="text-lg font-semibold text-gray-900 mt-1">現場を選んでください<br/><span className="text-base font-normal text-gray-500">Select your room</span></h2>
        </div>

        <div className="space-y-2 mb-4">
          {PRESET_ROOMS.map(r => (
            <button
              key={r.id}
              onClick={() => onSelect(r.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
            >
              <span className="text-xl">{r.icon}</span>
              <span className="text-sm font-medium text-gray-800">{r.label}</span>
            </button>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-400 mb-2">カスタム / Custom room</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={custom}
              onChange={e => setCustom(e.target.value)}
              onKeyDown={e => e.key === "Enter" && custom.trim() && onSelect(custom.trim())}
              placeholder="部屋名を入力..."
              className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => custom.trim() && onSelect(custom.trim())}
              disabled={!custom.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm disabled:opacity-40"
            >→</button>
          </div>
        </div>
      </div>
    </div>
  );
}
