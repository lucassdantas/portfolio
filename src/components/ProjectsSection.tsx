"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { projects } from "@/data";
import { RichLine } from "./RichLine";

const AUTOPLAY_MS = 6500;
const AUTOPLAY_MS_REDUCED = 9000;

export function ProjectsSection() {
  const { t, lang } = useLanguage();
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  const [index, setIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const holdRef = useRef(false);
  // Assume visível até o IntersectionObserver dizer o contrário — evita
  // esperar o primeiro callback (que em browsers reais chega quase
  // instantâneo) para autoplay/teclado funcionarem.
  const inViewRef = useRef(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const go = useCallback(
    (n: number) => {
      setIndex(((n % featured.length) + featured.length) % featured.length);
    },
    [featured.length]
  );

  const restartAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (holdRef.current || !inViewRef.current || document.hidden) return;
      setIndex((i) => (i + 1) % featured.length);
    }, reducedRef.current ? AUTOPLAY_MS_REDUCED : AUTOPLAY_MS);
  }, [featured.length]);

  const manual = useCallback(
    (n: number) => {
      go(n);
      restartAutoplay();
    },
    [go, restartAutoplay]
  );

  useEffect(() => {
    restartAutoplay();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [restartAutoplay]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const io = new IntersectionObserver(
      (entries) => {
        inViewRef.current = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0.15 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (!inViewRef.current) return;
      if (e.key === "ArrowRight") manual(index + 1);
      else if (e.key === "ArrowLeft") manual(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, manual]);

  const current = featured[index];
  const flip = index % 2 === 1;

  return (
    <section id="projetos" ref={sectionRef} data-stg="3" className="relative py-[clamp(70px,14vh,150px)]">
      <div className="mb-[clamp(20px,4vh,50px)] flex flex-wrap items-baseline justify-between gap-6 px-5 sm:px-8">
        <p className="m-0 font-mono text-[11px] tracking-[.2em] text-dim uppercase">
          06 — {t.projTitle}
        </p>
        <p className="m-0 max-w-[46ch] text-sm leading-[1.55] text-muted">{t.projDesc}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 px-5 pb-[clamp(18px,3vh,32px)] sm:px-8">
        {featured.map((p, i) => (
          <button
            key={p.name}
            onClick={() => manual(i)}
            aria-current={i === index}
            className={`cursor-pointer rounded-[2px] border px-[11px] py-[7px] font-mono text-[11px] tracking-[.12em] transition-[color,border-color,background] duration-[.25s] ${
              i === index ? "border-txt bg-txt text-bg" : "border-bord bg-transparent text-dim hover:text-txt hover:border-strong"
            }`}
          >
            {String(i + 1).padStart(2, "0")}
          </button>
        ))}
        <span className="flex-1" />
        <span className="font-mono text-[11px] tracking-[.14em] text-dim uppercase">{current.name}</span>
        <button
          onClick={() => manual(index - 1)}
          aria-label="anterior"
          className="h-11 w-11 cursor-pointer rounded-[2px] border border-bord bg-transparent font-mono text-[13px] text-txt transition-colors hover:border-accent hover:text-accent"
        >
          ←
        </button>
        <button
          onClick={() => manual(index + 1)}
          aria-label="próximo"
          className="h-11 w-11 cursor-pointer rounded-[2px] border border-bord bg-transparent font-mono text-[13px] text-txt transition-colors hover:border-accent hover:text-accent"
        >
          →
        </button>
      </div>

      <div
        ref={stageRef}
        data-testid="proj-stage"
        onMouseEnter={() => {
          holdRef.current = true;
        }}
        onMouseLeave={() => {
          holdRef.current = false;
        }}
        className="grid min-h-[92svh] grid-cols-1 items-center gap-[clamp(24px,4vw,64px)] border-t border-bord px-5 py-[clamp(50px,8vh,100px)] sm:px-8 md:grid-cols-[minmax(0,.92fr)_minmax(0,1.08fr)]"
      >
        <div className={flip ? "md:order-2" : "md:order-1"}>
          <p className="m-0 mb-[clamp(14px,2.4vh,26px)] font-mono text-[10.5px] tracking-[.24em] text-accent uppercase">
            Project {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="m-0 mb-3 text-[clamp(28px,3.9vw,60px)] leading-[1] font-semibold tracking-[-.035em] [text-wrap:balance]">
            {current.name}
          </h3>
          <p className="m-0 mb-[clamp(18px,3vh,30px)] font-mono text-[10.5px] tracking-[.2em] text-dim uppercase">
            {current.cat === "Sistemas" ? t.catSys : t.catSite}
          </p>
          <div className="flex max-w-[46ch] flex-col gap-2.5">
            {current.desc[lang].map((line, i) => (
              <p key={i} className="m-0 text-[14.5px] leading-[1.6] text-muted [text-wrap:pretty]">
                <RichLine text={line} />
              </p>
            ))}
          </div>
          <div className="mt-[clamp(18px,3vh,30px)] flex flex-wrap gap-1.5">
            {current.tech.map((tc) => (
              <span
                key={tc}
                className="rounded-[2px] border border-bord px-2 py-1 font-mono text-[10.5px] tracking-[.1em] text-dim uppercase"
              >
                {tc}
              </span>
            ))}
          </div>
          {current.live && (
            <a
              href={current.live}
              target="_blank"
              rel="noreferrer"
              className="mt-[clamp(18px,3vh,28px)] inline-block border-b border-accent/35 pb-[3px] font-mono text-[11.5px] tracking-[.1em] text-accent"
            >
              {current.live.replace(/^https?:\/\//, "")} ↗
            </a>
          )}
          {!current.live && current.repo && (
            <a
              href={current.repo}
              target="_blank"
              rel="noreferrer"
              className="mt-[clamp(18px,3vh,28px)] inline-block border-b border-accent/35 pb-[3px] font-mono text-[11.5px] tracking-[.1em] text-accent"
            >
              github ↗
            </a>
          )}
        </div>
        <div
          className={`relative aspect-[16/10.5] overflow-hidden border border-bord bg-bg2 ${flip ? "md:order-1" : "md:order-2"}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={current.img}
            src={current.img}
            alt={current.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover grayscale-[35%] transition-[filter] duration-700 hover:grayscale-0"
          />
        </div>
      </div>

      <div className="px-5 pt-[clamp(50px,9vh,110px)] pb-[clamp(30px,5vh,60px)] sm:px-8">
        <p className="m-0 mb-[clamp(18px,3vh,32px)] font-mono text-[11px] tracking-[.2em] text-dim uppercase">
          {"// " + t.secIndex}
        </p>
        <div className="border-t border-bord">
          {rest.map((p) =>
            p.live || p.repo ? (
              <a
                key={p.name}
                href={p.live || p.repo}
                target="_blank"
                rel="noreferrer"
                className="grid grid-cols-1 items-baseline gap-1 border-b border-bord py-4 transition-[padding-left] duration-[.35s] hover:pl-3.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_90px] sm:gap-5"
              >
                <span className="text-[17px] font-medium tracking-[-.015em] text-txt">{p.name}</span>
                <span className="font-mono text-[11px] tracking-[.08em] text-dim">{p.tech.join(" · ")}</span>
                <span className="text-left font-mono text-[11px] tracking-[.14em] text-accent sm:text-right">↗</span>
              </a>
            ) : (
              <div
                key={p.name}
                className="grid grid-cols-1 items-baseline gap-1 border-b border-bord py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_90px] sm:gap-5"
              >
                <span className="text-[17px] font-medium tracking-[-.015em] text-txt">{p.name}</span>
                <span className="font-mono text-[11px] tracking-[.08em] text-dim">{p.tech.join(" · ")}</span>
                <span className="text-left font-mono text-[11px] tracking-[.14em] text-dim uppercase sm:text-right">
                  {p.status === "internal" ? t.internal : t.offline}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
