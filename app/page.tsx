"use client";
import { useEffect, useState } from "react";
import Chat from "@/components/Chat";
import RoomSelect from "@/components/RoomSelect";
import NameSetup from "@/components/NameSetup";

export default function Home() {
  const [name, setName] = useState<string | null>(null);
  const [role, setRole] = useState<"jp" | "en">("jp");
  const [room, setRoom] = useState("");

  // localStorageから名前を復元（初回のみ）
  useEffect(() => {
    const savedName = localStorage.getItem("wc_name");
    const savedRole = localStorage.getItem("wc_role") as "jp" | "en" | null;
    if (savedName) {
      setName(savedName);
      if (savedRole) setRole(savedRole);
    } else {
      setName(""); // 未設定を空文字で表現
    }
  }, []);

  // ローディング中
  if (name === null) return null;

  // 名前未設定 → 名前入力画面
  if (name === "") return (
    <NameSetup onDone={(n, r) => {
      setName(n); setRole(r);
      localStorage.setItem("wc_name", n);
      localStorage.setItem("wc_role", r);
    }} />
  );

  // ルーム未選択 → ルーム選択画面
  if (!room) return (
    <RoomSelect name={name} onSelect={(r) => setRoom(r)} />
  );

  // チャット画面
  return <Chat name={name} role={role} room={room} onBack={() => setRoom("")} />;
}
