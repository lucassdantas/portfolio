"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { projects, site } from "@/data";
import { Reveal } from "./Reveal";
import { RichLine } from "./RichLine";

type Cat = "featured" | "all" | "Sistemas" | "Sites";

export function ProjectsSection() {
  const { t, lang } = useLanguage();
  // abre nos destaques: a lista completa é longa demais para ser a primeira coisa
  const [cat, setCat] = useState<Cat>("featured");

  const cats: { v: Cat; l: string }[] = [
    { v: "featured", l: t.projFeatured },
    { v: "Sistemas", l: "Sistemas" },
    { v: "Sites", l: "Sites" },
    { v: "all", l: t.all },
  ];
  const filtered = projects.filter((p) => {
    if (cat === "all") return true;
    if (cat === "featured") return p.featured;
    return p.cat === cat;
  });
  const metricLabels = [t.featM1, t.featM2, t.featM3];

  return (
    <section id="projetos" className="mx-auto max-w-[1200px] px-8 pb-10 pt-[100px]">
      <p className="mb-2 font-mono text-sm text-accent">04 — {t.projTitle}</p>
      <p className="mb-9 max-w-[640px] text-base text-muted">{t.projDesc}</p>

      {/* Case em destaque — sempre dark */}
      <Reveal>
        <div className="relative mb-11 overflow-hidden rounded-[14px] border border-[#16233A] bg-[#060D18] p-[34px]">
          <div className="absolute right-0 top-0 h-[280px] w-[280px] bg-[radial-gradient(circle_at_top_right,rgba(29,148,227,.18),transparent_70%)]" />
          <p className="mb-2.5 font-mono text-[13px] text-[#1D94E3]">{"// " + t.featured}</p>
          <h3 className="mb-3 text-[26px] font-semibold text-[#E2E8F0]">{site.featuredCase.title}</h3>
          <p className="mb-[26px] max-w-[720px] text-[15.5px] leading-[1.6] text-[#8C98AB] [text-wrap:pretty]">
            {t.featDesc}
          </p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
            {site.featuredCase.metrics.map((m, i) => (
              <div key={i} className="rounded-[10px] border border-[#16233A] bg-[#0B1524] p-4">
                <div className="font-mono text-[21px] font-bold" style={{ color: m.color }}>
                  {m.value}
                </div>
                <div className="mt-[5px] text-[12.5px] text-[#8C98AB]">{metricLabels[i]}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="mb-7 flex flex-wrap gap-2.5">
        {cats.map((c) => (
          <button
            key={c.v}
            onClick={() => setCat(c.v)}
            className={`cursor-pointer rounded-[20px] px-[18px] py-2 font-mono text-[13px] ${
              cat === c.v
                ? "border border-accent bg-accent text-white"
                : "border border-bord bg-transparent text-muted"
            }`}
          >
            {c.l}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(330px,1fr))] gap-6">
        {filtered.map((p) => (
          <div
            key={p.name}
            className="group flex flex-col overflow-hidden rounded-xl border border-bord bg-card transition-[transform,border-color] duration-[250ms] hover:-translate-y-[5px] hover:border-accent"
          >
            <div className="h-[180px] overflow-hidden bg-bg2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.img}
                alt={p.name}
                width={800}
                height={365}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-top grayscale-[35%] transition-[filter,transform] duration-300 group-hover:scale-[1.04] group-hover:grayscale-0"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2.5 px-5 py-[18px]">
              <div className="flex items-baseline justify-between gap-2.5">
                <h3 className="text-[17px] font-semibold">{p.name}</h3>
                <span className="whitespace-nowrap rounded-[20px] border border-bord px-[9px] py-[3px] font-mono text-[10.5px] text-accent">
                  {p.cat}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-[5px]">
                {p.desc[lang].map((line, i) => (
                  <p
                    key={i}
                    className="text-[13.5px] leading-[1.5] text-muted [text-wrap:pretty]"
                  >
                    <RichLine text={line} />
                  </p>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {p.tech.map((tech) => (
                  <span key={tech} className="font-mono text-[10.5px] text-muted">
                    #{tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-3.5 font-mono text-[12.5px]">
                {p.live && (
                  <a href={p.live} target="_blank" rel="noreferrer" className="hover:text-txt">
                    ↗ live
                  </a>
                )}
                {p.repo && (
                  <a href={p.repo} target="_blank" rel="noreferrer" className="hover:text-txt">
                    ↗ github
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
