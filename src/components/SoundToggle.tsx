"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const KEY = "ldp-sound";

/** O motor da trilha só é baixado quando alguém liga o som. */
const loadAmbient = () => import("@/lib/ambient").then((m) => m.ambient);

/**
 * Botão da trilha ambiente (src/lib/ambient.ts), fixo no canto inferior
 * esquerdo. Desligado: alto-falante mudo + play, com um anel pulsando que
 * convida ao clique. Ligado: alto-falante com ondas e o equalizador animado.
 * A escolha fica no localStorage; se a pessoa tinha deixado ligado, a trilha
 * volta no primeiro clique/tecla — navegador não deixa áudio tocar antes de
 * um gesto.
 */
export function SoundToggle() {
  const { t } = useLanguage();
  const [on, setOn] = useState(false);

  useEffect(() => {
    let wanted = false;
    try {
      wanted = localStorage.getItem(KEY) === "on";
    } catch {
      /* sem storage: fica desligado */
    }
    if (!wanted) return;
    const resume = () => {
      void loadAmbient().then(async (ambient) => {
        await ambient.start();
        setOn(ambient.playing);
      });
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
    };
    window.addEventListener("pointerdown", resume);
    window.addEventListener("keydown", resume);
    return () => {
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
    };
  }, []);

  const toggle = async () => {
    const ambient = await loadAmbient();
    if (on) {
      ambient.stop();
      setOn(false);
    } else {
      await ambient.start();
      setOn(ambient.playing);
    }
    try {
      localStorage.setItem(KEY, on ? "off" : "on");
    } catch {
      /* ignora */
    }
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? t.soundOff : t.soundOn}
      title={on ? t.soundOff : t.soundOn}
      className="fixed bottom-6 left-4 z-50 flex h-11 cursor-pointer items-center gap-2.5 rounded-full border border-bord bg-bg/80 pr-4 pl-3.5 backdrop-blur-[8px] transition-colors hover:border-accent sm:left-6"
    >
      {/* desligado: anel pulsando pede o clique */}
      {!on && <span aria-hidden className="absolute inset-0 animate-ping rounded-full border border-accent/50" />}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="relative h-[18px] w-[18px] flex-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M3.5 9.5v5H7l4.5 3.8V5.7L7 9.5H3.5z"
          fill="currentColor"
          stroke="none"
          className={on ? "text-accent" : "text-txt"}
        />
        {on ? (
          <>
            <path d="M15 9.2a4 4 0 0 1 0 5.6" className="text-accent" />
            <path d="M17.6 6.6a7.6 7.6 0 0 1 0 10.8" className="text-accent/60" />
          </>
        ) : (
          <path d="M15.5 9.5l5 5M20.5 9.5l-5 5" className="text-muted" />
        )}
      </svg>
      {on ? (
        <span aria-hidden className="flex h-3.5 items-end gap-[3px]">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="ld-eq w-[2px] rounded-full bg-accent"
              style={{ animationDelay: `${i * 0.18}s` }}
            />
          ))}
        </span>
      ) : (
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="relative h-[14px] w-[14px] flex-none text-accent"
          fill="currentColor"
        >
          <path d="M7 5.5v13l11-6.5z" />
        </svg>
      )}
    </button>
  );
}
