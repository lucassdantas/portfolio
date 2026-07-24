// Utilitários puros do chatbot: sanitização de input, TTL e persistência.
// Sem dependência de React — testável isoladamente (src/tests/unit/chat.test.ts).
import type { ChatOptionId } from "@/types";

export const CHAT_STORAGE_KEY = "ldp-chat";
/** Conversa expira após 1h sem interação. */
export const CHAT_TTL_MS = 60 * 60 * 1000;
/** Limite de tamanho do nome: cobre qualquer nome real sem permitir colar texto gigante. */
export const MAX_NAME_LENGTH = 40;

// Remove caracteres de controle (0x00–0x1F e 0x7F).
const CONTROL_CHARS = /[\x00-\x1F\x7F]/g;

// Letras (com acentos/unicode), espaço, hífen e apóstrofo — nada de tags, símbolos ou controle.
const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}\s'-]*$/u;

/**
 * Sanitiza o nome digitado pelo usuário: remove caracteres de controle,
 * colapsa espaços, corta em MAX_NAME_LENGTH e valida o charset.
 * Retorna "" quando o resultado é inválido/vazio (sinal de erro pro chamador).
 */
export function sanitizeName(raw: string): string {
  const cleaned = raw
    .replace(CONTROL_CHARS, "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, MAX_NAME_LENGTH);
  return NAME_PATTERN.test(cleaned) ? cleaned : "";
}

export function isExpired(lastInteractionAt: number, now: number = Date.now()): boolean {
  return now - lastInteractionAt > CHAT_TTL_MS;
}

export interface ChatMessage {
  id: string;
  role: "bot" | "user";
  text: string;
}

export interface ChatState {
  v: 1;
  nodeId: string;
  name: string | null;
  messages: ChatMessage[];
  lastInteractionAt: number;
  /** Quantas vezes cada opção do menu já foi clicada — usado pra alternar a variante de resposta. */
  visits: Partial<Record<ChatOptionId, number>>;
}

function isChatState(value: unknown): value is ChatState {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<ChatState>;
  return v.v === 1 && typeof v.nodeId === "string" && Array.isArray(v.messages);
}

/** Lê a conversa salva. Retorna null se não existir, estiver corrompida ou tiver expirado (TTL de 1h). */
export function loadChatState(): ChatState | null {
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isChatState(parsed)) return null;
    if (isExpired(parsed.lastInteractionAt)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveChatState(state: ChatState): void {
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage indisponível (modo privado, quota excedida etc.) — chat segue funcionando em memória
  }
}

export function clearChatState(): void {
  try {
    localStorage.removeItem(CHAT_STORAGE_KEY);
  } catch {
    // ignora — melhor esforço
  }
}
