"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { site } from "@/data";
import { Reveal } from "./Reveal";

export function ContactSection() {
  const { t } = useLanguage();

  return (
    <section
      id="contato"
      data-stg="4"
      className="flex min-h-[88svh] flex-col justify-center border-t border-bord px-5 py-[clamp(70px,13vh,150px)] sm:px-8"
    >
      <p className="m-0 mb-[clamp(26px,5vh,54px)] font-mono text-[11px] tracking-[.2em] text-dim uppercase">
        10 — {t.contactTitle}
      </p>
      <Reveal>
        <h2 className="m-0 text-[clamp(38px,9vw,150px)] leading-[.92] font-bold tracking-[-.045em]">
          <span className="block text-dim">{t.ctA}</span>
          <span className="block">{t.ctB}</span>
        </h2>
      </Reveal>
      <p className="m-0 mt-[clamp(26px,4.5vh,52px)] max-w-[54ch] text-[clamp(15px,1.35vw,19px)] leading-[1.6] text-muted [text-wrap:pretty]">
        {t.contactDesc}
      </p>
      <div className="mt-[clamp(28px,5vh,56px)] flex flex-wrap gap-3.5">
        <a
          href={site.linkedinUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-[2px] bg-accent px-[30px] py-[15px] font-mono text-[11.5px] tracking-[.16em] text-bg uppercase hover:text-bg hover:opacity-85"
        >
          LinkedIn ↗
        </a>
        <a
          href={site.githubUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-[2px] border border-bord px-[30px] py-[15px] font-mono text-[11.5px] tracking-[.16em] text-txt uppercase hover:border-accent"
        >
          GitHub ↗
        </a>
      </div>
      <p className="m-0 mt-[clamp(28px,5vh,56px)] font-mono text-[11.5px] tracking-[.14em] text-dim uppercase">
        {site.location} · {t.remote}
      </p>
    </section>
  );
}
