"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { makeProgram } from "@/shaders/particles";
import { VERTEX_SRC, buildFragmentSrc } from "@/shaders/core";

/**
 * Transição em tela cheia com um objeto 3D raymarched: uma esfera oca
 * recortada por planos, que se abre conforme o scroll e revela três anéis
 * girando em torno de um núcleo pulsante. Só desenha com a seção visível;
 * esconde o canvas se WebGL falhar.
 */
export function CoreSection() {
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
      gl = canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: true });
    } catch {
      gl = null;
    }
    if (!gl) {
      canvas.style.display = "none";
      return;
    }

    const STEPS = isTouch ? 48 : 92;
    const ISTEPS = isTouch ? 20 : 40;
    const prog = makeProgram(gl, VERTEX_SRC, buildFragmentSrc(STEPS, ISTEPS));
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
    (["uRes", "uTime", "uMouse", "uOpen", "uRev"] as const).forEach((k) => {
      U[k] = gl!.getUniformLocation(prog!, k);
    });
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const dpr = Math.min(window.devicePixelRatio || 1, isTouch ? 1 : 1.25);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(r.width * dpr));
      canvas.height = Math.max(1, Math.floor(r.height * dpr));
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

    let inView = false;
    const io = new IntersectionObserver((entries) => {
      inView = entries[0]?.isIntersecting ?? false;
    });
    io.observe(section);

    let coreOpen = 0;
    let raf = 0;
    let start = performance.now();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!inView) return;
      const t = (now - start) / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;

      const r = section.getBoundingClientRect();
      if (r.bottom < -80 || r.top > window.innerHeight + 80) return;
      if (canvas.width !== Math.floor(canvas.getBoundingClientRect().width * dpr)) resize();

      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.9)));
      const target = reduced ? p : p * p * (3 - 2 * p);
      coreOpen += (target - coreOpen) * 0.07;

      gl!.useProgram(prog);
      gl!.uniform2f(U.uRes, canvas.width, canvas.height);
      gl!.uniform1f(U.uTime, t);
      gl!.uniform2f(U.uMouse, mouse.x, mouse.y);
      gl!.uniform1f(U.uOpen, coreOpen);
      gl!.uniform1f(U.uRev, Math.min(1, coreOpen * 1.4));
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
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="core"
      data-stg="2.3"
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden border-t border-bord bg-[#070605] px-5 py-[clamp(60px,11vh,130px)] sm:px-8"
    >
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 block h-full w-full" aria-hidden />
      <div className="relative z-[1] flex flex-wrap justify-between gap-5 font-mono text-[11px] tracking-[.2em] text-muted uppercase">
        <p className="m-0">{t.coreEyebrow}</p>
        <p className="m-0 text-right text-muted">{t.coreHint}</p>
      </div>
      <h2
        className="relative z-[1] m-0 pointer-events-none text-[clamp(38px,9.2vw,152px)] leading-[.86] font-bold tracking-[-.045em] uppercase"
        style={{ textShadow: "0 0 42px rgba(7,6,5,.92), 0 0 14px rgba(7,6,5,.85)" }}
      >
        <span className="block text-muted">{t.coreA}</span>
        <span className="block text-[#F5F2ED]">{t.coreB}</span>
      </h2>
      <div className="relative z-[1] grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] items-end gap-[clamp(16px,3vw,44px)]">
        <p className="m-0 max-w-[44ch] text-[clamp(14px,1.25vw,17px)] leading-[1.6] text-muted [text-wrap:pretty]">
          {t.coreCap}
        </p>
        <p className="m-0 text-right font-mono text-[11px] leading-[1.9] tracking-[.16em] text-muted uppercase">
          {t.coreFlow}
        </p>
      </div>
    </section>
  );
}
