"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { projects } from "@/data";
import { tx } from "@/lib/i18n";
import { RichLine } from "./RichLine";

const AUTOPLAY_MS = 6500;
const AUTOPLAY_MS_REDUCED = 9000;
/** Passo do relógio do autoplay — também é a resolução da barra de progresso. */
const TICK_MS = 50;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Carrossel de projetos em destaque + índice compacto dos demais.
 *
 * O autoplay é um relógio que só acumula tempo quando a pessoa NÃO está com
 * o mouse no palco, a seção está visível e a aba está ativa; a barra no item
 * ativo é esse mesmo relógio, então ela mostra exatamente quando vai trocar
 * (e para junto quando pausa). A troca anima o texto e a imagem na direção
 * da navegação.
 *
 * `data-pdim` pede ao campo de partículas de fundo que recue enquanto esta
 * seção está no centro da tela — o efeito continua, mas não compete com a leitura.
 */
export function ProjectsSection() {
  const { t, lang } = useLanguage();
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  const total = featured.length;

  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [held, setHeld] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const holdRef = useRef(false);
  // Assume visível até o IntersectionObserver dizer o contrário — evita
  // esperar o primeiro callback (que em browsers reais chega quase
  // instantâneo) para autoplay/teclado funcionarem.
  const inViewRef = useRef(true);
  const elapsedRef = useRef(0);
  const barRef = useRef<HTMLSpanElement>(null);
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const resetClock = () => {
    elapsedRef.current = 0;
    if (barRef.current) barRef.current.style.transform = "scaleX(0)";
  };

  const manual = useCallback(
    (n: number) => {
      setDir(n < index ? -1 : 1);
      setIndex(((n % total) + total) % total);
      resetClock();
    },
    [index, total]
  );

  useEffect(() => {
    const id = setInterval(() => {
      if (holdRef.current || !inViewRef.current || document.hidden) return;
      const dur = reducedRef.current ? AUTOPLAY_MS_REDUCED : AUTOPLAY_MS;
      elapsedRef.current += TICK_MS;
      if (barRef.current) barRef.current.style.transform = `scaleX(${Math.min(1, elapsedRef.current / dur)})`;
      if (elapsedRef.current >= dur) {
        resetClock();
        setDir(1);
        setIndex((i) => (i + 1) % total);
      }
    }, TICK_MS);
    return () => clearInterval(id);
  }, [total]);

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

  const hold = (on: boolean) => {
    holdRef.current = on;
    setHeld(on);
  };

  const current = featured[index];
  const next = featured[(index + 1) % total];
  const flip = index % 2 === 1;
  // a classe de entrada depende da direção: avançar entra pela direita
  const swap = dir === 1 ? "ld-swap-next" : "ld-swap-prev";

  return (
    <section
      id="projetos"
      ref={sectionRef}
      data-stg="3"
      data-pdim="0.75"
      className="relative py-[clamp(60px,11vh,130px)]"
    >
      <div className="mb-[clamp(20px,4vh,50px)] flex flex-wrap items-baseline justify-between gap-6 px-5 sm:px-8">
        <p className="m-0 font-mono text-[11px] tracking-[.2em] text-muted uppercase">
          06 — {t.projTitle}
        </p>
        <p className="m-0 max-w-[46ch] text-sm leading-[1.55] text-muted">{t.projDesc}</p>
      </div>

      {/* trilha: um número por projeto; o ativo carrega a barra do autoplay */}
      <div className="flex flex-wrap items-center gap-2 px-5 pb-[clamp(14px,2.4vh,24px)] sm:px-8">
        {featured.map((p, i) => {
          const on = i === index;
          return (
            <button
              key={p.name}
              onClick={() => manual(i)}
              aria-current={on}
              title={p.name}
              className={`relative cursor-pointer overflow-hidden rounded-[2px] border px-[11px] py-[7px] font-mono text-[11px] tracking-[.12em] transition-[color,border-color,background] duration-[.25s] ${
                on
                  ? "border-accent bg-accent/15 text-txt"
                  : "border-bord bg-bg/80 text-muted hover:border-strong hover:text-txt"
              }`}
            >
              {pad(i + 1)}
              {on && (
                <span
                  ref={barRef}
                  aria-hidden
                  className="absolute right-0 bottom-0 left-0 h-[2px] origin-left bg-accent"
                  style={{ transform: "scaleX(0)" }}
                />
              )}
            </button>
          );
        })}
        <span className="flex-1" />
        <span
          className={`hidden font-mono text-[10.5px] tracking-[.16em] text-warm uppercase transition-opacity duration-300 sm:inline ${
            held ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={!held}
        >
          ❚❚ {t.projPaused}
        </span>
        <p className="m-0 font-mono text-[clamp(18px,1.7vw,24px)] tracking-[.04em] text-txt" aria-live="polite">
          {pad(index + 1)}
          <span className="text-muted"> / {pad(total)}</span>
        </p>
        <button
          onClick={() => manual(index - 1)}
          aria-label={t.prevLabel}
          className="h-11 w-11 cursor-pointer rounded-[2px] border border-bord bg-bg/80 font-mono text-[13px] text-txt transition-colors hover:border-accent hover:text-accent"
        >
          ←
        </button>
        <button
          onClick={() => manual(index + 1)}
          aria-label={t.nextLabel}
          className="group flex h-11 cursor-pointer items-center gap-3 rounded-[2px] border border-bord bg-bg/80 px-3.5 font-mono text-[13px] text-txt transition-colors hover:border-accent hover:text-accent"
        >
          <span className="hidden max-w-[22ch] truncate text-[10.5px] tracking-[.14em] text-muted uppercase group-hover:text-accent md:inline">
            {next.name}
          </span>
          →
        </button>
      </div>

      <div
        data-testid="proj-stage"
        onMouseEnter={() => hold(true)}
        onMouseLeave={() => hold(false)}
        className="grid grid-cols-1 items-stretch gap-[clamp(16px,2.4vw,36px)] px-5 pb-[clamp(16px,3vh,32px)] sm:px-8 md:grid-cols-[minmax(0,.92fr)_minmax(0,1.08fr)]"
      >
        {/* véu de leitura: as partículas passam por trás desfocadas */}
        <div
          key={`txt-${index}`}
          className={`${swap} rounded-[3px] border border-bord bg-bg/55 p-[clamp(20px,2.6vw,40px)] backdrop-blur-[3px] ${flip ? "md:order-2" : "md:order-1"}`}
        >
          <p className="m-0 mb-[clamp(14px,2.4vh,26px)] font-mono text-[10.5px] tracking-[.24em] text-accent uppercase">
            {t.projLabel} {pad(index + 1)}
            <span className="text-muted"> · {current.cat === "Sistemas" ? t.catSys : t.catSite}</span>
          </p>
          <h3 className="m-0 mb-[clamp(12px,2vh,22px)] text-[clamp(26px,3.2vw,50px)] leading-[1] font-semibold tracking-[-.035em] [text-wrap:balance]">
            {current.name}
          </h3>
          {current.impact && (
            <div className="mb-[clamp(18px,3vh,30px)] border-l-2 border-warm pl-4">
              <p className="m-0 text-[clamp(34px,4.2vw,62px)] leading-none font-bold tracking-[-.04em] text-warm">
                {tx(current.impact.value, lang)}
              </p>
              <p className="m-0 mt-2 font-mono text-[11px] tracking-[.14em] text-strong uppercase">
                {current.impact.label[lang]}
              </p>
            </div>
          )}
          <div className="flex max-w-[46ch] flex-col gap-2.5">
            {current.desc[lang].map((line, i) => (
              <p key={i} className="m-0 text-[15px] leading-[1.6] text-strong [text-wrap:pretty]">
                <RichLine text={line} />
              </p>
            ))}
          </div>
          <div className="mt-[clamp(18px,3vh,30px)] flex flex-wrap gap-1.5">
            {current.tech.map((tc) => (
              <span
                key={tc}
                className="rounded-[2px] border border-bord px-2 py-1 font-mono text-[10.5px] tracking-[.1em] text-muted uppercase"
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
          key={`img-${index}`}
          className={`ld-wipe ld-vel relative aspect-[16/10.5] max-h-[min(64svh,600px)] overflow-hidden rounded-[3px] border border-bord bg-bg2 md:aspect-auto md:min-h-[min(56svh,520px)] ${flip ? "md:order-1" : "md:order-2"}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.img}
            alt={current.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover grayscale-[35%] transition-[filter] duration-700 hover:grayscale-0"
          />
        </div>
      </div>

      <div className="px-5 pt-[clamp(50px,9vh,110px)] pb-[clamp(30px,5vh,60px)] sm:px-8">
        <p className="m-0 mb-[clamp(18px,3vh,32px)] font-mono text-[11px] tracking-[.2em] text-muted uppercase">
          {"// " + t.secIndex}
        </p>
        {/* véu leve: a animação de fundo continua visível, mas não briga com o texto pequeno */}
        <div className="border border-bord bg-bg/50 backdrop-blur-[2px]">
          <div
            aria-hidden
            className="hidden grid-cols-[minmax(0,1fr)_minmax(0,1fr)_110px] gap-5 border-b border-bord px-3 py-2.5 font-mono text-[10px] tracking-[.2em] text-muted uppercase sm:grid"
          >
            <span>{t.idxProject}</span>
            <span>{t.idxTech}</span>
            <span className="text-right">{t.idxAccess}</span>
          </div>
          {rest.map((p) => {
            const cells = (
              <>
                <span className="flex flex-col gap-1">
                  <span className="text-[17px] font-medium tracking-[-.015em] text-txt">{p.name}</span>
                  {p.impact && (
                    <span className="font-mono text-[11px] tracking-[.08em] text-warm">
                      {tx(p.impact.value, lang)} · {p.impact.label[lang]}
                    </span>
                  )}
                </span>
                <span className="font-mono text-[11px] tracking-[.08em] text-muted">{p.tech.join(" · ")}</span>
              </>
            );
            const grid =
              "grid grid-cols-1 items-baseline gap-1 border-b border-bord px-3 py-4 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_110px] sm:gap-5";
            return p.live || p.repo ? (
              <a
                key={p.name}
                href={p.live || p.repo}
                target="_blank"
                rel="noreferrer"
                className={`${grid} transition-[padding-left,background] duration-[.35s] hover:bg-bg2 hover:pl-6`}
              >
                {cells}
                <span className="text-left font-mono text-[11px] tracking-[.14em] text-accent uppercase sm:text-right">{t.visit}</span>
              </a>
            ) : (
              <div key={p.name} className={grid}>
                {cells}
                <span className="text-left font-mono text-[11px] tracking-[.14em] text-muted uppercase sm:text-right">
                  {p.status === "internal" ? t.internal : t.offline}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
