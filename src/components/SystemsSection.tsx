"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { systems } from "@/data";
import { Reveal } from "./Reveal";
import { RichLine } from "./RichLine";

/**
 * "Sistemas em produção": as entregas de plataforma, em cards
 * problema → o que construí → o que mudou.
 *
 * Complementa a CaseSection (que abre UM case em profundidade, com diagrama)
 * mostrando a largura do trabalho. Conteúdo em `src/data/systems.ts`, só em PT,
 * como os bullets de experiência — aqui só os rótulos são traduzidos.
 */
export function SystemsSection() {
  const { t } = useLanguage();

  return (
    <section
      id="sistemas"
      data-stg="2.8"
      className="border-t border-bord px-5 py-[clamp(70px,14vh,170px)] sm:px-8"
    >
      <div className="mb-[clamp(30px,6vh,64px)] flex flex-wrap items-baseline justify-between gap-6">
        <p className="m-0 font-mono text-[11px] tracking-[.2em] text-dim uppercase">
          05 — {t.sysTitle}
        </p>
        <p className="m-0 max-w-[52ch] text-sm leading-[1.55] text-muted">{t.sysDesc}</p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(330px,1fr))] gap-px border border-bord bg-bord">
        {systems.map((s, i) => (
          <Reveal key={s.title} delay={(i % 2) * 90} className="h-full">
            <article className="flex h-full flex-col bg-bg2 p-[clamp(22px,2.6vw,38px)]">
              <div className="mb-5 flex items-baseline justify-between gap-4">
                <p className="m-0 font-mono text-[10.5px] tracking-[.18em] text-accent uppercase">
                  {s.domain}
                </p>
                <p className="m-0 flex-none font-mono text-[10.5px] tracking-[.18em] text-dim">
                  {String(i + 1).padStart(2, "0")}
                </p>
              </div>

              <h3 className="m-0 mb-[clamp(16px,2vh,26px)] max-w-[22ch] text-[clamp(21px,2.1vw,30px)] leading-[1.12] font-semibold tracking-[-.03em]">
                {s.title}
              </h3>

              <p className="m-0 mb-1.5 font-mono text-[10px] tracking-[.2em] text-dim uppercase">
                {t.sysProblem}
              </p>
              <p className="m-0 mb-[clamp(16px,2vh,24px)] text-[13.5px] leading-[1.62] text-muted [text-wrap:pretty]">
                <RichLine text={s.problem} />
              </p>

              <p className="m-0 mb-1.5 font-mono text-[10px] tracking-[.2em] text-dim uppercase">
                {t.sysBuilt}
              </p>
              <p className="m-0 mb-[clamp(18px,2.4vh,28px)] text-[13.5px] leading-[1.62] text-muted [text-wrap:pretty]">
                <RichLine text={s.built} />
              </p>

              {/* base em `muted` de propósito: é o contraste que faz o
                  destaque de `RichLine` (text-strong) aparecer na linha. */}
              <p className="m-0 mt-auto border-l border-accent pl-3.5 text-[13.5px] leading-[1.6] text-muted [text-wrap:pretty]">
                <RichLine text={s.result} />
              </p>

              <div className="mt-[clamp(18px,2.4vh,26px)] flex flex-wrap gap-1.5">
                {s.tech.map((tc) => (
                  <span
                    key={tc}
                    className="rounded-[2px] border border-bord px-2 py-1 font-mono text-[10.5px] tracking-[.1em] text-dim uppercase"
                  >
                    {tc}
                  </span>
                ))}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
