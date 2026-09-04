"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { site } from "@/data";

export function Hero() {
  const { t } = useLanguage();

  const stats = [
    { value: site.stats.years, label: t.statYears },
    { value: site.stats.projects, label: t.statProj },
    { value: site.stats.languages, label: t.statLangs },
  ];

  return (
    <section
      id="top"
      data-stg="0"
      className="relative flex min-h-[100svh] flex-col justify-between px-5 pb-[clamp(26px,4vh,44px)] pt-[clamp(96px,14vh,170px)] sm:px-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-6 font-mono text-[11px] tracking-[.16em] text-muted uppercase">
        <p className="m-0">{t.role}</p>
        <p className="m-0 text-right">
          {site.location.replace("📍 ", "")}
          <br />
          <span className="text-dim">{site.coords}</span>
        </p>
      </div>

      <h1 className="m-0 mb-[clamp(28px,5vh,64px)] pb-[.06em] text-[clamp(64px,15.5vw,260px)] leading-[.83] font-bold tracking-[-.045em] uppercase">
        <span className="block">Lucas</span>
        <span className="block">
          Dantas<span className="text-accent">.</span>
        </span>
      </h1>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] items-end gap-[clamp(20px,4vw,64px)]">
        <p className="m-0 max-w-[36ch] text-[clamp(16px,1.5vw,21px)] leading-[1.45] text-strong [text-wrap:pretty]">
          {t.heroLine}
        </p>
        <div className="flex flex-col gap-2.5 font-mono text-[11px] tracking-[.14em] text-muted uppercase">
          {stats.map((s) => (
            <div key={s.label} className="flex justify-between border-t border-bord pt-2">
              <span>{s.label}</span>
              <span className="text-txt">{s.value}</span>
            </div>
          ))}
        </div>
        <div className="flex items-end justify-end gap-3 font-mono text-[10.5px] tracking-[.18em] text-dim uppercase">
          <span>{t.scrollCue}</span>
          <span className="block h-11 w-px bg-gradient-to-b from-accent to-transparent" />
        </div>
      </div>
    </section>
  );
}
