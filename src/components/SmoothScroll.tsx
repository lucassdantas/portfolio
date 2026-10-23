"use client";

import { useEffect } from "react";

/** Quanto do caminho até o alvo a página anda por quadro (menor = mais "manteiga"). */
const EASE = 0.085;
/** Ganho por clique de roda: deltas de mouse vêm em ~100px; trackpad, em passos finos. */
const WHEEL_GAIN = 1.0;

/**
 * Rolagem suave com inércia na roda do mouse — o mesmo princípio do Lenis
 * (alvo virtual + interpolação por quadro), sem lib.
 *
 * - Só a roda é interceptada. Teclado, barra de rolagem, âncoras e
 *   `scrollIntoView` continuam nativos; quando a rolagem muda por fora, o alvo
 *   é ressincronizado com a posição real.
 * - Desligado em toque (o celular já tem inércia própria) e com
 *   `prefers-reduced-motion`.
 * - Não rouba a roda de quem tem rolagem própria (terminal, chat, modal,
 *   textarea) nem quando a página está travada (`overflow: hidden` no body).
 */
export function SmoothScroll() {
  useEffect(() => {
    const touch = window.matchMedia("(hover: none)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (touch || reduced) return;

    const root = document.documentElement;
    const prevBehavior = root.style.scrollBehavior;
    // scroll-behavior: smooth no CSS faria cada scrollTo do loop animar sozinho
    root.style.scrollBehavior = "auto";

    let target = window.scrollY;
    let current = window.scrollY;
    let raf = 0;
    let animating = false;
    let lastWritten = -1;

    const maxScroll = () => root.scrollHeight - window.innerHeight;

    /** Algum ancestral do alvo do evento rola sozinho na direção pedida? */
    const ownsScroll = (el: Element | null, dy: number): boolean => {
      for (let n = el; n && n !== document.body; n = n.parentElement) {
        if (n instanceof HTMLTextAreaElement) return true;
        const oy = getComputedStyle(n).overflowY;
        if ((oy === "auto" || oy === "scroll") && n.scrollHeight > n.clientHeight + 1) {
          if (dy > 0 && n.scrollTop + n.clientHeight < n.scrollHeight - 1) return true;
          if (dy < 0 && n.scrollTop > 0) return true;
        }
      }
      return false;
    };

    // velocidade da rolagem (-1..1) em --ld-vel: cards e imagens inclinam de leve
    // com ela (ver .ld-media em globals.css) e voltam ao parar
    const setVel = (v: number) => root.style.setProperty("--ld-vel", v.toFixed(3));

    const tick = () => {
      setVel(Math.max(-1, Math.min(1, (target - current) / 900)));
      current += (target - current) * EASE;
      if (Math.abs(target - current) < 0.4) current = target;
      const y = Math.round(current * 100) / 100;
      lastWritten = y;
      window.scrollTo(0, y);
      if (current !== target) {
        raf = requestAnimationFrame(tick);
      } else {
        animating = false;
        setVel(0);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.defaultPrevented) return; // zoom do navegador
      if (document.body.style.overflow === "hidden") return;
      if (ownsScroll(e.target as Element, e.deltaY)) return;
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? window.innerHeight : 1;
      if (!animating) current = window.scrollY;
      target = Math.max(0, Math.min(maxScroll(), target + e.deltaY * unit * WHEEL_GAIN));
      if (!animating) {
        animating = true;
        raf = requestAnimationFrame(tick);
      }
    };

    // rolagem vinda de fora (teclado, barra, âncora): o alvo passa a ser onde a página está
    const onScroll = () => {
      if (animating && Math.abs(window.scrollY - lastWritten) < 2) return;
      if (animating) {
        cancelAnimationFrame(raf);
        animating = false;
      }
      target = current = window.scrollY;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      root.style.scrollBehavior = prevBehavior;
      root.style.removeProperty("--ld-vel");
    };
  }, []);

  return null;
}
