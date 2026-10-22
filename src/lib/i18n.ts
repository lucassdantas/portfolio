// Helpers de conteúdo localizado: resolvem `Text`/`LocalizedText` e formatam
// datas "AAAA-MM" no padrão de cada idioma. Os componentes nunca montam data
// nem escolhem idioma de texto na mão — passam por aqui.
import type { Lang, Period, Text, YearMonth } from "@/types";

const MONTHS: Record<Lang, string[]> = {
  pt: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"],
  fr: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."],
};

const CURRENT: Record<Lang, string> = {
  pt: "atual",
  en: "present",
  es: "actualidad",
  fr: "aujourd'hui",
};

/** Resolve um texto que pode ser nome próprio (string) ou traduzível. */
export function tx(text: Text, lang: Lang): string {
  return typeof text === "string" ? text : text[lang];
}

/** "2025-12" → "dez/2025" (pt) · "Dec 2025" (en) · "dic 2025" (es) · "déc. 2025" (fr). */
export function formatMonth(ym: YearMonth, lang: Lang): string {
  const [year, month] = ym.split("-");
  const name = MONTHS[lang][Number(month) - 1];
  return lang === "pt" ? `${name}/${year}` : `${name} ${year}`;
}

/** Intervalo "início — fim"; sem fim, "início — atual" no idioma. */
export function formatPeriod(period: Period, lang: Lang): string {
  const end = period.end ? formatMonth(period.end, lang) : CURRENT[lang];
  return `${formatMonth(period.start, lang)} — ${end}`;
}
