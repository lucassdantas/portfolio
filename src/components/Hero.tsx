"use client";

import { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { site } from "@/data";

export function Hero() {
  const { t } = useLanguage();
  const photoRef = useRef<HTMLDivElement>(null);

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
          <img
            src={site.heroImage}
            alt="Lucas Dantas"
            className="relative block h-[340px] w-[300px] border border-bord object-cover grayscale-[60%] transition hover:grayscale-0"
          />
          <div className="absolute -left-[34px] bottom-3.5 rounded-lg border border-bord bg-card px-3.5 py-2 font-mono text-xs text-txt shadow-[0_8px_24px_rgba(0,0,0,.35)]">
            <span className="text-[#22C55E]">●</span> {t.badge}
          </div>
        </div>
      </div>
    </section>
  );
}
