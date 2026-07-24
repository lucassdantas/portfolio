"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { educations, certifications, books } from "@/data";
import { Reveal } from "./Reveal";

export function EducationSection() {
  const { t } = useLanguage();

  return (
    <section id="educacao" className="mx-auto max-w-[1200px] px-8 pb-10 pt-[100px]">
      <p className="mb-2 font-mono text-sm text-accent">07 — {t.eduTitle}</p>

      <div className="mb-12 mt-8 grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6">
        {educations.map((ed) => (
          <Reveal key={ed.course}>
            <div className="h-full rounded-xl border border-bord bg-card p-[26px] hover:border-accent">
              <p className="mb-2.5 font-mono text-xs text-accent">{ed.period}</p>
              <h3 className="mb-1 text-lg font-semibold">{ed.course}</h3>
              <p className="mb-3.5 text-sm text-muted">
                {ed.institution} · {ed.grade}
              </p>
              <p className="text-[13.5px] leading-[1.55] text-muted [text-wrap:pretty]">{ed.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <p className="mb-5 font-mono text-sm text-accent">{"// " + t.certTitle}</p>
      <div className="mb-12 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3.5">
        {certifications.map((ce) => (
          <div
            key={ce.title}
            className="flex items-center justify-between gap-3 rounded-[10px] border border-bord bg-bg2 px-[18px] py-3.5 hover:border-accent"
          >
            <div>
              {ce.url ? (
                <a
                  href={ce.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-txt hover:text-accent"
                >
                  {ce.title} ↗
                </a>
              ) : (
                <span className="text-sm font-semibold text-txt">{ce.title}</span>
              )}
              <div className="mt-1 font-mono text-[11.5px] text-muted">
                {ce.institution} · {ce.period}
              </div>
            </div>
            <span className="whitespace-nowrap font-mono text-[11px] text-accent">{ce.hours}h</span>
          </div>
        ))}
      </div>

      <p className="mb-5 font-mono text-sm text-accent">{"// " + t.booksTitle}</p>
      <div className="mb-12 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3.5">
        {books.map((bk) => (
          <div
            key={bk.title}
            className="flex items-center gap-3.5 rounded-[10px] border border-bord bg-card px-4 py-3.5 hover:border-accent"
          >
            <div className="flex h-14 w-10 shrink-0 items-center justify-center rounded-[3px] border-l-[3px] border-accent bg-bg2 font-mono text-xs font-bold text-accent">
              {bk.initials}
            </div>
            <div>
              <div className="text-[14.5px] font-semibold">{bk.title}</div>
              <div className="mt-[3px] font-mono text-[11.5px] text-muted">{bk.author}</div>
            </div>
          </div>
        ))}
      </div>

      <p className="mb-5 font-mono text-sm text-accent">{"// " + t.langTitle}</p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-3.5">
        {t.langs.map(([name, level, pct]) => (
          <div key={name} className="rounded-[10px] border border-bord bg-card p-[18px]">
            <div className="mb-2.5 flex justify-between">
              <span className="text-[15px] font-semibold">{name}</span>
              <span className="font-mono text-xs text-accent">{level}</span>
            </div>
            <div className="h-[7px] overflow-hidden rounded bg-bg2">
              <div className="h-full rounded bg-accent" style={{ width: `${pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
