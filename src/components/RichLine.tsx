import { parseMarks } from "@/lib/richText";

/**
 * Renderiza uma linha de conteúdo com `**termo**` em destaque.
 * Centraliza o estilo do destaque — mudou aqui, muda em toda a página.
 */
export function RichLine({ text }: { text: string }) {
  return (
    <>
      {parseMarks(text).map((seg, i) =>
        seg.strong ? (
          <strong key={i} className="font-semibold text-strong">
            {seg.text}
          </strong>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </>
  );
}
