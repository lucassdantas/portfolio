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
    <section id="playground" className="mx-auto max-w-[1000px] px-8 pb-10 pt-[100px]">
      <p className="mb-2 font-mono text-sm text-accent">06 — {t.playTitle}</p>
      <p className="mb-6 text-base text-muted">{t.playDesc}</p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] overflow-hidden rounded-xl border border-[#16233A]">
        <div className="flex flex-col bg-[#060D18]">
          <div className="flex items-center justify-between border-b border-[#16233A] bg-[#0B1524] px-4 py-2.5">
            <span className="font-mono text-xs text-[#8C98AB]">editor.js</span>
            <button
              onClick={run}
              className="cursor-pointer rounded-md border-none bg-[#1D94E3] px-4 py-1.5 font-mono text-xs font-bold text-white hover:opacity-85"
            >
              {t.run}
            </button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="min-h-[220px] flex-1 resize-y border-none bg-transparent p-4 font-mono text-[13px] leading-[1.6] text-[#E2E8F0] outline-none"
          />
        </div>
        <div className="flex flex-col border-l border-[#16233A] bg-[#04080F]">
          <div className="border-b border-[#16233A] bg-[#0B1524] px-4 py-2.5">
            <span className="font-mono text-xs text-[#8C98AB]">console</span>
          </div>
          <div className="min-h-[220px] overflow-y-auto p-4 font-mono text-[13px] leading-[1.7]">
            {output.map((po, i) => (
              <div key={i} className="whitespace-pre-wrap text-[#22C55E]">
                &gt; {po}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
