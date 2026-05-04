"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Chat from "@/components/Chat";
import RoomSelect from "@/components/RoomSelect";
import NameSetup from "@/components/NameSetup";

type Step = "loading" | "name" | "room" | "chat";

export default function Home() {
  const [step, setStep] = useState<Step>("loading");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"jp" | "en">("jp");
  const [room, setRoom] = useState("");

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const savedName = localStorage.getItem("wc_name") ?? "";
    const savedRole = (localStorage.getItem("wc_role") ?? "jp") as "jp" | "en";
    setName(savedName);
    setRole(savedRole);
    setStep(savedName ? "room" : "name");
  // eslint-disable-next-line react-hooks/set-state-in-effect
  }, []); // eslint-disable-line react-hooks/set-state-in-effect

  if (step === "loading") return null;

  if (step === "name") return (
    <NameSetup onDone={(n, r) => {
      localStorage.setItem("wc_name", n);
      localStorage.setItem("wc_role", r);
      setName(n); setRole(r); setStep("room");
    }} />
  );

  if (step === "room") return (
    <RoomSelect name={name} onSelect={(r) => { setRoom(r); setStep("chat"); }} />
  );

  return <Chat name={name} role={role} room={room} onBack={() => setStep("room")} />;
}
