"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const SECTIONS = [
  { id: "top", label: "Início" },
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

/** Trilha vertical de seções, fixa à direita — só em telas ≥1100px. */
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
      aria-label="seções"
      className="fixed top-1/2 right-[clamp(10px,1.6vw,22px)] z-[110] hidden -translate-y-1/2 flex-col gap-3.5 min-[1100px]:flex"
    >
      {SECTIONS.map((s) => {
        const on = active === s.id;
        const label = s.label ?? t[s.key];
        return (
          <button
            key={s.id}
            onClick={() => go(s.id)}
            className="group flex cursor-pointer items-center justify-end gap-2.5 border-0 bg-transparent p-0 font-mono text-[9.5px] tracking-[.16em] text-dim uppercase transition-colors duration-300 hover:text-txt"
          >
            <span
              className={`translate-x-1.5 opacity-0 whitespace-nowrap transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100 ${
                on ? "translate-x-0 opacity-100" : ""
              } ${on ? "text-txt" : ""}`}
            >
              {label}
            </span>
            <i
              className={`block h-px flex-none bg-[#3A342E] transition-[width,background] duration-300 group-hover:w-6.5 group-hover:bg-txt ${
                on ? "w-[30px] bg-accent" : "w-4"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
