"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { makeProgram } from "@/shaders/particles";
import { VERTEX_SRC, buildAstronautSrc } from "@/shaders/astronaut";

/** Janela de rolagem (0..1) em que cada frase aparece; fora dela, some. */
const CAPTIONS: [number, number][] = [
  [0.2, 0.44],
  [0.6, 0.86],
];

const fade = (p: number, [a, b]: [number, number]) => {
  const w = 0.06;
  return Math.max(0, Math.min(1, (p - a) / w, (b - p) / w));
};

/**
 * Interlúdio rolável antes do contato: um astronauta raymarched
 * (`src/shaders/astronaut.ts`) cuja coreografia inteira é conduzida pela
 * rolagem — a seção tem ~4 telas de altura e o palco fica preso (sticky).
 *
 * - Canvas transparente: no começo e no fim as partículas do site aparecem
 *   por trás; o céu entra e sai aos poucos, sem corte.
 * - Só desenha com a seção visível; esconde o canvas se WebGL falhar e deixa
 *   as frases sempre visíveis.
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

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const showStatic = () => {
      canvas.style.display = "none";
      capRefs.current.forEach((el) => {
        if (el) el.style.opacity = "1";
      });
    };

    const isTouch = window.matchMedia("(hover: none)").matches || window.innerWidth < 820;
    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false });
    } catch {
      gl = null;
    }
    if (!gl) return showStatic();

    const prog = makeProgram(gl, VERTEX_SRC, buildAstronautSrc(isTouch ? 64 : 110));
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

    const scale = isTouch ? 0.75 : Math.min(window.devicePixelRatio || 1, 1.25);
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

    // arraste com inércia
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

    let inView = false;
    const io = new IntersectionObserver((entries) => {
      inView = entries[0]?.isIntersecting ?? false;
    });
    io.observe(section);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let prog01 = 0;
    let raf = 0;

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!inView) return;
      const r = section.getBoundingClientRect();
      const vh = window.innerHeight;
      if (canvas.width !== Math.max(1, Math.floor(canvas.getBoundingClientRect().width * scale))) resize();

      // progresso da rolagem dentro da seção presa, suavizado (a cena "desliza")
      const target = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
      prog01 += (target - prog01) * (reduced ? 1 : 0.09);

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
        el.style.transform = `translateY(${(1 - o) * 24}px)`;
      });
      if (hintRef.current) hintRef.current.style.opacity = String(Math.max(0, 1 - prog01 * 8));

      gl!.uniform2f(U.uRes, canvas.width, canvas.height);
      gl!.uniform1f(U.uTime, reduced ? 12 : (now - start) / 1000);
      gl!.uniform1f(U.uProg, prog01);
      gl!.uniform2f(U.uRot, rot.x, rot.y);
      gl!.uniform2f(U.uMouse, mouse.x, mouse.y);
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      if (!isTouch) window.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onDrag);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const capCls =
    "pointer-events-none absolute block max-w-[14ch] text-[clamp(40px,6.6vw,112px)] leading-[.92] font-bold tracking-[-.045em] opacity-0 will-change-transform";
  const glow = { textShadow: "0 0 40px rgba(4,10,24,.9), 0 0 12px rgba(4,10,24,.8)" };

  return (
    <section ref={sectionRef} id="orbita" className="relative h-[420svh] max-md:h-[320svh]">
      <div className="sticky top-0 h-[100svh] touch-pan-y overflow-hidden select-none min-[1100px]:-mr-12">
        <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" aria-hidden />
        <p
          ref={hintRef}
          className="pointer-events-none absolute inset-x-0 bottom-[clamp(28px,6vh,60px)] m-0 px-20 text-center font-mono text-[11px] tracking-[.2em] text-accent uppercase"
        >
          {t.orbitHint}
        </p>
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
            className={`${capCls} bottom-[14%] left-5 text-[#F5F2ED] sm:left-8`}
            style={glow}
          >
            {t.orbitB}
          </span>
        </h2>
      </div>
    </section>
  );
}
