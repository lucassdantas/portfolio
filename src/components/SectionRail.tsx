"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

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

/**
 * Trilha vertical de seções, fixa à direita — só em telas ≥1100px.
 * Ocupa só a largura das linhas (o `page.tsx` reserva esse respiro à direita);
 * o rótulo flutua à esquerda apenas em hover/foco e não captura clique, para
 * nunca cobrir nem bloquear o conteúdo das seções.
 */
export function SectionRail() {
  const { t } = useLanguage();
  const [active, setActive] = useState("top");

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => !!el
    );
    if (els.length === 0) return;

    const onScroll = () => {
      const mid = window.innerHeight * 0.4;
      let current = els[0].id;
      els.forEach((el) => {
        if (el.getBoundingClientRect().top <= mid) current = el.id;
      });
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
              className="pointer-events-none absolute top-1/2 right-full mr-2.5 translate-x-1.5 -translate-y-1/2 rounded-[2px] border border-bord bg-bg px-2 py-1 font-mono text-[9.5px] tracking-[.16em] whitespace-nowrap text-txt uppercase opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
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
