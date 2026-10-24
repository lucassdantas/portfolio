"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { makeProgram } from "@/shaders/particles";
import { VERTEX_SRC, buildAstronautSrc } from "@/shaders/astronaut";
import type { ambient as AmbientEngine } from "@/lib/ambient";

/** Janela de rolagem (0..1) em que cada frase aparece; fora dela, some. */
const CAPTIONS: [number, number][] = [
  [0.1, 0.34],
  [0.78, 0.95],
];
/** Onde ficam as transições do shader (marcas na barra de progresso). */
const MARKS = [0.4, 0.72];

const fade = (p: number, [a, b]: [number, number]) => {
  const w = 0.05;
  return Math.max(0, Math.min(1, (p - a) / w, (b - p) / w));
};

/**
 * Interlúdio rolável antes do contato: um astronauta raymarched
 * (`src/shaders/astronaut.ts`) cuja coreografia inteira — três tomadas e duas
 * transições — é conduzida pela rolagem. A seção tem ~4,5 telas de altura e o
 * palco fica preso (sticky); uma barra embaixo mostra o progresso e onde
 * estão as transições.
 *
 * Desempenho: o WebGL só é criado quando a seção chega perto da tela (não
 * pesa o carregamento), só desenha com ela visível e ajusta a resolução sozinho
 * se o quadro ficar lento.
 *
 * - Canvas transparente nas pontas: o céu entra e sai por cima das
 *   partículas do site, sem corte.
 * - Sem WebGL: canvas escondido, frases sempre visíveis.
 * - Arrastar gira o astronauta (no toque, só na horizontal: `touch-action: pan-y`).
 * - `prefers-reduced-motion`: o tempo do shader para; a rolagem continua
 *   conduzindo a cena (o movimento é da própria pessoa).
 */
export function OrbitSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const capRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    let cleanup: (() => void) | null = null;
    let started = false;

    const showStatic = () => {
      canvas.style.display = "none";
      capRefs.current.forEach((el) => {
        if (el) el.style.opacity = "1";
      });
    };

    // pedir o contexto é barato e diz já se há WebGL; compilar o shader é a
    // parte cara, e só acontece quando a seção se aproxima (start)
    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false });
    } catch {
      gl = null;
    }
    if (!gl) {
      showStatic();
      return;
    }

    const start = () => {
      started = true;
      // a trilha (se tocando) sobe de intensidade com a cena; o módulo vem sob demanda
      let amb: typeof AmbientEngine | null = null;
      void import("@/lib/ambient").then((m) => {
        amb = m.ambient;
      });
      const isTouch = window.matchMedia("(hover: none)").matches || window.innerWidth < 820;
      if (!gl) return showStatic();
      const prog = makeProgram(gl, VERTEX_SRC, buildAstronautSrc(isTouch ? 64 : 100));
      if (!prog) return showStatic();
      gl.useProgram(prog);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "aP");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      const U: Record<string, WebGLUniformLocation | null> = {};
      (["uRes", "uTime", "uProg", "uRot", "uMouse"] as const).forEach((k) => {
        U[k] = gl!.getUniformLocation(prog!, k);
      });

      // resolução adaptativa: começa no teto e desce se o quadro passar de ~20ms
      const maxScale = isTouch ? 0.75 : Math.min(window.devicePixelRatio || 1, 1.25);
      let scale = maxScale;
      const resize = () => {
        const r = canvas.getBoundingClientRect();
        canvas.width = Math.max(1, Math.floor(r.width * scale));
        canvas.height = Math.max(1, Math.floor(r.height * scale));
        gl!.viewport(0, 0, canvas.width, canvas.height);
      };
      resize();
      window.addEventListener("resize", resize);

      const mouse = { tx: 0, ty: 0, x: 0, y: 0 };
      const onMove = (e: PointerEvent) => {
        mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
      };
      if (!isTouch) window.addEventListener("pointermove", onMove);

      const rot = { x: 0, y: 0, vx: 0, vy: 0 };
      let drag: { x: number; y: number } | null = null;
      const stage = canvas.parentElement!;
      const onDown = (e: PointerEvent) => {
        drag = { x: e.clientX, y: e.clientY };
      };
      const onDrag = (e: PointerEvent) => {
        if (!drag) return;
        rot.vx = (e.clientX - drag.x) * 0.006;
        rot.vy = e.pointerType === "touch" ? 0 : (e.clientY - drag.y) * 0.004;
        drag = { x: e.clientX, y: e.clientY };
        rot.x += rot.vx;
        rot.y = Math.max(-0.6, Math.min(0.6, rot.y + rot.vy));
      };
      const onUp = () => {
        drag = null;
      };
      stage.addEventListener("pointerdown", onDown);
      window.addEventListener("pointermove", onDrag);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);

      let inView = true;
      const io = new IntersectionObserver((entries) => {
        inView = entries[0]?.isIntersecting ?? false;
      });
      io.observe(section);

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const t0 = performance.now();
      let last = t0;
      let slow = 0;
      let fast = 0;
      let prog01 = 0;
      let raf = 0;

      const draw = (now: number) => {
        raf = requestAnimationFrame(draw);
        if (!inView) {
          last = now;
          amb?.setIntensity(0);
          return;
        }
        // mede o quadro e ajusta a resolução: 4 quadros lentos seguidos já baixam
        // (o primeiro quadro pode levar segundos — a GPU compila o shader nele)
        const dt = now - last;
        last = now;
        if (dt > 34) slow++;
        else {
          slow = 0;
          if (dt < 14) fast++;
        }
        if (slow >= 4 && scale > 0.4) {
          scale = Math.max(0.4, scale * 0.8);
          slow = fast = 0;
          resize();
        } else if (fast > 180 && scale < maxScale) {
          scale = Math.min(maxScale, scale * 1.1);
          slow = fast = 0;
          resize();
        }

        const r = section.getBoundingClientRect();
        const vh = window.innerHeight;
        if (canvas.width !== Math.max(1, Math.floor(canvas.getBoundingClientRect().width * scale))) resize();

        const target = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
        // segue a rolagem, mas no máximo ~0,3 da cena por segundo (no toque, onde
        // não dá para frear a página, um pouco mais) — rolada rápida não atravessa
        // a coreografia num piscar; parar de rolar para a cena
        // dt limitado a 34ms: quadro longo (compilação, aba em segundo plano) não
        // vira salto — num quadro lento a cena só anda devagar
        const maxRate = ((isTouch ? 0.5 : 0.3) * Math.min(34, Math.max(0, dt))) / 1000;
        const want = reduced ? target - prog01 : (target - prog01) * 0.1;
        prog01 = Math.min(1, Math.max(0, prog01 + Math.max(-maxRate, Math.min(maxRate, want))));

        mouse.x += (mouse.tx - mouse.x) * 0.06;
        mouse.y += (mouse.ty - mouse.y) * 0.06;
        if (!drag) {
          rot.x += rot.vx;
          rot.y = Math.max(-0.6, Math.min(0.6, rot.y + rot.vy));
          rot.vx *= 0.95;
          rot.vy *= 0.92;
          rot.y *= 0.985;
        }

        CAPTIONS.forEach((win, i) => {
          const el = capRefs.current[i];
          if (!el) return;
          const o = fade(prog01, win);
          el.style.opacity = String(o);
          el.style.transform = `translateY(${(1 - o) * 28}px)`;
          el.style.filter = `blur(${(1 - o) * 8}px)`;
        });
        if (hintRef.current) hintRef.current.style.opacity = String(Math.max(0, 1 - prog01 * 14));
        if (barRef.current) barRef.current.style.transform = `scaleX(${prog01})`;
        // trilha: sobe ao entrar na cena, no auge durante as tomadas, volta ao calmo no fim
        amb?.setIntensity(Math.min(1, prog01 * 6) * (1 - Math.max(0, (prog01 - 0.85) / 0.15)));
        if (hudRef.current) hudRef.current.style.opacity = prog01 > 0.995 ? "0" : "1";

        gl!.uniform2f(U.uRes, canvas.width, canvas.height);
        gl!.uniform1f(U.uTime, reduced ? 12 : (now - t0) / 1000);
        gl!.uniform1f(U.uProg, prog01);
        gl!.uniform2f(U.uRot, rot.x, rot.y);
        gl!.uniform2f(U.uMouse, mouse.x, mouse.y);
        gl!.clearColor(0, 0, 0, 0);
        gl!.clear(gl!.COLOR_BUFFER_BIT);
        gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      };
      raf = requestAnimationFrame(draw);

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        window.removeEventListener("resize", resize);
        if (!isTouch) window.removeEventListener("pointermove", onMove);
        stage.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointermove", onDrag);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
      };
    };

    // só cria o contexto WebGL quando a seção está a ~1 tela de distância
    const near = new IntersectionObserver(
      (entries) => {
        if (!started && entries[0]?.isIntersecting) {
          near.disconnect();
          start();
        }
      },
      { rootMargin: "100% 0px" }
    );
    near.observe(section);

    return () => {
      near.disconnect();
      cleanup?.();
    };
  }, []);

  const capCls =
    "pointer-events-none absolute block max-w-[14ch] text-[clamp(40px,6.6vw,112px)] leading-[.95] font-bold tracking-[-.045em] opacity-0 will-change-transform";
  const glow = { textShadow: "0 0 40px rgba(4,10,24,.9), 0 0 12px rgba(4,10,24,.8)" };

  return (
    <section ref={sectionRef} id="orbita" className="relative h-[460svh] max-md:h-[340svh]">
      <div className="sticky top-0 h-[100svh] touch-pan-y overflow-hidden select-none min-[1100px]:-mr-12">
        <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" aria-hidden />
        <h2 className="m-0">
          <span
            ref={(el) => {
              capRefs.current[0] = el;
            }}
            className={`${capCls} top-[18%] left-5 text-[#9CCBF0] sm:left-8`}
            style={glow}
          >
            {t.orbitA}
          </span>{" "}
          <span
            ref={(el) => {
              capRefs.current[1] = el;
            }}
            className={`${capCls} bottom-[18%] left-5 text-[#F5F2ED] sm:left-8`}
            style={glow}
          >
            {t.orbitB}
          </span>
        </h2>

        {/* HUD: dica de rolagem + barra de progresso com as marcas das transições */}
        <div
          ref={hudRef}
          className="pointer-events-none absolute inset-x-0 bottom-[clamp(22px,5vh,48px)] flex flex-col items-center gap-4 px-6 transition-opacity duration-500"
        >
          <p
            ref={hintRef}
            className="m-0 flex items-center gap-3 rounded-full border border-accent/40 bg-[#040A18]/70 px-4 py-2 font-mono text-[11.5px] tracking-[.18em] text-txt uppercase backdrop-blur-[6px]"
          >
            <span className="inline-block animate-bounce text-accent">↓</span>
            {t.orbitHint}
          </p>
          <div className="relative h-[3px] w-[min(560px,72vw)] overflow-hidden rounded-full bg-white/12">
            <span
              ref={barRef}
              className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-accent to-[#66D9FF]"
              style={{ transform: "scaleX(0)" }}
            />
            {MARKS.map((m) => (
              <span key={m} className="absolute top-0 h-full w-[2px] bg-[#040A18]" style={{ left: `${m * 100}%` }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
