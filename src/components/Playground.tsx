"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const INITIAL_CODE = `// Edite e clique em RUN ▶
const dev = {
  nome: 'Lucas Dantas',
  stack: ['Next.js', 'Python', 'Laravel', 'Docker'],
  foco: 'arquitetura limpa + custo baixo'
};
console.log(JSON.stringify(dev, null, 2));`;

export function Playground() {
  const { t } = useLanguage();
  const [code, setCode] = useState(INITIAL_CODE);
  const [output, setOutput] = useState<string[]>(["aguardando execução..."]);

  const run = () => {
    const logs: string[] = [];
    const fake = {
      log: (...a: unknown[]) =>
        logs.push(
          a.map((x) => (typeof x === "object" ? JSON.stringify(x, null, 2) : String(x))).join(" ")
        ),
      error: (...a: unknown[]) => logs.push("✖ " + a.join(" ")),
      warn: (...a: unknown[]) => logs.push("⚠ " + a.join(" ")),
    };
    try {
      new Function("console", code)(fake);
      if (!logs.length) logs.push("(sem output — use console.log)");
    } catch (err) {
      logs.push("✖ " + (err instanceof Error ? err.message : String(err)));
    }
    setOutput(logs);
  };

  return (
    <section id="playground" data-stg="3.8" className="border-t border-bord px-5 py-[clamp(70px,13vh,150px)] sm:px-8">
      <div className="mb-[clamp(24px,4vh,48px)] flex flex-wrap items-baseline justify-between gap-6">
        <p className="m-0 font-mono text-[11px] tracking-[.2em] text-dim uppercase">
          08 — {t.playTitle}
        </p>
        <p className="m-0 max-w-[46ch] text-sm leading-[1.55] text-muted">{t.playDesc}</p>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] border border-bord bg-[#070605]">
        <div className="flex flex-col border-r border-bord">
          <div className="flex items-center justify-between border-b border-bord bg-bg2 px-3.5 py-[9px]">
            <span className="font-mono text-[10.5px] tracking-[.14em] text-dim">editor.js</span>
            <button
              onClick={run}
              className="cursor-pointer rounded-[2px] border-none bg-accent px-3.5 py-1.5 font-mono text-[10px] font-medium tracking-[.18em] text-bg uppercase hover:opacity-85"
            >
              {t.run}
            </button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="min-h-[240px] flex-1 resize-y border-none bg-transparent p-4 font-mono text-[12.5px] leading-[1.7] text-txt outline-none"
          />
        </div>
        <div className="flex flex-col">
          <div className="border-b border-bord bg-bg2 px-3.5 py-[9px]">
            <span className="font-mono text-[10.5px] tracking-[.14em] text-dim">console</span>
          </div>
          <div className="min-h-[240px] overflow-y-auto p-4 font-mono text-[12.5px] leading-[1.75] text-ok">
            {output.map((po, i) => (
              <div key={i} className="whitespace-pre-wrap">
                &gt; {po}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
