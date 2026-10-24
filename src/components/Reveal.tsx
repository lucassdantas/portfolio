"use client";

import { useEffect, useRef } from "react";

const EASE = "cubic-bezier(.16,1,.3,1)";

/**
 * Entrada de cards ao rolar: sobem 48px crescendo de 96% e com os cantos se
 * abrindo (clip-path) até o tamanho final. Conteúdo que já está na tela no
 * carregamento não anima (decidido pelo IntersectionObserver, sem medir
 * layout na montagem). Fallback: aparece sozinho após 6s.
 * Marca `data-reveal` para o MotionReveal não animar os textos de dentro de
 * novo (o card já carrega o movimento).
 */
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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Nada de getBoundingClientRect aqui: ~25 cards montando em sequência, cada
    // um lendo layout e escrevendo estilo, forçavam ~25 relayouts da página
    // inteira no carregamento. O IntersectionObserver responde fora do caminho
    // crítico; quem já está na tela na 1ª resposta nunca é escondido.
    let hidden = false;
    // a transição só entra na hora de mostrar: esconder é instantâneo (senão
    // cada card fazia 1s de animação invisível, abaixo da dobra, no carregamento)
    const show = () => {
      if (!hidden) return;
      el.style.transition = [
        `opacity .8s ${EASE} ${delay}ms`,
        `transform 1.1s ${EASE} ${delay}ms`,
        `clip-path 1.1s ${EASE} ${delay}ms`,
      ].join(", ");
      el.style.opacity = "1";
      el.style.transform = "none";
      el.style.clipPath = "inset(0% 0% 0% 0% round 0px)";
    };
    const hide = () => {
      hidden = true;
      el.style.opacity = "0";
      el.style.transform = "translateY(48px) scale(.96)";
      el.style.clipPath = "inset(6% 4% 0% 4% round 6px)";
    };
    let first = true;
    const io = new IntersectionObserver(
      (entries) => {
        const en = entries[entries.length - 1];
        if (first) {
          first = false;
          if (en.isIntersecting) {
            io.disconnect();
            return;
          }
          hide();
          return;
        }
        if (en.isIntersecting) {
          show();
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    const fallback = setTimeout(show, 6000);
    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, [delay]);

  return (
    <div ref={ref} data-reveal className={className}>
      {children}
    </div>
  );
}
