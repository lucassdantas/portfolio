"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { stackGroups, principles } from "@/data";
import { Reveal } from "./Reveal";

/**
 * Grafo de curvas SVG ligando cada tech ao título ("hub") do seu grupo.
 * Hover num chip acende só as conexões do grupo dele. Porta `initGraph()`
 * do protótipo: mede posições no DOM e redesenha em resize.
 */
function useStackGraph(wrapRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const wrap = wrapRef.current;
    const svg = wrap?.querySelector<SVGSVGElement>("svg");
    if (!wrap || !svg) return;

    const NS = "http://www.w3.org/2000/svg";
    const draw = () => {
      svg.innerHTML = "";
      const wr = wrap.getBoundingClientRect();
      const hubPt: Record<string, [number, number]> = {};
      wrap.querySelectorAll<HTMLElement>("[data-hub]").forEach((h) => {
        const g = h.dataset.hub!;
        const r = h.getBoundingClientRect();
        hubPt[g] = [r.left - wr.left + r.width / 2, r.bottom - wr.top];
      });
      wrap.querySelectorAll<HTMLElement>("[data-tech]").forEach((t) => {
        const g = t.dataset.tech!;
        const hp = hubPt[g];
        if (!hp) return;
        const r = t.getBoundingClientRect();
        const x1 = hp[0];
        const y1 = hp[1];
        const x2 = r.left - wr.left + r.width / 2;
        const y2 = r.top - wr.top;
        const my = (y1 + y2) / 2;
        const p = document.createElementNS(NS, "path");
        p.setAttribute("d", `M${x1} ${y1} C${x1} ${my} ${x2} ${my} ${x2} ${y2}`);
        p.setAttribute("fill", "none");
        p.setAttribute("stroke", "#1D94E3");
        p.setAttribute("stroke-width", "1");
        p.setAttribute("opacity", "0.14");
        p.setAttribute("data-gl", g);
        svg.appendChild(p);
      });
    };

    const t1 = setTimeout(draw, 60);
    const onResize = () => setTimeout(draw, 120);
    window.addEventListener("resize", onResize);

    const offs: (() => void)[] = [];
    wrap.querySelectorAll<HTMLElement>("[data-tech]").forEach((t) => {
      const g = t.dataset.tech!;
      const onEnter = () => {
        wrap.classList.add("ld-graph-dim");
        wrap
          .querySelectorAll<HTMLElement>("[data-tech]")
          .forEach((o) => o.classList.toggle("ld-lit", o.dataset.tech === g));
        svg
          .querySelectorAll<SVGPathElement>("path")
          .forEach((p) => p.setAttribute("opacity", p.getAttribute("data-gl") === g ? "0.6" : "0.03"));
      };
      const onLeave = () => {
        wrap.classList.remove("ld-graph-dim");
        svg.querySelectorAll<SVGPathElement>("path").forEach((p) => p.setAttribute("opacity", "0.14"));
      };
      t.addEventListener("pointerenter", onEnter);
      t.addEventListener("pointerleave", onLeave);
      offs.push(() => {
        t.removeEventListener("pointerenter", onEnter);
        t.removeEventListener("pointerleave", onLeave);
      });
    });

    return () => {
      clearTimeout(t1);
      window.removeEventListener("resize", onResize);
      offs.forEach((f) => f());
    };
  }, [wrapRef]);
}

export function StackSection() {
  const { t } = useLanguage();
  const graphRef = useRef<HTMLDivElement>(null);
  useStackGraph(graphRef);

  return (
    <section id="stack" data-stg="1.6" className="px-5 py-[clamp(70px,14vh,170px)] sm:px-8">
      <div className="mb-[clamp(26px,5vh,56px)] flex flex-wrap items-baseline justify-between gap-6">
        <p className="m-0 font-mono text-[11px] tracking-[.2em] text-dim uppercase">
          02 — {t.stackTitle}
        </p>
        <p className="m-0 max-w-[46ch] text-sm leading-[1.55] text-muted">{t.stackDesc}</p>
      </div>

      <div ref={graphRef} id="ld-graph" className="relative">
        <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible" />
        <div className="relative z-[1] grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-[clamp(22px,3vw,44px)]">
          {stackGroups.map((sg, gi) => (
            <div key={sg.label} className="flex flex-col gap-3">
              <p
                data-hub={gi}
                className="m-0 border-b border-bord pb-2 font-mono text-[11px] tracking-[.18em] text-accent uppercase"
              >
                {sg.label}
              </p>
              <div className="flex flex-wrap gap-[7px]">
                {sg.items.map((si) => (
                  <span
                    key={si.name}
                    data-tech={gi}
                    className="ld-tech cursor-default rounded-[2px] border border-bord px-[9px] py-[5px] font-mono text-[11.5px] tracking-[.02em] text-strong transition-[color,border-color,background,transform] duration-[.25s] hover:-translate-y-0.5 hover:border-txt hover:bg-txt hover:text-bg"
                  >
                    {si.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="m-0 mt-[clamp(52px,9vh,110px)] mb-[clamp(20px,3vh,34px)] font-mono text-[11px] tracking-[.2em] text-dim uppercase">
        {"// " + t.engTitle}
      </p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-px border border-bord bg-bord">
        {principles.map((pr, i) => (
          <Reveal key={pr.title} delay={i * 80}>
            <div className="h-full bg-bg p-[clamp(20px,2.4vw,32px)]">
              <p className="m-0 mb-2.5 font-mono text-[10.5px] tracking-[.18em] text-accent">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="m-0 mb-2.5 text-[19px] font-semibold tracking-[-.02em]">{pr.title}</h3>
              <p className="m-0 text-[13.5px] leading-[1.6] text-muted [text-wrap:pretty]">{pr.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
