"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { experiences } from "@/data";
import { Reveal } from "./Reveal";

export function ExperienceSection() {
  const { t } = useLanguage();
  const [openExp, setOpenExp] = useState(0);

  return (
    <section id="experiencia" className="mx-auto max-w-[1000px] px-8 pb-10 pt-[100px]">
      <p className="mb-2 font-mono text-sm text-accent">03 — {t.expTitle}</p>
      <p className="mb-10 max-w-[640px] text-base text-muted">{t.expDesc}</p>
      <div className="flex flex-col">
        {experiences.map((ex, i) => {
          const open = openExp === i;
          return (
            <div key={i} className="grid grid-cols-[24px_1fr] gap-[22px]">
              <div className="flex flex-col items-center">
                <span className="mt-1.5 h-3.5 w-3.5 rounded-full border-[3px] border-bg bg-accent shadow-[0_0_0_2px_var(--accent)]" />
                <span className="w-0.5 flex-1 bg-bord" />
              </div>
              <Reveal className="pb-9">
                <button
                  onClick={() => setOpenExp(open ? -1 : i)}
                  className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-[10px] border border-bord bg-card px-5 py-[18px] text-left text-txt hover:border-accent"
                >
                  <span>
                    <span className="block text-lg font-bold">
                      {ex.title} <span className="text-accent">@ {ex.company}</span>
                    </span>
                    <span className="mt-[5px] block font-mono text-[12.5px] text-muted">
                      {ex.period} · {ex.mode}
                    </span>
                  </span>
                  <span className="font-mono text-lg text-accent">{open ? "−" : "+"}</span>
                </button>
                {open && (
                  <div className="mx-2 rounded-b-[10px] border border-t-0 border-bord bg-bg2 px-[22px] py-5">
                    <ul className="flex list-disc flex-col gap-[9px] pl-5 text-[14.5px] leading-[1.55] text-muted">
                      {ex.bullets.map((b, j) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
                    <div className="mt-[18px] flex flex-wrap gap-[7px]">
                      {ex.tech.map((tc) => (
                        <span
                          key={tc}
                          className="rounded-[20px] border border-bord px-[11px] py-1 font-mono text-[11.5px] text-accent"
                        >
                          {tc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Reveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}
