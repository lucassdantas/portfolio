"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { makeProgram } from "@/shaders/particles";
import { VERTEX_SRC, buildAstronautSrc } from "@/shaders/astronaut";

/**
 * Interlúdio em tela cheia antes do contato: um astronauta raymarched
 * flutuando sobre um planeta (shader em `src/shaders/astronaut.ts`).
 *
 * - Fundo próprio e opaco: o campo de partículas do site não passa por cima,
 *   e o astronauta não invade as outras seções.
 * - Só desenha com a seção visível; esconde o canvas se WebGL falhar (o texto
 *   continua legível sobre o fundo escuro).
 * - Arrastar gira o astronauta com inércia. No toque, só o arraste horizontal
 *   gira (`touch-action: pan-y`), para não roubar o scroll da página.
 * - `prefers-reduced-motion`: o tempo do shader fica parado; arrastar ainda funciona.
 */
export function OrbitSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const isTouch = window.matchMedia("(hover: none)").matches || window.innerWidth < 820;
    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext("webgl", { alpha: false, antialias: false });
    } catch {
      gl = null;
    }
    if (!gl) {
      canvas.style.display = "none";
      return;
    }

    const prog = makeProgram(gl, VERTEX_SRC, buildAstronautSrc(isTouch ? 56 : 96));
    if (!prog) {
      canvas.style.display = "none";
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aP");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U: Record<string, WebGLUniformLocation | null> = {};
    (["uRes", "uTime", "uRot", "uMouse", "uScroll"] as const).forEach((k) => {
      U[k] = gl!.getUniformLocation(prog!, k);
    });

    // tela cheia raymarched é cara: resolução reduzida (o shader é macio, não precisa de retina)
    const scale = isTouch ? 0.75 : Math.min(window.devicePixelRatio || 1, 1);
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

    // arraste com inércia: a velocidade decai sozinha depois que solta
    const rot = { x: 0, y: 0, vx: 0, vy: 0 };
    let drag: { x: number; y: number } | null = null;
    const onDown = (e: PointerEvent) => {
      drag = { x: e.clientX, y: e.clientY };
      section.setPointerCapture?.(e.pointerId);
    };
    const onDrag = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      drag = { x: e.clientX, y: e.clientY };
      rot.vx = dx * 0.006;
      rot.vy = e.pointerType === "touch" ? 0 : dy * 0.004;
      rot.x += rot.vx;
      rot.y = Math.max(-0.7, Math.min(0.7, rot.y + rot.vy));
    };
    const onUp = () => {
      drag = null;
    };
    section.addEventListener("pointerdown", onDown);
    section.addEventListener("pointermove", onDrag);
    section.addEventListener("pointerup", onUp);
    section.addEventListener("pointercancel", onUp);

    let inView = false;
    const io = new IntersectionObserver((entries) => {
      inView = entries[0]?.isIntersecting ?? false;
    });
    io.observe(section);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let raf = 0;

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!inView) return;
      const r = section.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      if (canvas.width !== Math.max(1, Math.floor(r.width * scale))) resize();

      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      if (!drag) {
        rot.x += rot.vx;
        rot.y = Math.max(-0.7, Math.min(0.7, rot.y + rot.vy));
        rot.vx *= 0.95;
        rot.vy *= 0.92;
        rot.y *= 0.985; // volta devagar para a pose de frente
      }

      const vh = window.innerHeight;
      const scroll = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));

      gl!.uniform2f(U.uRes, canvas.width, canvas.height);
      gl!.uniform1f(U.uTime, reduced ? 12 : (now - start) / 1000);
      gl!.uniform2f(U.uRot, rot.x, rot.y);
      gl!.uniform2f(U.uMouse, mouse.x, mouse.y);
      gl!.uniform1f(U.uScroll, scroll);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      if (!isTouch) window.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerdown", onDown);
      section.removeEventListener("pointermove", onDrag);
      section.removeEventListener("pointerup", onUp);
      section.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="orbita"
      className="relative flex min-h-[100svh] touch-pan-y flex-col justify-between overflow-hidden border-t border-bord bg-[#040407] px-5 py-[clamp(60px,11vh,130px)] select-none sm:px-8 min-[1100px]:-mr-12 min-[1100px]:pr-20"
    >
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 block h-full w-full" aria-hidden />
      <div className="pointer-events-none relative z-[1] flex flex-wrap justify-between gap-5 font-mono text-[11px] tracking-[.2em] text-muted uppercase">
        <p className="m-0">{t.orbitEyebrow}</p>
        <p className="m-0 text-right">{t.orbitHint}</p>
      </div>
      <div className="pointer-events-none relative z-[1] max-w-[min(100%,820px)]">
        <h2
          className="m-0 text-[clamp(38px,7.4vw,124px)] leading-[.9] font-bold tracking-[-.045em]"
          style={{ textShadow: "0 0 42px rgba(4,4,7,.95), 0 0 14px rgba(4,4,7,.9)" }}
        >
          <span className="block text-muted">{t.orbitA}</span>
          <span className="block text-[#F5F2ED]">{t.orbitB}</span>
        </h2>
        <p
          className="m-0 mt-[clamp(20px,3.4vh,36px)] max-w-[46ch] text-[clamp(14px,1.25vw,17px)] leading-[1.6] text-strong [text-wrap:pretty]"
          style={{ textShadow: "0 0 18px rgba(4,4,7,.95)" }}
        >
          {t.orbitCap}
        </p>
      </div>
    </section>
  );
}
