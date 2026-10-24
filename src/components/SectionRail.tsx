"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { revealForNav, settleAnchor } from "@/lib/nav";
import { useActiveSection } from "@/lib/useActiveSection";

const SECTIONS = [
  { id: "top", key: "navAbout" as const },
  { id: "manifesto", key: "secManifesto" as const },
  { id: "stack", key: "navStack" as const },
  { id: "experiencia", key: "navExp" as const },
  { id: "case", key: "featured" as const },
  { id: "sistemas", key: "sysTitle" as const },
  { id: "projetos", key: "navProj" as const },
  { id: "github", label: "GitHub" },
  { id: "terminal", key: "navTerm" as const },
  { id: "playground", label: "Playground" },
  { id: "educacao", key: "navEdu" as const },
  { id: "contato", key: "navContact" as const },
];
const IDS = SECTIONS.map((s) => s.id);
/** Quanto tempo o nome da seção fica visível depois de entrar nela. */
const FLASH_MS = 2200;

/**
 * Trilha vertical de seções, fixa à direita — só em telas ≥1100px.
 * Ocupa só a largura das linhas (o `page.tsx` reserva esse respiro à direita).
 * Ao entrar numa seção, o traço dela fica azul e o nome aparece por alguns
 * segundos, no idioma ativo; fora isso o rótulo só aparece em hover/foco. O
 * rótulo nunca captura clique, então não bloqueia o conteúdo por baixo.
 */
export function SectionRail() {
  const { t } = useLanguage();
  const active = useActiveSection(IDS) ?? "top";
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    setFlash(active);
    const id = setTimeout(() => setFlash(null), FLASH_MS);
    return () => clearTimeout(id);
  }, [active]);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    revealForNav();
    settleAnchor(el);
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  return (
    <nav
      aria-label={t.railLabel}
      className="fixed top-1/2 right-[clamp(10px,1.6vw,22px)] z-40 hidden w-6 -translate-y-1/2 flex-col gap-1.5 min-[1100px]:flex"
    >
      {SECTIONS.map((s) => {
        const on = active === s.id;
        const label = s.label ?? t[s.key];
        return (
          <button
            key={s.id}
            onClick={() => go(s.id)}
            aria-label={label}
            aria-current={on ? "location" : undefined}
            className="group relative flex h-5 w-6 cursor-pointer items-center justify-end border-0 bg-transparent p-0 outline-none"
          >
            <span
              aria-hidden
              className={`pointer-events-none absolute top-1/2 right-full mr-2.5 -translate-y-1/2 rounded-[2px] border bg-bg px-2 py-1 font-mono text-[9.5px] tracking-[.16em] whitespace-nowrap uppercase transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 ${
                flash === s.id
                  ? "translate-x-0 border-accent/60 text-accent opacity-100"
                  : "translate-x-1.5 border-bord text-txt opacity-0"
              }`}
            >
              {label}
            </span>
            <i
              className={`block h-px flex-none transition-[width,background] duration-300 group-hover:w-6 group-focus-visible:w-6 ${
                on ? "w-6 bg-accent" : "w-3 bg-[#3A342E] group-hover:bg-txt group-focus-visible:bg-txt"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
