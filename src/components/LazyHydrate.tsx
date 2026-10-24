"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

/** Disparado em `window` quando um bloco hidrata; `detail` é o elemento raiz. */
export const HYDRATED_EVENT = "ld:hydrated";

/**
 * Hidratação preguiçosa: o HTML vem do servidor normalmente (SEO, primeira
 * pintura), mas o React só "liga" o bloco quando ele chega perto da tela.
 *
 * Por quê: no celular, hidratar a página inteira antes do primeiro quadro
 * custava ~550ms de thread principal (CPU 4× mais lenta) e segurava o LCP.
 *
 * Como: enquanto não hidratou, renderiza um `div` com `dangerouslySetInnerHTML`
 * vazio — na hidratação o React não mexe nos filhos de um nó assim, então o
 * HTML do servidor fica como está. Ao hidratar, o conteúdo é renderizado de
 * novo (igual ao do servidor) e os componentes ganham seus efeitos.
 *
 * Hidrata quando: entra na margem (`rootMargin`), o idioma deixa de ser o do
 * servidor (`pt`), ou o evento `hydrateOn` dispara (o `_shell` da Navbar abre o
 * terminal: o bloco hidrata e reenvia o evento para o terminal já montado).
 * De propósito NÃO hidrata "quando ficar ocioso": a cascata de hidratações logo
 * após o carregamento entrava na janela de medição (TBT) e dobrava a nota.
 *
 * Fora da hidratação (testes, render só no cliente) não há HTML a preservar:
 * renderiza os filhos na hora.
 */
export function LazyHydrate({
  children,
  rootMargin = "600px 0px",
  hydrateOn,
}: {
  children: React.ReactNode;
  rootMargin?: string;
  /** Nome de evento em `window` que força a hidratação e é reenviado depois dela. */
  hydrateOn?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hydrated, setHydrated] = useState(typeof window === "undefined");
  const pending = useRef<string | null>(null);
  const { lang } = useLanguage();

  useEffect(() => {
    if (hydrated) return;
    const el = ref.current;
    if (!el) return;
    if (!el.hasChildNodes() || lang !== "pt") {
      setHydrated(true);
      return;
    }
    const done = () => setHydrated(true);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) done();
      },
      { rootMargin }
    );
    io.observe(el);
    const onEvent = () => {
      pending.current = hydrateOn ?? null;
      done();
    };
    if (hydrateOn) window.addEventListener(hydrateOn, onEvent);
    return () => {
      io.disconnect();
      if (hydrateOn) window.removeEventListener(hydrateOn, onEvent);
    };
  }, [hydrated, lang, rootMargin, hydrateOn]);

  // depois de hidratar: avisa (MotionReveal anima os textos novos) e reenvia o
  // evento que causou a hidratação — os efeitos dos filhos já rodaram
  useEffect(() => {
    if (!hydrated || !ref.current) return;
    window.dispatchEvent(new CustomEvent(HYDRATED_EVENT, { detail: ref.current }));
    if (pending.current) {
      const name = pending.current;
      pending.current = null;
      window.dispatchEvent(new CustomEvent(name));
    }
  }, [hydrated]);

  if (hydrated) return <div ref={ref}>{children}</div>;
  return <div ref={ref} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: "" }} />;
}
