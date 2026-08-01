"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { site } from "@/data";

const TYPE_MS = 55;
const DELETE_MS = 30;
const HOLD_MS = 2200;
const GAP_MS = 400;

function useTypedCycle(phrases: string[]) {
  const [text, setText] = useState(phrases[0] ?? "");

  useEffect(() => {
    if (phrases.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      let phraseIndex = 0;
      setText(phrases[phraseIndex]);
      const interval = setInterval(() => {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setText(phrases[phraseIndex]);
      }, HOLD_MS);
      return () => clearInterval(interval);
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = phrases[phraseIndex % phrases.length];

      if (!deleting) {
        charIndex++;
        setText(current.slice(0, charIndex));
        if (charIndex === current.length) {
          deleting = true;
          timer = setTimeout(tick, HOLD_MS);
          return;
        }
        timer = setTimeout(tick, TYPE_MS);
        return;
      }

      charIndex--;
      setText(current.slice(0, charIndex));
      if (charIndex === 0) {
        deleting = false;
        phraseIndex++;
        timer = setTimeout(tick, GAP_MS);
        return;
      }
      timer = setTimeout(tick, DELETE_MS);
    };

    timer = setTimeout(tick, TYPE_MS);
    return () => clearTimeout(timer);
  }, [phrases]);

  return text;
}

export function Hero() {
  const { t } = useLanguage();
  const photoRef = useRef<HTMLDivElement>(null);
  const typedBadge = useTypedCycle(t.badges);

  const onMove = (e: React.MouseEvent) => {
    const el = photoRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  };
  const onLeave = () => {
    if (photoRef.current) photoRef.current.style.transform = "perspective(700px)";
  };

  const stats = [
    { value: site.stats.years, label: t.statYears },
    { value: site.stats.projects, label: t.statProj },
    { value: site.stats.languages, label: t.statLangs },
  ];

  return (
    <section
      id="top"
      className="mx-auto grid min-h-[88vh] max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-center gap-14 px-8 pb-[60px] pt-[150px]"
    >
      <div>
        <p className="mb-3.5 font-mono text-[15px] text-accent">{t.role}</p>
        <h1 className="mb-[22px] text-[clamp(52px,8vw,96px)] font-bold leading-[.98] tracking-[-.03em]">
          Lucas Dantas<span className="text-accent">.</span>
        </h1>
        <p className="mb-8 max-w-[540px] text-[19px] leading-[1.6] text-muted [text-wrap:pretty]">
          {t.tagline}
        </p>
        <div className="mb-11 flex flex-wrap gap-3.5">
          <a
            href="#projetos"
            className="rounded-lg bg-accent px-[26px] py-[13px] text-[15px] font-semibold text-white hover:text-white hover:opacity-85"
          >
            {t.cta1}
          </a>
          <a
            href={site.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-bord px-[26px] py-[13px] text-[15px] font-semibold text-txt hover:border-accent hover:text-accent"
          >
            {t.cta2}
          </a>
        </div>
        <div className="flex flex-wrap gap-9 font-mono">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-[26px] font-bold text-accent">{s.value}</div>
              <div className="text-xs text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center">
        <div
          ref={photoRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="relative w-[300px] transition-transform duration-150 ease-out [transform-style:preserve-3d]"
        >
          <div className="absolute -left-6 -top-6 h-[110px] w-[110px] bg-accent opacity-85" />
          <div className="absolute -bottom-6 -right-6 h-[90px] w-[90px] animate-[floaty_5s_ease-in-out_infinite] bg-gradient-to-br from-[#1E1D3F] to-accent" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {/* LCP da página: carrega cedo e com prioridade, sem lazy */}
          <img
            src={site.heroImage}
            alt="Lucas Dantas"
            width={300}
            height={340}
            fetchPriority="high"
            decoding="async"
            className="relative block h-[340px] w-[300px] border border-bord object-cover grayscale-[60%] transition hover:grayscale-0"
          />
          <div className="absolute -left-[34px] bottom-3.5 rounded-lg border border-bord bg-card px-3.5 py-2 font-mono text-xs text-txt shadow-[0_8px_24px_rgba(0,0,0,.35)]">
            <span className="text-[#22C55E]">●</span> {typedBadge}
            <span className="ml-px text-accent motion-safe:animate-pulse">▍</span>
          </div>
        </div>
      </div>
    </section>
  );
}
