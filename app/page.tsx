"use client";
import { useState } from "react";
import NameSetup from "@/components/NameSetup";
import RoomSelect from "@/components/RoomSelect";
import Chat from "@/components/Chat";

export default function Home() {
  const [name, setName]     = useState("");
  const [langCode, setLang] = useState("");
  const [room, setRoom]     = useState("");

  if (!name || !langCode) {
    return <NameSetup onDone={(n, l) => { setName(n); setLang(l); }} />;
  }
  if (!room) {
    return <RoomSelect name={name} langCode={langCode} onSelect={setRoom} />;
  }
  return <Chat name={name} langCode={langCode} room={room}
    onBack={() => setRoom("")} />;
}
