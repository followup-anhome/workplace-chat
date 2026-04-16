"use client";
import { useState } from "react";
import NameSetup from "@/components/NameSetup";
import RoomSelect from "@/components/RoomSelect";
import Chat from "@/components/Chat";
import { MODE } from "@/lib/config";

// unoとfollowupは言語選択不要（日本語+英語2段表示固定）
const SKIP_LANG_SELECT = MODE === "uno" || MODE === "followup";

export default function Home() {
  const [name, setName]     = useState("");
  const [langCode, setLang] = useState(SKIP_LANG_SELECT ? "ja" : "");
  const [room, setRoom]     = useState("");

  if (!name || (!SKIP_LANG_SELECT && !langCode)) {
    return <NameSetup onDone={(n, l) => { setName(n); setLang(l); }} skipLang={SKIP_LANG_SELECT} />;
  }
  if (!room) {
    return <RoomSelect name={name} langCode={langCode} onSelect={setRoom} />;
  }
  return <Chat name={name} langCode={langCode} room={room} onBack={() => setRoom("")} />;
}
