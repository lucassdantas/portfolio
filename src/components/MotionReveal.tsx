"use client";

import { useEffect } from "react";

/** Textos animados na entrada: títulos ganham a cortina; o resto, subida com foco. */
const TEXT = "section h2, section h3, section p, section li, section dt, section dd";
/** Áreas com animação própria (ou em que esconder atrapalha). */
const SKIP = "#orbita, #core, [data-reveal], [data-no-reveal], nav, dialog, [role='dialog']";

/**
 * Movimento de entrada dos textos do site inteiro, montado uma vez na página.
 *
 * - Títulos (h2/h3): sobem de trás de uma máscara (clip-path) desinclinando.
 * - Parágrafos, itens, rótulos: sobem de 26px saindo do desfoque, em cascata
 *   entre irmãos (atraso por posição, até 6 passos).
 * - Quem já está na tela no carregamento nunca é escondido: o primeiro conteúdo
 *   pinta na hora (LCP intacto). A decisão vem do IntersectionObserver, não de
 *   medir layout — medir ~400 elementos de uma vez era uma tarefa longa no
 *   celular (TBT).
 * - Seção com `content-visibility: auto` ainda não tem caixa quando o observer
 *   responde pela primeira vez (rect zerado): aí a decisão espera a próxima
 *   resposta, que vem quando o navegador a renderiza, perto da tela.
 * - Com `prefers-reduced-motion`, não faz nada.
 */
export function MotionReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const teardowns: (() => void)[] = [];

    // o primeiro passe só depois do carregamento, com o navegador ocioso
    const ric =
      window.requestIdleCallback ??
      ((cb: () => void) => window.setTimeout(cb, 300) as unknown as number);
    const cic = window.cancelIdleCallback ?? window.clearTimeout;
    let idleId = 0;
    const schedule = () => {
      idleId = ric(
        () => {
          teardowns.push(setup());
        },
        { timeout: 2000 }
      );
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      window.removeEventListener("load", schedule);
      cic(idleId);
      teardowns.forEach((fn) => fn());
    };
  }, []);

  return null;
}

/**
 * Observa os textos de `root`. Na primeira resposta do observer, quem está na
 * tela (ou acima dela) fica como está; quem está abaixo é escondido e revelado
 * ao entrar. Título começa recortado (clip-path), então observa-se o pai dele.
 */
function setup(root: ParentNode = document): () => void {
  const els = Array.from(root.querySelectorAll<HTMLElement>(TEXT)).filter((el) => !el.closest(SKIP));
  const timers: ReturnType<typeof setTimeout>[] = [];
  const targets = new Map<Element, HTMLElement[]>();
  const decided = new WeakSet<Element>();

  const reveal = (list: HTMLElement[]) => {
    list.forEach((el) => {
      el.classList.add("ld-rv-in");
      // depois da entrada, devolve o elemento ao estado normal (sem clip, sem
      // transição pendurada): sombra de texto e hover voltam a funcionar
      timers.push(
        setTimeout(() => {
          el.classList.remove("ld-rv", "ld-rv-h", "ld-rv-t", "ld-rv-in");
          el.style.removeProperty("--rv-d");
        }, 1700)
      );
    });
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        const list = targets.get(en.target) ?? [];
        if (!decided.has(en.target)) {
          const rc = en.boundingClientRect;
          if (rc.width === 0 && rc.height === 0) return; // sem caixa ainda (content-visibility)
          decided.add(en.target);
          // já visível (ou acima) no primeiro contato: nunca esconde
          if (en.isIntersecting || en.boundingClientRect.top < window.innerHeight) {
            io.unobserve(en.target);
            return;
          }
          list.forEach((el) => {
            const isHeading = el.tagName === "H2" || el.tagName === "H3";
            const sibs = el.parentElement ? Array.from(el.parentElement.children) : [el];
            el.style.setProperty("--rv-d", `${Math.min(6, sibs.indexOf(el)) * 70}ms`);
            el.classList.add("ld-rv", isHeading ? "ld-rv-h" : "ld-rv-t");
          });
          return;
        }
        if (en.isIntersecting) {
          io.unobserve(en.target);
          reveal(list);
        }
      });
    },
    { threshold: 0, rootMargin: "0px 0px -8% 0px" }
  );

  els.forEach((el) => {
    const isHeading = el.tagName === "H2" || el.tagName === "H3";
    const watch = isHeading && el.parentElement ? el.parentElement : el;
    targets.set(watch, [...(targets.get(watch) ?? []), el]);
  });
  targets.forEach((_, watch) => io.observe(watch));

  return () => {
    io.disconnect();
    timers.forEach(clearTimeout);
  };
}
