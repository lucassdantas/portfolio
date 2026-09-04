"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { experiences, site } from "@/data";
import { RichLine } from "./RichLine";

export function ExperienceSection() {
  const { t } = useLanguage();
  const [openExp, setOpenExp] = useState(0);
  const metricLabels = [t.m1, t.m2, t.m3, t.m4];

  return (
    <section id="experiencia" data-stg="2" className="px-5 py-[clamp(70px,14vh,170px)] sm:px-8">
      <div className="mb-[clamp(30px,6vh,64px)] flex flex-wrap items-baseline justify-between gap-6">
        <p className="m-0 font-mono text-[11px] tracking-[.2em] text-dim uppercase">
          03 — {t.expTitle}
        </p>
        <p className="m-0 text-sm text-muted">{t.expDesc}</p>
      </div>

      <div className="mb-[clamp(40px,7vh,90px)] grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-px border-t border-b border-bord bg-bord">
        {site.expMetrics.map((m, i) => {
          const color = m.accent ? "var(--accent)" : m.warm ? "var(--warm)" : undefined;
          return (
          <div key={m.value} className="bg-bg py-[clamp(22px,3vw,38px)] pl-[clamp(0px,2vw,28px)] first:pl-0">
            <p
              className="m-0 text-[clamp(40px,5.5vw,84px)] leading-none font-bold tracking-[-.045em]"
              style={{ color }}
            >
              {m.value}
            </p>
            <p className="m-0 mt-2 font-mono text-[11px] tracking-[.14em] text-muted uppercase">
              {metricLabels[i]}
            </p>
          </div>
          );
        })}
      </div>

      <div className="flex flex-col">
        {experiences.map((ex, i) => {
          const open = openExp === i;
          const isLast = i === experiences.length - 1;
          return (
            <div key={i} className={`border-t border-bord ${isLast ? "border-b" : ""}`}>
              <button
                onClick={() => setOpenExp(open ? -1 : i)}
                className="flex w-full cursor-pointer items-baseline justify-between gap-5 border-0 bg-transparent py-[clamp(22px,3vh,38px)] text-left text-txt"
              >
                <span className="flex flex-col gap-2">
                  <span className="font-mono text-[11px] tracking-[.16em] text-accent uppercase">
                    {ex.period}
                  </span>
                  <span className="text-[clamp(26px,4.2vw,58px)] leading-[1.02] font-semibold tracking-[-.035em]">
                    {ex.title} <span className="text-dim">/</span> {ex.company}
                  </span>
                  <span className="font-mono text-[11.5px] text-muted">{ex.mode}</span>
                </span>
                <span className="flex-none font-mono text-[22px] text-muted">{open ? "−" : "+"}</span>
              </button>
              {open && (
                <div>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[clamp(18px,3vw,44px)] pb-[clamp(26px,4vh,44px)]">
                    {[ex.bullets.slice(0, Math.ceil(ex.bullets.length / 2)), ex.bullets.slice(Math.ceil(ex.bullets.length / 2))].map(
                      (col, ci) => (
                        <ul
                          key={ci}
                          className="m-0 flex list-none flex-col gap-3.5 p-0 text-[14.5px] leading-[1.62] text-muted"
                        >
                          {col.map((b, j) => (
                            <li key={j} className="relative pl-5">
                              <span className="absolute top-[.62em] left-0 h-px w-1.5 bg-accent" />
                              <RichLine text={b} />
                            </li>
                          ))}
                        </ul>
                      )
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5 pb-[clamp(26px,4vh,44px)]">
                    {ex.tech.map((tc) => (
                      <span
                        key={tc}
                        className="rounded-[2px] border border-bord px-2 py-1 font-mono text-[10.5px] tracking-[.1em] text-dim uppercase"
                      >
                        {tc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
