"use client";

import { useEffect, useRef } from "react";

const COUNT = 60;
const LINK_DIST = 130;
const REPEL_DIST = 110;

/** Rede de partículas em canvas fixo no fundo, com repulsão do mouse. */
export function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    const pts = Array.from({ length: COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: reduced ? 0 : (Math.random() - 0.5) * 0.4,
      vy: reduced ? 0 : (Math.random() - 0.5) * 0.4,
    }));
    const mouse = { x: -999, y: -999 };

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    const onMouse = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouse);

    // Ler o tema a cada frame forçaria recálculo de estilo 60x/s; em vez
    // disso, cacheamos e revalidamos só quando data-theme muda.
    let hex = "#1D94E3";
    let base = 0.5;
    const readTheme = () => {
      hex =
        getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#1D94E3";
      base = document.documentElement.dataset.theme === "light" ? 0.25 : 0.5;
    };
    readTheme();
    const themeObserver = new MutationObserver(readTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const LINK_DIST2 = LINK_DIST * LINK_DIST;
    const REPEL_DIST2 = REPEL_DIST * REPEL_DIST;

    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const mx = p.x - mouse.x;
        const my = p.y - mouse.y;
        const dm2 = mx * mx + my * my;
        if (dm2 < REPEL_DIST2 && dm2 > 0) {
          const dm = Math.sqrt(dm2);
          p.x += ((p.x - mouse.x) / dm) * 1.1;
          p.y += ((p.y - mouse.y) / dm) * 1.1;
        }
        ctx.fillStyle = hex + "66";
        ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i];
          const b = pts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST2) {
            const d = Math.sqrt(d2);
            ctx.strokeStyle =
              hex +
              Math.floor((1 - d / LINK_DIST) * base * 255)
                .toString(16)
                .padStart(2, "0");
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" aria-hidden />;
}
