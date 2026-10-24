"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { site } from "@/data";
import { Reveal } from "./Reveal";

/**
 * Contato em duas colunas. À esquerda, a chamada numa cor só (o ponto final em
 * azul é o único destaque) e uma frase. À direita, um cartão de status —
 * disponível, cargo, modelo, base, idiomas e os dois links — que ocupa o lado
 * que ficava vazio. No celular, empilha.
 */
export function ContactSection() {
  const { t, lang } = useLanguage();
  const cell = "bg-bg2/88 shadow-[0_0_0_1px_var(--border)] backdrop-blur-[2px]";
  const glow = { textShadow: "0 0 36px rgba(10,9,8,.95), 0 0 12px rgba(10,9,8,.9)" };
  const ctB = t.ctB.replace(/\.$/, "");
  const rows: [string, string][] = [
    [t.ctLabRole, t.ctRole],
    [t.ctLabModel, t.ctModel],
    [t.ctLabBase, site.location[lang]],
    [t.ctLabLangs, t.langs.map((l) => l[0]).join(" · ")],
  ];

  return (
    <section
      id="contato"
      data-stg="4"
      data-pdim="0.7"
      className="border-t border-bord px-5 py-[clamp(70px,13vh,150px)] sm:px-8"
    >
      <p className="m-0 mb-[clamp(26px,5vh,54px)] font-mono text-[11px] tracking-[.2em] text-muted uppercase">
        11 — {t.contactTitle}
      </p>
      <div className="grid grid-cols-1 items-center gap-[clamp(28px,4vw,72px)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)]">
        <div>
          <Reveal>
            <h2
              className="m-0 max-w-[13ch] text-[clamp(38px,5.8vw,92px)] leading-[1.02] font-bold tracking-[-.04em]"
              style={glow}
            >
              <span className="block [text-wrap:balance]">{t.ctA}</span>
              <span className="mt-[.18em] block [text-wrap:balance]">
                {ctB}
                <span className="text-accent">.</span>
              </span>
            </h2>
          </Reveal>
          <p
            className="m-0 mt-[clamp(22px,3.6vh,40px)] max-w-[44ch] text-[clamp(15px,1.3vw,18px)] leading-[1.6] text-strong [text-wrap:pretty]"
            style={{ textShadow: "0 0 14px rgba(10,9,8,1), 0 0 6px rgba(10,9,8,1)" }}
          >
            {t.contactDesc}
          </p>
        </div>

        <Reveal delay={120}>
          <aside className={`${cell} p-[clamp(22px,2.6vw,36px)]`}>
            <p className="m-0 mb-5 flex items-center gap-2.5 font-mono text-[10.5px] tracking-[.18em] text-ok uppercase">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-ok" />
              </span>
              {t.ctStatus}
            </p>
            <dl className="m-0 border-y border-bord">
              {rows.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[92px_1fr] items-baseline gap-4 border-b border-bord py-3.5 last:border-b-0">
                  <dt className="font-mono text-[10px] tracking-[.16em] text-muted uppercase">{k}</dt>
                  <dd className="m-0 text-[14px] leading-[1.5] text-txt">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex flex-col gap-2.5">
              <a
                href={site.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-[2px] bg-accent px-5 py-[14px] font-mono text-[11.5px] tracking-[.16em] text-bg uppercase hover:text-bg hover:opacity-85"
              >
                LinkedIn <span>↗</span>
              </a>
              <a
                href={site.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-[2px] border border-bord px-5 py-[14px] font-mono text-[11.5px] tracking-[.16em] text-txt uppercase hover:border-accent"
              >
                GitHub <span>↗</span>
              </a>
            </div>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}
