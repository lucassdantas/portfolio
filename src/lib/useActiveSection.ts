"use client";

import { useEffect, useState } from "react";

/**
 * Qual das seções `ids` a pessoa está lendo agora: a última cujo topo já
 * passou de 40% da altura da tela. Antes da primeira, devolve `null`.
 *
 * Usado pela Navbar (link aceso) e pela SectionRail (traço azul + nome),
 * para as duas concordarem sempre. Escuta scroll com rAF (uma leitura de
 * layout por quadro, não por evento).
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
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [key]);

  return active;
}
