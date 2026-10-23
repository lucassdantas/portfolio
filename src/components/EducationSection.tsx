"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { educations, certifications, books } from "@/data";
import { Reveal } from "./Reveal";
import { formatMonth, formatPeriod, tx } from "@/lib/i18n";

export function EducationSection() {
  const { t, lang } = useLanguage();

  return (
    <section id="educacao" data-stg="4" data-pdim="0.7" className="border-t border-bord px-5 py-[clamp(70px,13vh,150px)] sm:px-8">
      <p className="m-0 mb-[clamp(24px,4vh,48px)] font-mono text-[11px] tracking-[.2em] text-dim uppercase">
        10 — {t.eduTitle}
      </p>

      <div className="mb-[clamp(40px,7vh,88px)] grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-px border border-bord bg-bord">
        {educations.map((ed, i) => (
          <Reveal key={ed.course.pt} delay={i * 90} className="h-full">
            <div className="h-full bg-bg p-[clamp(22px,2.8vw,36px)]">
              <p className="m-0 mb-3 font-mono text-[10.5px] tracking-[.16em] text-accent uppercase">
                {formatPeriod(ed.period, lang)}
              </p>
              <h3 className="m-0 mb-1.5 text-[clamp(20px,2.1vw,28px)] font-semibold tracking-[-.02em]">
                {ed.course[lang]}
              </h3>
              <p className="m-0 mb-3 font-mono text-[11.5px] text-dim">{ed.institution}</p>
              <p className="m-0 text-[13.5px] leading-[1.6] text-muted">{ed.desc[lang]}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <p className="m-0 mb-[clamp(16px,2.6vh,28px)] font-mono text-[11px] tracking-[.2em] text-dim uppercase">
        {"// " + t.certTitle}
      </p>
      <div className="mb-[clamp(40px,7vh,88px)] border border-bord bg-bg/55 backdrop-blur-[2px]">
        {certifications.map((ce) => {
          const row = (
            <>
              <span className="font-mono text-[10.5px] tracking-[.14em] text-muted uppercase">{formatMonth(ce.date, lang)}</span>
              <span className="text-[15px] font-medium tracking-[-.01em] text-txt">{tx(ce.title, lang)}</span>
              <span className="font-mono text-[11px] text-muted">{ce.institution}</span>
              <span className="text-left font-mono text-[11px] tracking-[.1em] text-accent sm:text-right">
                {ce.hours}h{ce.url ? " ↗" : ""}
              </span>
            </>
          );
          const cls =
            "grid grid-cols-1 items-baseline gap-1 border-b border-bord px-3 py-3.5 transition-[padding-left,background] duration-[.35s] last:border-b-0 sm:grid-cols-[100px_minmax(0,1fr)_minmax(0,.7fr)_74px] sm:gap-4.5";
          return ce.url ? (
            <a key={ce.url} href={ce.url} target="_blank" rel="noreferrer" className={`${cls} hover:bg-bg2 hover:pl-6`}>
              {row}
            </a>
          ) : (
            <div key={tx(ce.title, "pt")} className={cls}>
              {row}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[clamp(28px,4vw,70px)]">
        <div>
          <p className="m-0 mb-[clamp(16px,2.6vh,28px)] font-mono text-[11px] tracking-[.2em] text-dim uppercase">
            {"// " + t.booksTitle}
          </p>
          <div className="flex flex-col gap-px border border-bord bg-bord">
            {books.map((bk) => (
              <div key={bk.title} className="flex items-center gap-4 bg-bg px-4.5 py-[15px]">
                <span className="flex-none border-l-2 border-accent pl-2.5 font-mono text-xs tracking-[.08em] text-accent">
                  {bk.initials}
                </span>
                <span>
                  <span className="block text-[14.5px] font-medium tracking-[-.01em]">{bk.title}</span>
                  <span className="mt-[3px] block font-mono text-[10.5px] text-dim">{bk.author}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="m-0 mb-[clamp(16px,2.6vh,28px)] font-mono text-[11px] tracking-[.2em] text-dim uppercase">
            {"// " + t.langTitle}
          </p>
          <div className="flex flex-col gap-[18px] border border-bord bg-bg/55 p-4.5 backdrop-blur-[2px]">
            {t.langs.map(([name, level, pct]) => (
              <div key={name}>
                <div className="mb-[7px] flex justify-between font-mono text-[11.5px] tracking-[.08em]">
                  <span>{name}</span>
                  <span className="text-dim">{level}</span>
                </div>
                <div className="h-px bg-bord">
                  <div className="h-px bg-accent transition-[width] duration-[1.4s]" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
