"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ambient as AmbientEngine } from "@/lib/ambient";

/** Arquivos da cena (public/astro-hero): three r147 isolado em window.THREE, geometria e o componente. */
const BASE = "/astro-hero/";
const SCRIPTS = {
  three: `${BASE}vendor/three-r147-bundle.js`,
  geo: `${BASE}assets/astro_geo.js`,
  hero: `${BASE}astro-hero.js`,
};
/** Cor e Terra em WebP; mapas de normal/oclusão ficam em JPG (em WebP ficavam maiores). */
const ext = (name: string) => (/^(baseColor_|earth_day|earth_lights|earth_clouds)/.test(name) ? ".webp" : ".jpg");

type HeroTexts = {
  title: string;
  hint: string;
  midTop: string;
  midBottom: string;
  final: string;
  cta: string;
  ctaHref: string;
  loading: string;
};
type HeroApi = {
  prepareEnv: () => boolean;
  prewarm: () => void;
  programsReady: () => boolean;
  uploadNextTexture: () => "uploaded" | "waiting" | "done";
  warmFrame: () => void;
  isLoaded: () => boolean;
};
type HeroInstance = { api: HeroApi; setTexts: (t: Partial<HeroTexts>) => void; destroy: () => void };
type AstroHeroGlobal = {
  mount: (
    root: HTMLElement,
    opts: {
      assetsPath: string;
      texts: HeroTexts;
      ariaLabel?: string;
      ext?: (name: string) => string;
      scale?: number;
      onFrame?: (s: { p: number }) => void;
    }
  ) => HeroInstance;
};

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const loadScript = (src: string) =>
  new Promise<void>((resolve, reject) => {
    const prev = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (prev) {
      if (prev.dataset.ready) resolve();
      else {
        prev.addEventListener("load", () => resolve());
        prev.addEventListener("error", () => reject(new Error(src)));
      }
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => {
      s.dataset.ready = "1";
      resolve();
    };
    s.onerror = () => reject(new Error(src));
    document.body.appendChild(s);
  });

/**
 * Interlúdio do astronauta (3ª seção, logo depois do manifesto): a cena em três
 * atos de `public/astro-hero/` — Terra → quarta dimensão → planeta calmo —,
 * conduzida pela rolagem dentro de uma seção de 600vh com palco sticky.
 *
 * Desempenho (a seção fica perto do topo, então isto é o que importa):
 * - Nada é baixado no carregamento: quem só mede a página (PageSpeed) não
 *   rola. Tudo começa na primeira interação real (rolagem, toque, tecla).
 * - Os scripts baixam em paralelo, mas são avaliados um por pausa da rolagem
 *   (`whenCalm`: 220ms sem rolar; ou na marra quando a seção está a 1,5 tela).
 * - Depois de montar: todos os shaders compilam em paralelo
 *   (KHR_parallel_shader_compile, `api.prewarm`), as texturas sobem uma por
 *   pausa e um quadro de aquecimento roda fora da tela. Só então a seção
 *   aparece — o primeiro quadro visível não compila nem sobe nada.
 * - O laço da cena só desenha com a seção na tela.
 * - Sem WebGL: os textos ficam estáticos, com o botão para o contato.
 */
export function OrbitSection() {
  const { lang, t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HeroInstance | null>(null);
  const [mode, setMode] = useState<"placeholder" | "mounted" | "static">("placeholder");

  const texts = useMemo<HeroTexts>(
    () => ({
      title: t.orbitA,
      hint: t.orbitHint,
      midTop: t.orbitMidTop,
      midBottom: t.orbitMidBottom,
      final: escapeHtml(t.orbitB).replace(/\n/g, "<br>"),
      cta: t.orbitCta,
      ctaHref: "#contato",
      loading: t.orbitLoading,
    }),
    [t]
  );
  const textsRef = useRef(texts);
  textsRef.current = texts;

  useEffect(() => {
    heroRef.current?.setTexts(texts);
  }, [texts, lang]);

  useEffect(() => {
    const section = sectionRef.current;
    const host = mountRef.current;
    if (!section || !host) return;

    const hasWebGL = (() => {
      try {
        const c = document.createElement("canvas");
        return !!(c.getContext("webgl2") || c.getContext("webgl"));
      } catch {
        return false;
      }
    })();
    if (!hasWebGL) {
      setMode("static");
      return;
    }

    let disposed = false;

    // fila de trabalho pesado: roda quando a rolagem para por um instante
    const calmQueue: (() => void)[] = [];
    let calmTimer = 0;
    let lastScrollAt = performance.now();
    const noteScroll = () => {
      lastScrollAt = performance.now();
    };
    window.addEventListener("scroll", noteScroll, { passive: true });
    const pump = () => {
      calmTimer = 0;
      if (disposed || !calmQueue.length) return;
      const urgent = section.getBoundingClientRect().top < window.innerHeight * 1.5;
      if (urgent || performance.now() - lastScrollAt > 220) calmQueue.shift()!();
      if (calmQueue.length) calmTimer = window.setTimeout(pump, 90);
    };
    const calm = () =>
      new Promise<void>((resolve) => {
        calmQueue.push(resolve);
        if (!calmTimer) calmTimer = window.setTimeout(pump, 0);
      });
    const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

    let amb: typeof AmbientEngine | null = null;
    void import("@/lib/ambient").then((m) => {
      amb = m.ambient;
    });

    const start = async () => {
      try {
        // baixa tudo em paralelo (rede); avalia um por vez, em pausas
        const pre = [SCRIPTS.three, SCRIPTS.geo, SCRIPTS.hero].map((src) =>
          fetch(src, { priority: "low" } as RequestInit).catch(() => null)
        );
        await Promise.all(pre);
        if (disposed) return;
        await calm();
        await loadScript(SCRIPTS.three);
        await calm();
        await loadScript(SCRIPTS.hero);
        await calm();
        const geo = loadScript(SCRIPTS.geo);
        if (disposed) return;

        await calm();
        const AstroHero = (window as unknown as { AstroHero?: AstroHeroGlobal }).AstroHero;
        if (!AstroHero) throw new Error("AstroHero ausente");
        const hero = AstroHero.mount(host, {
          assetsPath: `${BASE}assets/`,
          texts: textsRef.current,
          ariaLabel: t.orbitAria,
          ext,
          // escala de render fixa (trocar depois realoca tudo e trava): menor no toque
          scale: window.matchMedia("(hover: none)").matches || window.innerWidth < 820 ? 0.7 : 0.9,
          onFrame: (s) => {
            const p = s.p;
            amb?.setIntensity(Math.min(1, p * 6) * (1 - Math.max(0, (p - 0.85) / 0.15)));
          },
        });
        heroRef.current = hero;
        setMode("mounted");

        // geometria do astronauta (o componente monta o modelo quando ela chega)
        await geo;
        for (let i = 0; i < 100 && !hero.api.isLoaded() && !disposed; i++) await wait(100);
        if (disposed) return;

        // mapas de ambiente (um por pausa) — antes de compilar: eles mudam os shaders
        for (let i = 0; i < 5 && !disposed; i++) {
          await calm();
          const done = hero.api.prepareEnv();
          // a 1ª chamada só manda compilar: espera o driver antes de desenhar
          for (let k = 0; k < 60 && !hero.api.programsReady() && !disposed; k++) await wait(100);
          if (done) break;
        }
        if (disposed) return;

        // shaders: compila tudo em paralelo e espera o driver terminar
        await calm();
        hero.api.prewarm();
        for (let i = 0; i < 80 && !hero.api.programsReady() && !disposed; i++) await wait(100);

        // texturas: uma por pausa, conforme chegam da rede
        for (let i = 0; i < 400 && !disposed; i++) {
          await calm();
          const r = hero.api.uploadNextTexture();
          if (r === "done") break;
          if (r === "waiting") await wait(150);
        }
        if (disposed) return;

        // quadro completo fora da tela: passes de bloom, alvos de render, uniforms
        await calm();
        hero.api.warmFrame();
      } catch (e) {
        if (!disposed) {
          console.warn(e);
          heroRef.current?.destroy();
          heroRef.current = null;
          setMode("static");
        }
      }
    };

    // gatilho: primeira interação real (o PageSpeed não interage)
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
    // aberto já rolado (recarregar no meio da página, link com âncora)
    if (window.scrollY > 40) kick();

    return () => {
      disposed = true;
      off();
      window.removeEventListener("scroll", noteScroll);
      clearTimeout(calmTimer);
      calmQueue.length = 0;
      heroRef.current?.destroy();
      heroRef.current = null;
      amb?.setIntensity(0);
    };
    // os textos entram por textsRef/setTexts; montar de novo a cada idioma recriaria o WebGL
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finalLines = t.orbitB.split("\n");

  return (
    <section
      ref={sectionRef}
      id="orbita"
      aria-label={t.orbitAria}
      className="relative h-[600vh] bg-[#020208] min-[1100px]:-mr-12"
    >
      {/* espaço reservado (vem do servidor): mesma altura e o título no lugar,
          para nada abaixo pular quando a cena montar */}
      {mode !== "mounted" && (
        <div className="absolute inset-0">
          <div className="sticky top-0 flex h-[100svh] flex-col justify-between overflow-hidden px-5 pt-[clamp(88px,17vh,180px)] pb-7 sm:px-[clamp(20px,3.4vw,56px)]">
            <h2 className="m-0 w-max max-w-[min(7.6em,100%)] text-balance text-[clamp(52px,7.6vw,124px)] leading-[.92] font-bold tracking-[-.05em] text-[#F4F6FF]">
              {t.orbitA}
            </h2>
            {mode === "static" ? (
              <div className="flex flex-col items-start gap-7">
                <p className="m-0 text-[clamp(40px,5.6vw,96px)] leading-[.92] font-bold tracking-[-.05em] text-[#FFF6EE]">
                  {finalLines.map((l, i) => (
                    <span key={i} className="block">
                      {l}
                    </span>
                  ))}
                </p>
                <a
                  href="#contato"
                  className="inline-flex min-h-12 items-center gap-3 rounded-full border border-[rgba(255,246,238,.55)] px-[22px] text-base font-semibold text-[#F4F1EC] no-underline"
                >
                  {t.orbitCta} <span aria-hidden>→</span>
                </a>
              </div>
            ) : (
              <p className="m-0 self-end font-mono text-[11px] tracking-[.2em] text-[#9AA4C2] uppercase">{t.orbitLoading}</p>
            )}
          </div>
        </div>
      )}
      {/* a cena monta aqui (o componente cria a própria seção interna com 100% de altura) */}
      <div ref={mountRef} className="absolute inset-0" />
      <p className="pointer-events-none absolute right-5 bottom-3 m-0 font-mono text-[9.5px] tracking-[.16em] text-[#9AA4C2]/70 uppercase">
        {t.orbitCredit}
      </p>
    </section>
  );
}
