// Camada de conteúdo — estrutura do chatbot (opções, ordem do menu e fluxo)
// Os textos (perguntas, labels, respostas) ficam em translations.ts.
import type { ChatNode, ChatOption } from "@/types";

export const chatOptions: ChatOption[] = [
  { id: "about", icon: "👋" },
  { id: "exp", icon: "💼" },
  { id: "skills", icon: "🧰" },
  { id: "projects", icon: "🚀" },
  { id: "education", icon: "🎓" },
  { id: "contact", icon: "✉️" },
];

/**
 * Fluxo do chatbot como grafo de etapas (nós). O motor (src/lib/chatEngine.ts)
 * é genérico — não conhece "nome" ou "menu" — apenas segue `id`/`next`.
 *
 * Para configurar o fluxo:
 * - Nova pergunta de texto livre → nó `kind: "input"`.
 * - Novo menu (ou sub-menu) → nó `kind: "options"`, cada opção aponta `next`
 *   para outra etapa (pode ser outro menu, criando uma sub-etapa).
 * - Uma resposta do bot que só emite texto e volta ao fluxo → nó `kind: "message"`.
 *
 * Hoje: askName (input) → menu (options) → answer:<opção> (message) → menu de novo.
 */
export const chatFlow: ChatNode[] = [
  { kind: "input", id: "askName", next: "menu" },
  {
    kind: "options",
    id: "menu",
    options: chatOptions.map((o) => ({ id: o.id, icon: o.icon, next: `answer:${o.id}` })),
  },
  ...chatOptions.map(
    (o) => ({ kind: "message", id: `answer:${o.id}`, answerId: o.id, next: "menu" }) as const
  ),
];
