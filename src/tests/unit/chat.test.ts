import { describe, it, expect, beforeEach } from "vitest";
import {
  sanitizeName,
  isExpired,
  loadChatState,
  saveChatState,
  clearChatState,
  CHAT_STORAGE_KEY,
  MAX_NAME_LENGTH,
  type ChatState,
} from "@/lib/chat";

describe("sanitizeName", () => {
  it("mantém nomes simples com acento", () => {
    expect(sanitizeName("Lucás")).toBe("Lucás");
  });

  it("colapsa espaços e remove espaços nas pontas", () => {
    expect(sanitizeName("  João   Silva  ")).toBe("João Silva");
  });

  it("mantém hífen e apóstrofo", () => {
    expect(sanitizeName("Ana-Clara D'Ávila")).toBe("Ana-Clara D'Ávila");
  });

  it("corta no limite máximo de caracteres", () => {
    const gigante = "a".repeat(500);
    const resultado = sanitizeName(gigante);
    expect(resultado.length).toBeLessThanOrEqual(MAX_NAME_LENGTH);
  });

  it("rejeita string vazia ou só espaços", () => {
    expect(sanitizeName("")).toBe("");
    expect(sanitizeName("   ")).toBe("");
  });

  it("rejeita tentativa de XSS/HTML — não é um nome válido", () => {
    expect(sanitizeName("<script>alert(1)</script>")).toBe("");
    expect(sanitizeName("<img src=x onerror=alert(1)>")).toBe("");
  });

  it("rejeita números e símbolos soltos", () => {
    expect(sanitizeName("12345")).toBe("");
    expect(sanitizeName("!!!")).toBe("");
  });
});

describe("isExpired", () => {
  it("não expira dentro de 1h", () => {
    const now = 1_000_000;
    expect(isExpired(now - 59 * 60 * 1000, now)).toBe(false);
  });

  it("expira após 1h de inatividade", () => {
    const now = 1_000_000;
    expect(isExpired(now - 61 * 60 * 1000, now)).toBe(true);
  });
});

describe("loadChatState / saveChatState", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const baseState: ChatState = {
    v: 1,
    nodeId: "menu",
    name: "Lucas",
    messages: [{ id: "m1", role: "bot", text: "oi" }],
    lastInteractionAt: Date.now(),
    visits: { skills: 1 },
  };

  it("faz round-trip: salva e lê de volta igual", () => {
    saveChatState(baseState);
    expect(loadChatState()).toEqual(baseState);
  });

  it("retorna null quando não há nada salvo", () => {
    expect(loadChatState()).toBeNull();
  });

  it("retorna null e não quebra com JSON corrompido", () => {
    localStorage.setItem(CHAT_STORAGE_KEY, "{não é json válido");
    expect(loadChatState()).toBeNull();
  });

  it("aplica TTL: estado expirado (>1h de inatividade) some", () => {
    saveChatState({ ...baseState, lastInteractionAt: Date.now() - 2 * 60 * 60 * 1000 });
    expect(loadChatState()).toBeNull();
  });

  it("clearChatState remove a chave", () => {
    saveChatState(baseState);
    clearChatState();
    expect(loadChatState()).toBeNull();
  });
});
