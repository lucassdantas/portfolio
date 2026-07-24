"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

// O painel (dados do fluxo, motor de estado, textos) só baixa quando o
// usuário clica na bolha — nada disso entra no bundle inicial da página.
const ChatPanel = dynamic(() => import("./ChatPanel").then((m) => m.ChatPanel), { ssr: false });

/** Bolha flutuante que abre o assistente do portfólio. Leve: só o botão fica no bundle inicial. */
export function ChatWidget() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <ChatPanel onClose={() => setOpen(false)} />}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t.chat.closeLabel : t.chat.launcher}
        aria-expanded={open}
        className="fixed bottom-6 right-4 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-accent text-2xl text-white shadow-[0_10px_30px_rgba(0,0,0,.35)] transition-transform hover:scale-105 sm:right-6"
      >
        {open ? "✕" : "💬"}
      </button>
    </>
  );
}
