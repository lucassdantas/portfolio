"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { stackGroups, principles } from "@/data";
import { Reveal } from "./Reveal";
import { tx } from "@/lib/i18n";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Stack em cards no mesmo padrão do resto do site (grade com linhas de 1px):
 * um card por grupo, com índice, nome e quantidade, e as tecnologias como
 * chips. Cards levemente translúcidos — o campo de partículas aparece por trás.
 * Abaixo, os princípios de trabalho ("como eu trabalho").
 */
export function StackSection() {
  const { t, lang } = useLanguage();
  const cell = "bg-bg/88 shadow-[0_0_0_1px_var(--border)] backdrop-blur-[2px]";

  return (
    <section id="stack" data-stg="1.6" className="px-5 py-[clamp(70px,14vh,170px)] sm:px-8">
      <div className="mb-[clamp(26px,5vh,56px)] flex flex-wrap items-baseline justify-between gap-6">
        <p className="m-0 font-mono text-[11px] tracking-[.2em] text-muted uppercase">
          02 — {t.stackTitle}
        </p>
        <p className="m-0 max-w-[46ch] text-sm leading-[1.55] text-muted">{t.stackDesc}</p>
      </div>

      <div className="grid grid-cols-1 gap-px border border-bord md:grid-cols-2 xl:grid-cols-3">
        {stackGroups.map((sg, gi) => (
          <Reveal key={sg.label.pt} delay={(gi % 3) * 90} className="h-full">
            <div className={`ld-vel group h-full p-[clamp(20px,2.4vw,30px)] hover:bg-bg2/90 ${cell}`}>
              <div className="mb-[clamp(14px,2vh,20px)] flex items-baseline justify-between gap-4">
                <p className="m-0 font-mono text-[11px] tracking-[.18em] text-accent uppercase">
                  <span className="text-muted">{pad(gi + 1)} · </span>
                  {sg.label[lang]}
                </p>
                <span className="font-mono text-[11px] text-muted">{pad(sg.items.length)}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {sg.items.map((si) => (
                  <span
                    key={tx(si.name, "pt")}
                    className="cursor-default rounded-[2px] border border-bord bg-bg/60 px-2.5 py-[5px] font-mono text-[11.5px] tracking-[.02em] text-strong transition-colors duration-300 group-hover:border-strong/40 group-hover:text-txt hover:!border-accent hover:!text-accent"
                  >
                    {tx(si.name, lang)}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <p className="m-0 mt-[clamp(52px,9vh,110px)] mb-[clamp(20px,3vh,34px)] font-mono text-[11px] tracking-[.2em] text-muted uppercase">
        {"// " + t.engTitle}
      </p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-px border border-bord">
        {principles.map((pr, i) => (
          <Reveal key={pr.title.pt} delay={i * 80} className="h-full">
            <div className={`h-full p-[clamp(20px,2.4vw,32px)] ${cell}`}>
              <p className="m-0 mb-2.5 font-mono text-[10.5px] tracking-[.18em] text-accent">{pad(i + 1)}</p>
              <h3 className="m-0 mb-2.5 text-[19px] font-semibold tracking-[-.02em]">{pr.title[lang]}</h3>
              <p className="m-0 text-[13.5px] leading-[1.6] text-muted [text-wrap:pretty]">{pr.desc[lang]}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
