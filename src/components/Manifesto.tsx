"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Reveal } from "./Reveal";

export function Manifesto() {
  const { t } = useLanguage();

  const words = [t.mfW1, t.mfW2, t.mfW3, t.mfW4, t.mfW5, t.mfW6];

  return (
    <section
      id="manifesto"
      data-stg="1"
      className="relative px-5 py-[clamp(80px,16vh,200px)] sm:px-8"
    >
      <p className="m-0 mb-[clamp(28px,6vh,70px)] font-mono text-[11px] tracking-[.2em] text-dim uppercase">
        01 — {t.secManifesto}
      </p>
      <Reveal>
        <h2 className="m-0 mb-[clamp(34px,7vh,80px)] max-w-[16ch] text-[clamp(40px,8.5vw,140px)] leading-[.9] font-bold tracking-[-.04em]">
          {t.mfHead}
        </h2>
      </Reveal>
      <div className="flex flex-wrap gap-x-[clamp(18px,3vw,52px)] gap-y-[clamp(8px,1.6vh,18px)] border-t border-bord pt-[clamp(20px,3vh,36px)]">
        {words.map((w, i) => (
          <Reveal key={w} delay={i * 70}>
            <p className="m-0 text-[clamp(22px,3.2vw,54px)] leading-[1.06] font-semibold tracking-[-.03em] whitespace-nowrap">
              {w}
            </p>
          </Reveal>
        ))}
      </div>
      <Reveal delay={450}>
        <p className="m-0 mt-[clamp(40px,8vh,110px)] text-[clamp(34px,6.5vw,104px)] leading-[.95] font-bold tracking-[-.04em] text-accent">
          {t.mfEnd}
        </p>
      </Reveal>
      <Reveal>
        <p className="m-0 mt-[clamp(30px,5vh,60px)] max-w-[62ch] text-[clamp(15px,1.35vw,19px)] leading-[1.6] text-muted [text-wrap:pretty]">
          {t.tagline}
        </p>
      </Reveal>
    </section>
  );
}
