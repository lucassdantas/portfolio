"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { loadChatState, saveChatState, MAX_NAME_LENGTH } from "@/lib/chat";
import { chatReducer, initialChatState, getChatNode, type ChatAction } from "@/lib/chatEngine";
import { playSendSound, playReceiveSound } from "@/lib/sound";
import type { ChatOptionId } from "@/types";

const TYPING_DELAY_MS = 480;

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Painel do chatbot (carregado sob demanda por ChatWidget). Sempre dark, como Terminal/Playground. */
export function ChatPanel({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();
  const [state, dispatch] = useReducer(
    chatReducer,
    undefined,
    () => loadChatState() ?? initialChatState(t.chat)
  );
  const [isTyping, setIsTyping] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevLenRef = useRef(state.messages.length);

  // Só grava no localStorage; a leitura acontece uma vez, na inicialização acima (lazy).
  useEffect(() => {
    saveChatState(state);
  }, [state]);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [state.messages, isTyping]);

  // Som de recebimento sempre que o histórico cresce terminando numa fala do bot.
  useEffect(() => {
    const prevLen = prevLenRef.current;
    prevLenRef.current = state.messages.length;
    if (state.messages.length <= prevLen) return;
    const last = state.messages[state.messages.length - 1];
    if (last?.role === "bot") playReceiveSound();
  }, [state.messages]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (getChatNode(state.nodeId).kind === "input") inputRef.current?.focus();
  }, [state.nodeId]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function runWithTypingDelay(action: ChatAction) {
    playSendSound();
    const delay = prefersReducedMotion() ? 0 : TYPING_DELAY_MS;
    setIsTyping(true);
    timeoutRef.current = setTimeout(() => {
      dispatch(action);
      setIsTyping(false);
      timeoutRef.current = null;
    }, delay);
  }

  function handleSubmitName(e: React.FormEvent) {
    e.preventDefault();
    if (!nameInput.trim() || isTyping) return;
    runWithTypingDelay({ type: "submitName", value: nameInput, copy: t.chat });
    setNameInput("");
  }

  function handleSelectOption(id: ChatOptionId) {
    if (isTyping) return;
    runWithTypingDelay({ type: "selectOption", id, copy: t.chat });
  }

  function handleReset() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsTyping(false);
    dispatch({ type: "reset", copy: t.chat });
  }

  const node = getChatNode(state.nodeId);

  return (
    <div
      role="dialog"
      aria-label={t.chat.title}
      className="fixed bottom-24 right-4 z-50 flex h-[min(520px,70vh)] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-[#16233A] bg-[#060D18] shadow-[0_20px_60px_rgba(0,0,0,.5)] sm:right-6"
    >
      <div className="flex items-center gap-2 border-b border-[#16233A] bg-[#0B1524] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
        <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
        <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        <span className="ml-2 flex-1 truncate font-mono text-xs text-[#8C98AB]">{t.chat.title}</span>
        <button
          type="button"
          onClick={handleReset}
          aria-label={t.chat.resetLabel}
          title={t.chat.resetLabel}
          className="cursor-pointer rounded-md px-1.5 py-0.5 text-xs text-[#8C98AB] hover:text-[#E2E8F0]"
        >
          ↺
        </button>
      </div>

      <div
        ref={bodyRef}
        className="flex-1 space-y-2 overflow-y-auto p-3 font-mono text-[13px] leading-[1.55]"
      >
        {state.messages.map((m) => (
          <div key={m.id} className={"flex " + (m.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={
                "max-w-[85%] whitespace-pre-wrap break-words rounded-lg px-3 py-2 " +
                (m.role === "user" ? "bg-[#1D94E3] text-white" : "bg-[#16233A] text-[#E2E8F0]")
              }
            >
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="rounded-lg bg-[#16233A] px-3 py-2 text-[#8C98AB]">{t.chat.typing}</div>
          </div>
        )}
      </div>

      <div className="border-t border-[#16233A] p-3">
        {node.kind === "input" && (
          <form onSubmit={handleSubmitName} className="flex gap-2">
            <input
              ref={inputRef}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              maxLength={MAX_NAME_LENGTH}
              placeholder={t.chat.namePlaceholder}
              autoComplete="off"
              spellCheck={false}
              disabled={isTyping}
              className="min-w-0 flex-1 rounded-md border border-[#16233A] bg-[#0B1524] px-3 py-2 font-mono text-[13px] text-[#E2E8F0] outline-none focus:border-[#1D94E3]"
            />
            <button
              type="submit"
              aria-label={t.chat.sendLabel}
              disabled={isTyping || !nameInput.trim()}
              className="cursor-pointer rounded-md bg-[#1D94E3] px-3 py-2 text-[13px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              ➤
            </button>
          </form>
        )}
        {node.kind === "options" && (
          <div className="flex flex-wrap gap-2">
            {node.options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={isTyping}
                onClick={() => handleSelectOption(opt.id)}
                className="cursor-pointer rounded-full border border-[#16233A] bg-[#0B1524] px-3 py-1.5 text-[13px] text-[#E2E8F0] hover:border-[#1D94E3] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {opt.icon} {t.chat.optionLabels[opt.id]}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
