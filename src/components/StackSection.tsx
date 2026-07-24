"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { stackGroups, principles } from "@/data";
import { Reveal } from "./Reveal";

export function StackSection() {
  const { t } = useLanguage();

  return (
    <section id="stack" className="mx-auto max-w-[1200px] px-8 pb-10 pt-[100px]">
      <p className="mb-2 font-mono text-sm text-accent">02 — {t.stackTitle}</p>
      <p className="mb-9 max-w-[640px] text-base text-muted">{t.stackDesc}</p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
        {stackGroups.map((sg) => (
          <Reveal key={sg.label}>
            <div className="h-full rounded-xl border border-bord bg-card p-[22px] hover:border-accent">
              <h3 className="mb-4 font-mono text-[15px] text-accent">{sg.label}</h3>
              <div className="flex flex-wrap gap-2">
                {sg.items.map((si) => (
                  <span
                    key={si.name}
                    className="inline-flex items-center gap-[7px] rounded-md border border-bord bg-bg2 px-[11px] py-1.5 font-mono text-[12.5px] text-txt hover:border-accent"
                  >
                    {si.img && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={si.img} alt="" className="h-4 w-4 object-contain" />
                    )}
                    {si.name}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="mt-14">
        <p className="mb-5 font-mono text-sm text-accent">{"// " + t.engTitle}</p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5">
          {principles.map((pr) => (
            <Reveal key={pr.title}>
              <div className="h-full rounded-xl border border-bord bg-bg2 p-[22px] hover:border-accent">
                <div className="mb-3 text-2xl">{pr.icon}</div>
                <h3 className="mb-2 text-[16.5px] font-semibold">{pr.title}</h3>
                <p className="text-[13.5px] leading-[1.55] text-muted [text-wrap:pretty]">{pr.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
