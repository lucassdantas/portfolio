"use client";

import { useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { systems } from "@/data";
import { Reveal } from "./Reveal";
import { RichLine } from "./RichLine";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "Sistemas em produção": as entregas de plataforma.
 *
 * Cada card é lido em duas camadas:
 * 1. num relance — número de destaque, título, antes ✕ / depois ✓ e o
 *    resultado (a prova, sempre visível);
 * 2. no detalhe — problema e o que foi construído, abertos em "como foi feito".
 * Nenhum texto some: o detalhe só fica recolhido para o card não virar parede.
 *
 * Complementa a CaseSection (que abre UM case em profundidade, com diagrama)
 * mostrando a largura do trabalho. Conteúdo em `src/data/systems.ts`, nos 4 idiomas.
 */
export function SystemsSection() {
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState<number | null>(null);
  // ignora um segundo clique logo em seguida: duplo clique (ou clicar de novo
  // enquanto o painel ainda entra) abria e fechava o detalhe na mesma hora
  const lastToggle = useRef(0);
  const toggle = (next: number | null) => {
    const now = performance.now();
    if (now - lastToggle.current < 400) return;
    lastToggle.current = now;
    setOpen(next);
  };

  return (
    <section
      id="sistemas"
      data-stg="2.8"
      className="border-t border-bord px-5 py-[clamp(70px,14vh,170px)] sm:px-8"
    >
      <div className="mb-[clamp(30px,6vh,64px)] flex flex-wrap items-baseline justify-between gap-6">
        <p className="m-0 font-mono text-[11px] tracking-[.2em] text-muted uppercase">
          05 — {t.sysTitle}
        </p>
        <p className="m-0 max-w-[52ch] text-sm leading-[1.55] text-muted">{t.sysDesc}</p>
      </div>

      <div className="grid grid-cols-1 gap-px border border-bord md:grid-cols-2 xl:grid-cols-3">
        {systems.map((s, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={s.title.pt} delay={(i % 3) * 90} className="h-full">
              <article className="ld-vel relative flex h-full flex-col overflow-hidden bg-bg2/88 p-[clamp(22px,2.4vw,34px)] shadow-[0_0_0_1px_var(--border)] backdrop-blur-[2px]">
                <div className="mb-[clamp(16px,2.4vh,26px)] flex items-baseline justify-between gap-4">
                  <p className="m-0 font-mono text-[10.5px] tracking-[.18em] text-accent uppercase">
                    {s.domain[lang]}
                  </p>
                  <p className="m-0 flex-none font-mono text-[10.5px] tracking-[.18em] text-muted">{pad(i + 1)}</p>
                </div>

                {/* número de destaque: a primeira coisa que o olho pega */}
                <p className="m-0 text-[clamp(44px,4.6vw,68px)] leading-none font-bold tracking-[-.045em] text-warm">
                  {s.stat.value}
                </p>
                <p className="m-0 mt-2 mb-[clamp(16px,2.4vh,24px)] font-mono text-[10.5px] tracking-[.14em] text-strong uppercase">
                  {s.stat.label[lang]}
                </p>

                <h3 className="m-0 mb-[clamp(16px,2.4vh,24px)] max-w-[24ch] text-[clamp(20px,1.7vw,25px)] leading-[1.15] font-semibold tracking-[-.025em] [text-wrap:balance]">
                  {s.title[lang]}
                </h3>

                <dl className="m-0 mb-[clamp(16px,2.4vh,24px)] flex flex-col gap-2 text-[13.5px] leading-[1.5]">
                  <div className="grid grid-cols-[64px_1fr] items-baseline gap-3">
                    <dt className="font-mono text-[10px] tracking-[.16em] text-err uppercase">✕ {t.sysBefore}</dt>
                    <dd className="m-0 text-muted">{s.before[lang]}</dd>
                  </div>
                  <div className="grid grid-cols-[64px_1fr] items-baseline gap-3">
                    <dt className="font-mono text-[10px] tracking-[.16em] text-ok uppercase">✓ {t.sysAfter}</dt>
                    <dd className="m-0 text-txt">{s.after[lang]}</dd>
                  </div>
                </dl>

                {/* o resultado é a prova: fica sempre à vista */}
                <p className="m-0 border-l-2 border-accent pl-3.5 text-[13.5px] leading-[1.6] text-muted [text-wrap:pretty]">
                  <RichLine text={s.result[lang]} />
                </p>

                {/* tags numa linha, botão sempre na linha de baixo à direita — igual em todos os cards */}
                <div className="mt-auto flex flex-col gap-4 pt-[clamp(18px,2.6vh,26px)]">
                  <div className="flex flex-wrap gap-1.5">
                    {s.tech.map((tc) => (
                      <span
                        key={tc}
                        className="rounded-[2px] border border-bord px-2 py-1 font-mono text-[10px] tracking-[.1em] text-muted uppercase"
                      >
                        {tc}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => toggle(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    tabIndex={isOpen ? -1 : 0}
                    className="cursor-pointer self-end border-0 border-b border-accent/40 bg-transparent px-0 pb-0.5 font-mono text-[10.5px] tracking-[.14em] text-accent uppercase transition-colors hover:border-accent hover:text-txt"
                  >
                    + {t.sysMore}
                  </button>
                </div>

                {/* detalhe: desliza por cima do próprio card — a grade não muda de altura */}
                <div
                  aria-hidden={!isOpen}
                  className={`absolute inset-0 flex flex-col bg-bg2/97 p-[clamp(22px,2.4vw,34px)] backdrop-blur-[6px] transition-[translate,opacity] duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
                    isOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
                  }`}
                >
                  {/* fechar no topo: longe do "como foi feito", que fica embaixo */}
                  <div className="mb-4 flex items-baseline justify-between gap-4">
                    <p className="m-0 font-mono text-[10.5px] tracking-[.18em] text-muted uppercase">
                      {pad(i + 1)} · {s.title[lang]}
                    </p>
                    <button
                      onClick={() => toggle(null)}
                      tabIndex={isOpen ? 0 : -1}
                      aria-label={t.sysLess}
                      className="flex h-8 w-8 flex-none cursor-pointer items-center justify-center rounded-full border border-bord bg-transparent font-mono text-[14px] text-txt transition-colors hover:border-accent hover:text-accent"
                    >
                      ×
                    </button>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                    <p className="m-0 mb-1.5 font-mono text-[10px] tracking-[.2em] text-accent uppercase">{t.sysProblem}</p>
                    <p className="m-0 mb-5 text-[13.5px] leading-[1.62] text-strong [text-wrap:pretty]">
                      <RichLine text={s.problem[lang]} />
                    </p>
                    <p className="m-0 mb-1.5 font-mono text-[10px] tracking-[.2em] text-accent uppercase">{t.sysBuilt}</p>
                    <p className="m-0 text-[13.5px] leading-[1.62] text-strong [text-wrap:pretty]">
                      <RichLine text={s.built[lang]} />
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
