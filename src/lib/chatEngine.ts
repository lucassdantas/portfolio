// Motor genérico do chatbot: interpreta o grafo `chatFlow` (src/data/chatbot.ts)
// e produz o próximo estado. Não conhece "nome" nem "menu" especificamente —
// só segue `id`/`next` — então configurar novas etapas/sub-etapas é só editar
// o array de dados, sem tocar aqui. Sem dependência de React: testável isolado
// (src/tests/unit/chatEngine.test.ts).
import { chatFlow } from "@/data";
import { sanitizeName, type ChatMessage, type ChatState } from "@/lib/chat";
import { getChatFacts } from "@/lib/chatFacts";
import type { ChatCopy, ChatNode, ChatOptionId } from "@/types";

const nodesById = new Map(chatFlow.map((n) => [n.id, n]));

// Fatos são estáticos (vêm de src/data) — computados uma vez só.
const FACTS = getChatFacts();

export function getChatNode(id: string): ChatNode {
  const node = nodesById.get(id);
  if (!node) throw new Error(`chatEngine: nó "${id}" não existe em chatFlow`);
  return node;
}

/** Substitui todos os "{chave}" de `text` pelos valores em `vars`. Chaves sem valor ficam como estão. */
export function interpolate(text: string, vars: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) => vars[key] ?? match);
}

let seq = 0;
const nextMsgId = () => `m${Date.now()}-${seq++}`;

function pushBot(messages: ChatMessage[], text: string): ChatMessage[] {
  return [...messages, { id: nextMsgId(), role: "bot", text }];
}

function pushUser(messages: ChatMessage[], text: string): ChatMessage[] {
  return [...messages, { id: nextMsgId(), role: "user", text }];
}

/**
 * Resolve nós "message" em cadeia (eles só emitem texto e seguem sozinhos)
 * até parar num nó que espera interação do usuário ("input" ou "options").
 * `visitIndex` escolhe a variante da resposta (0 na 1ª vez que a opção é
 * clicada, 1 na 2ª, e por aí vai — cíclico pelo tamanho da lista).
 */
function settle(
  messages: ChatMessage[],
  nodeId: string,
  copy: ChatCopy,
  visitIndex: number
): { messages: ChatMessage[]; nodeId: string } {
  const node = getChatNode(nodeId);
  if (node.kind !== "message") return { messages, nodeId };
  const variants = copy.answers[node.answerId];
  const variant = variants[visitIndex % variants.length];
  let next = messages;
  for (const line of variant) next = pushBot(next, interpolate(line, FACTS));
  next = pushBot(next, copy.backToMenu);
  return settle(next, node.next, copy, visitIndex);
}

export function initialChatState(copy: ChatCopy): ChatState {
  const messages = pushBot(pushBot([], copy.greeting), copy.askName);
  return { v: 1, nodeId: "askName", name: null, messages, lastInteractionAt: Date.now(), visits: {} };
}

export type ChatAction =
  | { type: "submitName"; value: string; copy: ChatCopy }
  | { type: "selectOption"; id: ChatOptionId; copy: ChatCopy }
  | { type: "reset"; copy: ChatCopy };

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "reset":
      return initialChatState(action.copy);

    case "submitName": {
      const name = sanitizeName(action.value);
      if (!name) {
        return {
          ...state,
          messages: pushBot(state.messages, action.copy.invalidName),
          lastInteractionAt: Date.now(),
        };
      }
      let messages = pushUser(state.messages, name);
      messages = pushBot(messages, interpolate(action.copy.menuPrompt, { ...FACTS, name }));
      return { ...state, name, nodeId: "menu", messages, lastInteractionAt: Date.now() };
    }

    case "selectOption": {
      const node = getChatNode(state.nodeId);
      if (node.kind !== "options") return state;
      const opt = node.options.find((o) => o.id === action.id);
      if (!opt) return state;
      const messages = pushUser(state.messages, action.copy.optionLabels[action.id]);
      const visitIndex = state.visits[action.id] ?? 0;
      const settled = settle(messages, opt.next, action.copy, visitIndex);
      const visits = { ...state.visits, [action.id]: visitIndex + 1 };
      return { ...state, nodeId: settled.nodeId, messages: settled.messages, visits, lastInteractionAt: Date.now() };
    }

    default:
      return state;
  }
}
