"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ambient as AmbientEngine } from "@/lib/ambient";
import type { OrbitHeroInstance, OrbitHeroTexts } from "@/components/orbit-hero/orbitHero";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Interlúdio de partículas (3ª seção, logo depois do manifesto): a cena em três
 * atos de `orbit-hero/orbitHero.js` — planeta com um bug saindo de órbita →
 * tesserato 4D num túnel → órbitas calmas, com botão para o contato —, conduzida
 * pela rolagem numa seção de 600vh com palco sticky. WebGL puro, sem assets.
 *
 * - Nada é carregado no carregamento da página (o PageSpeed não interage): o
 *   módulo (~20KB) e a montagem começam na primeira interação real, e a
 *   montagem espera uma pausa da rolagem. Até lá, o servidor entrega o título.
 * - Trilha sonora: a batida eletrônica entra só no tesserato (2º ato) — a
 *   intensidade da `ambient` acompanha o peso desse ato; fora dele, o pad calmo.
 * - Sem WebGL, o próprio componente mostra só os textos, guiados pela rolagem.
 */
export function OrbitSection() {
  const { lang, t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<OrbitHeroInstance | null>(null);
  const [mounted, setMounted] = useState(false);

  const texts = useMemo<OrbitHeroTexts>(
    () => ({
      title: t.orbitA,
      hint: t.orbitHint,
      midTop: t.orbitMidTop,
      midBottom: t.orbitMidBottom,
      final: escapeHtml(t.orbitB).replace(/\n/g, "<br>"),
      finalSub: t.orbitFinalSub,
      cta: t.orbitCta,
      ctaHref: "#contato",
    }),
    [t]
  );
  const textsRef = useRef(texts);
  textsRef.current = texts;
  const ariaRef = useRef(t.orbitAria);
  ariaRef.current = t.orbitAria;

  useEffect(() => {
    heroRef.current?.setTexts(texts);
    heroRef.current?.element.querySelector("canvas")?.setAttribute("aria-label", t.orbitAria);
  }, [texts, lang, t.orbitAria]);

  useEffect(() => {
    const section = sectionRef.current;
    const host = mountRef.current;
    if (!section || !host) return;
    let disposed = false;

    // trilha: o módulo de áudio só é baixado se o som estiver ligado (preferência
    // `ldp-sound`, gravada pelo SoundToggle); conferida no máximo a cada 500ms
    let amb: typeof AmbientEngine | null = null;
    let loading = false;
    let intensity = 0;
    let prefStamp = 0;
    const setIntensity = (v: number) => {
      intensity = v;
      if (amb) {
        amb.setIntensity(v);
        return;
      }
      if (loading || v <= 0) return;
      const now = performance.now();
      if (now - prefStamp < 500) return;
      prefStamp = now;
      let on = false;
      try {
        on = localStorage.getItem("ldp-sound") === "on";
      } catch {
        /* sem storage: som desligado */
      }
      if (!on) return;
      loading = true;
      void import("@/lib/ambient").then((m) => {
        if (disposed) return;
        amb = m.ambient;
        amb.setIntensity(intensity);
      });
    };
    // saiu da seção (link da nav no meio do tesserato, por exemplo): volta ao calmo
    const io = new IntersectionObserver((es) => {
      if (!es[0]?.isIntersecting) setIntensity(0);
    });
    io.observe(section);

    // montagem numa pausa da rolagem (220ms parada) ou já, se a seção estiver perto
    let lastScrollAt = performance.now();
    const noteScroll = () => {
      lastScrollAt = performance.now();
    };
    window.addEventListener("scroll", noteScroll, { passive: true });
    const calm = () =>
      new Promise<void>((resolve) => {
        const check = () => {
          if (disposed) return;
          const near = section.getBoundingClientRect().top < window.innerHeight * 1.5;
          if (near || performance.now() - lastScrollAt > 220) resolve();
          else window.setTimeout(check, 90);
        };
        check();
      });

    const start = async () => {
      const { mountOrbitHero } = await import("@/components/orbit-hero/orbitHero");
      await calm();
      if (disposed) return;
      heroRef.current = mountOrbitHero(host, {
        texts: textsRef.current,
        ariaLabel: ariaRef.current,
        onFrame: (s) => setIntensity(Math.round(s.w2 * 100) / 100),
      });
      setMounted(true);
    };

    // gatilho: primeira interação real
    let started = false;
    const kick = () => {
      if (started) return;
      started = true;
      off();
      void start();
    };
    const onScroll = () => {
      if (window.scrollY > 40) kick();
    };
    const events: [string, EventListener][] = [
      ["scroll", onScroll],
      ["wheel", kick],
      ["touchstart", kick],
      ["keydown", kick],
      ["pointerdown", kick],
    ];
    const off = () => events.forEach(([e, f]) => window.removeEventListener(e, f));
    events.forEach(([e, f]) => window.addEventListener(e, f, { passive: true }));
    if (window.scrollY > 40) kick();

    return () => {
      disposed = true;
      off();
      io.disconnect();
      window.removeEventListener("scroll", noteScroll);
      heroRef.current?.destroy();
      heroRef.current = null;
      amb?.setIntensity(0);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="orbita"
      aria-label={t.orbitAria}
      className="relative h-[600vh] bg-[#02030a] min-[1100px]:-mr-12"
    >
      {/* espaço reservado vindo do servidor: o título no lugar, para nada pular ao montar */}
      {!mounted && (
        <div className="absolute inset-0">
          <div className="sticky top-0 h-[100svh] overflow-hidden px-5 pt-[clamp(88px,17vh,180px)] sm:px-[clamp(20px,3.4vw,56px)]">
            <h2 className="m-0 w-max max-w-[min(7.6em,100%)] text-[clamp(52px,7.6vw,124px)] leading-[.92] font-bold tracking-[-.05em] text-balance text-[#F4F6FF]">
              {t.orbitA}
            </h2>
          </div>
        </div>
      )}
      {/* a cena monta aqui (o componente cria a própria seção interna com 100% de altura) */}
      <div ref={mountRef} className="absolute inset-0" />
    </section>
  );
}
