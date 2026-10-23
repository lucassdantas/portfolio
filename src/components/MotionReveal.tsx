"use client";

import { useEffect } from "react";

/** Textos animados na entrada: títulos ganham a cortina; o resto, subida com foco. */
const TEXT = "section h2, section h3, section p, section li, section dt, section dd";
/** Áreas com animação própria (ou em que esconder atrapalha). */
const SKIP = "#orbita, #core, [data-reveal], [data-no-reveal], nav, dialog, [role='dialog']";

/**
 * Movimento de entrada dos textos do site inteiro, montado uma vez na página.
 *
 * - Títulos (h2/h3): sobem de trás de uma máscara (clip-path) desinclinando.
 * - Parágrafos, itens, rótulos: sobem de 26px saindo do desfoque, em cascata
 *   entre irmãos (atraso por posição, até 6 passos).
 * - Nada que já está na tela no carregamento é escondido: o primeiro conteúdo
 *   pinta na hora (LCP intacto) e só o que está abaixo da dobra anima.
 * - Elemento montado depois (troca do carrossel, acordeão aberto) não passa
 *   por aqui — aparece direto, com a animação própria de cada componente.
 * - Com `prefers-reduced-motion`, não faz nada.
 */
export function MotionReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // prepara só com o navegador ocioso, depois do carregamento: medir e marcar
    // centenas de elementos não pode disputar com a primeira pintura (TBT/LCP)
    let teardown: (() => void) | undefined;
    const ric =
      window.requestIdleCallback ??
      ((cb: () => void) => window.setTimeout(cb, 300) as unknown as number);
    const cic = window.cancelIdleCallback ?? window.clearTimeout;
    let idleId = 0;
    const schedule = () => {
      idleId = ric(
        () => {
          teardown = setup();
        },
        { timeout: 2000 }
      );
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      window.removeEventListener("load", schedule);
      cic(idleId);
      teardown?.();
    };
  }, []);

  return null;
}

/** Marca os textos abaixo da dobra e revela cada um ao entrar na tela. */
function setup(): () => void {
  const vh = window.innerHeight;
  const els = Array.from(document.querySelectorAll<HTMLElement>(TEXT)).filter(
    (el) => !el.closest(SKIP) && el.getBoundingClientRect().top > vh * 0.95
  );

  const timers: ReturnType<typeof setTimeout>[] = [];
  // quem é observado → quem é revelado. Título começa recortado (clip-path) e,
  // para o Chrome, área visível zero nunca "entra na tela": observa-se o pai.
  const targets = new Map<Element, HTMLElement[]>();
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        (targets.get(en.target) ?? []).forEach((el) => {
          el.classList.add("ld-rv-in");
          // depois da entrada, devolve o elemento ao estado normal (sem clip,
          // sem transição pendurada): sombra de texto e hover voltam a funcionar
          timers.push(
            setTimeout(() => {
              el.classList.remove("ld-rv", "ld-rv-h", "ld-rv-t", "ld-rv-in");
              el.style.removeProperty("--rv-d");
            }, 1700)
          );
        });
      });
    },
    { threshold: 0, rootMargin: "0px 0px -8% 0px" }
  );

  els.forEach((el) => {
    const isHeading = el.tagName === "H2" || el.tagName === "H3";
    const sibs = el.parentElement ? Array.from(el.parentElement.children) : [el];
    const idx = Math.min(6, sibs.indexOf(el));
    el.style.setProperty("--rv-d", `${idx * 70}ms`);
    el.classList.add("ld-rv", isHeading ? "ld-rv-h" : "ld-rv-t");
    const watch = isHeading && el.parentElement ? el.parentElement : el;
    targets.set(watch, [...(targets.get(watch) ?? []), el]);
    io.observe(watch);
  });

  return () => {
    io.disconnect();
    timers.forEach(clearTimeout);
  };
}
