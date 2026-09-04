"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor customizado (anel + ponto, mix-blend-mode: difference) que cresce
 * sobre elementos interativos. Não monta em dispositivos de toque — a
 * checagem acontece antes de qualquer listener, não só via CSS.
 */
export function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none)").matches || window.innerWidth < 820;
    if (isTouch) return;

    document.documentElement.classList.add("ld-cursor-on");

    const root = rootRef.current;
    const ring = ringRef.current;
    if (!root || !ring) return;

    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    let rx = cx;
    let ry = cy;
    let raf = 0;
    let shown = false;

    const onMove = (e: PointerEvent) => {
      cx = e.clientX;
      cy = e.clientY;
      if (!shown) {
        shown = true;
        root.style.opacity = "1";
      }
      const target = e.target as HTMLElement;
      const interactive = !!target.closest("a, button, input, textarea, [role='button']");
      ring.style.width = interactive ? "54px" : "34px";
      ring.style.height = interactive ? "54px" : "34px";
      ring.style.margin = interactive ? "-27px 0 0 -27px" : "-17px 0 0 -17px";
      ring.style.borderColor = interactive ? "#1D94E3" : "rgba(237,234,229,.55)";
    };
    window.addEventListener("pointermove", onMove);

    const loop = () => {
      rx += (cx - rx) * 0.22;
      ry += (cy - ry) * 0.22;
      root.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("ld-cursor-on");
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed top-0 left-0 z-[200] opacity-0 mix-blend-difference"
      aria-hidden
    >
      <div
        ref={ringRef}
        className="absolute h-[34px] w-[34px] -m-[17px] rounded-full border transition-[width,height,margin,border-color] duration-[.25s]"
        style={{ borderColor: "rgba(237,234,229,.55)" }}
      />
      <div className="absolute -m-0.5 h-1 w-1 rounded-full bg-txt" />
    </div>
  );
}
