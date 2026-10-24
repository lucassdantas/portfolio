"use client";

import { useEffect, useState } from "react";

/**
 * Qual das seções `ids` a pessoa está lendo agora: a última cujo topo já
 * passou de 40% da altura da tela. Antes da primeira, devolve `null`.
 *
 * Usado pela Navbar (link aceso) e pela SectionRail (traço azul + nome),
 * para as duas concordarem sempre. Mede no máximo a cada 120ms: ler a posição
 * de 12 seções a cada quadro forçava layout da página inteira durante a rolagem.
 */
export function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join("|");

  useEffect(() => {
    const list = key.split("|");
    let raf = 0;
    const measure = () => {
      raf = 0;
      const mid = window.innerHeight * 0.4;
      let current: string | null = null;
      for (const id of list) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= mid) current = id;
      }
      setActive(current);
    };
    let last = 0;
    const onScroll = () => {
      if (raf) return;
      const wait = Math.max(0, 120 - (performance.now() - last));
      raf = window.setTimeout(() => {
        last = performance.now();
        measure();
      }, wait);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      clearTimeout(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [key]);

  return active;
}
