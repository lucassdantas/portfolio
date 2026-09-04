"use client";

import { useEffect, useRef } from "react";

/** Reveal on scroll: opacity 0 + translateY(28px) → visível (fallback após 6s). */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  /** Atraso em ms antes da transição — para revelar em cascata (staggered). */
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.getBoundingClientRect().top <= window.innerHeight) return;

    const show = () => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    };
    el.style.opacity = "0";
    el.style.transform = "translateY(28px)";
    el.style.transition = `opacity .9s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .9s cubic-bezier(.16,1,.3,1) ${delay}ms`;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            show();
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    const fallback = setTimeout(show, 6000);
    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
