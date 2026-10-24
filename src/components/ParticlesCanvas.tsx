"use client";

import { useEffect, useRef } from "react";
import {
  VERTEX_SRC,
  FRAGMENT_SRC,
  buildFormations,
  makeProgram,
  perspective,
  lookAt,
  measureSections,
  stageFromSnapshot,
  dimFromSnapshot,
  type SectionSnapshot,
} from "@/shaders/particles";

const STAGE_COUNT = 5;
const ACCENT = [0x1d / 0xff, 0x94 / 0xff, 0xe3 / 0xff];
const WHITE = [0xed / 0xff, 0xea / 0xff, 0xe5 / 0xff];
const WARM = [0xd7 / 0xff, 0xa4 / 0xff, 0x5a / 0xff];

/**
 * Campo de partículas WebGL de fundo, montado uma vez no layout.
 * Cinco formações (caos → retícula → código → sistema → produção)
 * interpoladas conforme a seção ativa (via `[data-stg]` no DOM), com
 * repulsão de cursor. `pointer-events: none`, `dynamic import ssr:false`
 * no consumidor.
 */
export function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // só depois do primeiro quadro: montar 14 mil pontos e compilar o shader
    // não pode disputar com a primeira pintura da página
    let dispose: (() => void) | undefined;
    let cancelled = false;
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 120) as unknown as number);
    const cic = window.cancelIdleCallback ?? window.clearTimeout;
    const id = ric(
      () => {
        if (!cancelled) dispose = init() ?? undefined;
      },
      { timeout: 1500 }
    );
    return () => {
      cancelled = true;
      cic(id);
      dispose?.();
    };
  }, []);

  const init = (): (() => void) | void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isTouch = window.matchMedia("(hover: none)").matches || window.innerWidth < 820;
    let gl: WebGLRenderingContext | null = null;
    try {
      gl =
        (canvas.getContext("webgl", {
          alpha: true,
          antialias: false,
          premultipliedAlpha: false,
          powerPreference: "high-performance",
        }) as WebGLRenderingContext | null) ||
        (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    } catch {
      gl = null;
    }
    if (!gl) {
      canvas.style.display = "none";
      return;
    }

    const N = isTouch ? 2600 : 14000;
    const forms = buildFormations(N);
    const seeds = new Float32Array(N);
    for (let i = 0; i < N; i++) seeds[i] = Math.random();

    const prog = makeProgram(gl, VERTEX_SRC, FRAGMENT_SRC);
    if (!prog) {
      canvas.style.display = "none";
      return;
    }
    gl.useProgram(prog);

    const bind = (name: string, arr: Float32Array, size: number) => {
      const b = gl!.createBuffer();
      gl!.bindBuffer(gl!.ARRAY_BUFFER, b);
      gl!.bufferData(gl!.ARRAY_BUFFER, arr, gl!.STATIC_DRAW);
      const loc = gl!.getAttribLocation(prog!, name);
      if (loc >= 0) {
        gl!.enableVertexAttribArray(loc);
        gl!.vertexAttribPointer(loc, size, gl!.FLOAT, false, 0, 0);
      }
    };
    bind("aP0", forms[0], 3);
    bind("aP1", forms[1], 3);
    bind("aP2", forms[2], 3);
    bind("aP3", forms[3], 3);
    bind("aP4", forms[4], 3);
    bind("aSeed", seeds, 1);

    const uNames = ["uProj", "uView", "uStage", "uTime", "uMouse", "uAspect", "uSize", "uOrder", "uColA", "uColB", "uColC", "uDim"] as const;
    const u: Record<string, WebGLUniformLocation | null> = {};
    uNames.forEach((k) => {
      u[k] = gl!.getUniformLocation(prog!, k);
    });
    gl.uniform3fv(u.uColA, ACCENT);
    gl.uniform3fv(u.uColB, WHITE);
    gl.uniform3fv(u.uColC, WARM);

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);

    // leituras de DOM (seções, data-pdim) só quando a página rola ou muda de
    // tamanho — antes eram a cada quadro, forçando estilo/layout 60×/s
    // (aparecia como "Style & Layout" no Lighthouse)
    let stageTarget = 0;
    let dimTarget = 1;
    let dirty = true;
    // posições das seções: relidas no máximo a cada 250ms (mudam só quando uma
    // seção com content-visibility é renderizada pela primeira vez)
    let snap: SectionSnapshot | null = null;
    let snapStamp = 0;
    const markDirty = () => {
      dirty = true;
    };
    window.addEventListener("scroll", markDirty, { passive: true });
    let aspect = 1.6;
    const dpr = Math.min(window.devicePixelRatio || 1, isTouch ? 1.5 : 1.8);
    const resize = () => {
      dirty = true;
      snapStamp = 0;
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      gl!.viewport(0, 0, canvas.width, canvas.height);
      aspect = canvas.width / canvas.height;
    };
    resize();
    window.addEventListener("resize", resize);

    const mouse = { tx: 0, ty: 0, x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    if (!isTouch) window.addEventListener("pointermove", onMove);

    let stageSm = 0;
    let dimSm = 1;
    let raf = 0;
    let start = performance.now();

    const draw = (now: number) => {
      const t = (now - start) / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;

      if (dirty) {
        dirty = false;
        if (!snap || now - snapStamp > 250) {
          snap = measureSections();
          snapStamp = now;
        }
        const sy = window.scrollY;
        const vh = window.innerHeight;
        stageTarget = stageFromSnapshot(snap, STAGE_COUNT, sy, vh);
        dimTarget = dimFromSnapshot(snap, sy, vh);
      }
      stageSm += (stageTarget - stageSm) * 0.045;
      const order = Math.min(1, stageSm / (STAGE_COUNT - 1));
      dimSm += (dimTarget - dimSm) * 0.05;

      const camR = 7.4 - order * 1.9;
      const ang = -0.45 + stageSm * 0.42 + mouse.x * 0.22;
      const ele = 0.22 - order * 0.16 + mouse.y * 0.16;
      const eye = [Math.sin(ang) * camR, Math.sin(ele) * camR, Math.cos(ang) * camR];
      const view = lookAt(eye, [0, 0, 0], [0, 1, 0]);
      const proj = perspective(Math.PI / 4.6, aspect || 1.6, 0.1, 60);

      gl!.uniformMatrix4fv(u.uView, false, view);
      gl!.uniformMatrix4fv(u.uProj, false, proj);
      gl!.uniform1f(u.uStage, stageSm);
      gl!.uniform1f(u.uTime, t);
      gl!.uniform1f(u.uOrder, order);
      gl!.uniform1f(u.uDim, dimSm);
      gl!.uniform1f(u.uAspect, aspect || 1.6);
      gl!.uniform1f(u.uSize, isTouch ? 2.0 : 2.6);
      gl!.uniform2f(u.uMouse, mouse.x, mouse.y);

      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.drawArrays(gl!.POINTS, 0, N);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", markDirty);
      if (!isTouch) window.removeEventListener("pointermove", onMove);
    };
  };

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 block h-full w-full"
      aria-hidden
    />
  );
}
