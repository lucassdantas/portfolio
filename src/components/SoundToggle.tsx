"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

/** O motor da trilha só é baixado quando alguém liga o som. */
const loadAmbient = () => import("@/lib/ambient").then((m) => m.ambient);

const KEY = "ldp-sound";

/**
 * Botão da trilha ambiente (src/lib/ambient.ts), fixo no canto inferior
 * esquerdo. Começa desligado; a escolha fica no localStorage. Se a pessoa
 * tinha deixado ligado, a trilha volta no primeiro clique/tecla — navegador
 * não deixa áudio tocar antes de um gesto.
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
      className="fixed bottom-6 left-4 z-50 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-bord bg-bg/80 backdrop-blur-[8px] transition-colors hover:border-accent sm:left-6"
    >
      <span aria-hidden className="flex h-3.5 items-end gap-[3px]">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`w-[2px] rounded-full bg-accent ${on ? "ld-eq" : ""}`}
            style={{ height: on ? undefined : "3px", animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </span>
    </button>
  );
}
