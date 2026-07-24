"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { site } from "@/data";

export function ContactSection() {
  const { t } = useLanguage();

  return (
    <section id="contato" className="mx-auto max-w-[1000px] px-8 pb-[90px] pt-[110px] text-center">
      <p className="mb-3 font-mono text-sm text-accent">08 — {t.contactTitle}</p>
      <h2 className="mb-[18px] text-[clamp(34px,5vw,56px)] font-semibold tracking-[-.02em]">
        {t.contactHead}
      </h2>
      <p className="mx-auto mb-9 max-w-[520px] text-[17px] leading-[1.6] text-muted [text-wrap:pretty]">
        {t.contactDesc}
      </p>
      <div className="flex flex-wrap justify-center gap-3.5">
        <a
          href={site.linkedinUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg bg-accent px-[30px] py-3.5 text-[15px] font-semibold text-white hover:text-white hover:opacity-85"
        >
          LinkedIn ↗
        </a>
        <a
          href={site.githubUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-bord px-[30px] py-3.5 text-[15px] font-semibold text-txt hover:border-accent hover:text-accent"
        >
          GitHub ↗
        </a>
      </div>
      <p className="mt-9 font-mono text-[12.5px] text-muted">
        {site.location} · {t.remote}
      </p>
    </section>
  );
}
