"use client";
import { useEffect, useState } from "react";
import Chat from "@/components/Chat";
import RoomSelect from "@/components/RoomSelect";
import NameSetup from "@/components/NameSetup";

export default function Home() {
  const [name, setName] = useState("");
  const [role, setRole] = useState<"jp" | "en">("jp");
  const [room, setRoom] = useState("");
  const [step, setStep] = useState<"name" | "room" | "chat">("name");

  useEffect(() => {
    const saved = localStorage.getItem("wc_name");
    const savedRole = localStorage.getItem("wc_role") as "jp" | "en" | null;
    if (saved) { setName(saved); setRole(savedRole || "jp"); setStep("room"); }
  }, []);

  if (step === "name") return <NameSetup onDone={(n, r) => {
    setName(n); setRole(r);
    localStorage.setItem("wc_name", n);
    localStorage.setItem("wc_role", r);
    setStep("room");
  }} />;
  if (step === "room") return <RoomSelect name={name} onSelect={(r) => { setRoom(r); setStep("chat"); }} />;
  return <Chat name={name} role={role} room={room} onBack={() => setStep("room")} />;
}
