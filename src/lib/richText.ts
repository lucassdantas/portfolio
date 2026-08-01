// Marcação mínima de destaque para textos da camada de dados.
// Convenção: **termo** vira segmento em destaque. Nada além disso —
// se um dia precisar de mais, vale reavaliar em vez de crescer daqui.

export interface RichSegment {
  text: string;
  strong: boolean;
}

/** Quebra a linha em segmentos, marcando o que estava entre `**`. */
export function parseMarks(line: string): RichSegment[] {
  // split com grupo de captura: índices ímpares são o conteúdo destacado
  return line
    .split(/\*\*(.+?)\*\*/g)
    .flatMap((part, i) => (part ? [{ text: part, strong: i % 2 === 1 }] : []));
}

/** Versão sem marcação, para contextos de texto puro (terminal). */
export const stripMarks = (line: string): string => line.replace(/\*\*/g, "");
