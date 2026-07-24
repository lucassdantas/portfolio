// Motor genérico do chatbot: interpreta o grafo `chatFlow` (src/data/chatbot.ts)
// e produz o próximo estado. Não conhece "nome" nem "menu" especificamente —
// só segue `id`/`next` — então configurar novas etapas/sub-etapas é só editar
// o array de dados, sem tocar aqui. Sem dependência de React: testável isolado
// (src/tests/unit/chatEngine.test.ts).
import { chatFlow } from "@/data";
import { sanitizeName, type ChatMessage, type ChatState } from "@/lib/chat";
import type { ChatCopy, ChatNode, ChatOptionId } from "@/types";

const nodesById = new Map(chatFlow.map((n) => [n.id, n]));

export function getChatNode(id: string): ChatNode {
  const node = nodesById.get(id);
  if (!node) throw new Error(`chatEngine: nó "${id}" não existe em chatFlow`);
  return node;
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
 */
function settle(
  messages: ChatMessage[],
  nodeId: string,
  copy: ChatCopy
): { messages: ChatMessage[]; nodeId: string } {
  const node = getChatNode(nodeId);
  if (node.kind !== "message") return { messages, nodeId };
  let next = messages;
  for (const line of copy.answers[node.answerId]) next = pushBot(next, line);
  next = pushBot(next, copy.backToMenu);
  return settle(next, node.next, copy);
}

export function initialChatState(copy: ChatCopy): ChatState {
  const messages = pushBot(pushBot([], copy.greeting), copy.askName);
  return { v: 1, nodeId: "askName", name: null, messages, lastInteractionAt: Date.now() };
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
      messages = pushBot(messages, action.copy.menuPrompt.replace("{name}", name));
      return { ...state, name, nodeId: "menu", messages, lastInteractionAt: Date.now() };
    }

    case "selectOption": {
      const node = getChatNode(state.nodeId);
      if (node.kind !== "options") return state;
      const opt = node.options.find((o) => o.id === action.id);
      if (!opt) return state;
      const messages = pushUser(state.messages, action.copy.optionLabels[action.id]);
      const settled = settle(messages, opt.next, action.copy);
      return { ...state, nodeId: settled.nodeId, messages: settled.messages, lastInteractionAt: Date.now() };
    }

    default:
      return state;
  }
}
