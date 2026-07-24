import { describe, it, expect } from "vitest";
import { chatReducer, initialChatState, getChatNode } from "@/lib/chatEngine";
import { translations } from "@/data";

const copy = translations.pt.chat;

describe("motor do chatbot (chatEngine)", () => {
  it("initialChatState começa pedindo o nome", () => {
    const state = initialChatState(copy);
    expect(state.nodeId).toBe("askName");
    expect(state.name).toBeNull();
    expect(state.messages).toHaveLength(2); // saudação + pergunta do nome
  });

  it("submitName com nome válido avança pro menu e cumprimenta pelo nome", () => {
    const state = chatReducer(initialChatState(copy), {
      type: "submitName",
      value: "Maria",
      copy,
    });
    expect(state.nodeId).toBe("menu");
    expect(state.name).toBe("Maria");
    const lastMsg = state.messages.at(-1);
    expect(lastMsg?.role).toBe("bot");
    expect(lastMsg?.text).toContain("Maria");
  });

  it("submitName com nome inválido (XSS) não avança e mostra erro", () => {
    const start = initialChatState(copy);
    const state = chatReducer(start, {
      type: "submitName",
      value: "<script>alert(1)</script>",
      copy,
    });
    expect(state.nodeId).toBe("askName");
    expect(state.name).toBeNull();
    expect(state.messages.at(-1)?.text).toBe(copy.invalidName);
    // nunca deve injetar o texto bruto do usuário como mensagem
    expect(state.messages.some((m) => m.text.includes("<script>"))).toBe(false);
  });

  it("selectOption responde com o conteúdo da opção e volta pro menu", () => {
    let state = chatReducer(initialChatState(copy), { type: "submitName", value: "Ana", copy });
    state = chatReducer(state, { type: "selectOption", id: "skills", copy });
    expect(state.nodeId).toBe("menu");
    const texts = state.messages.map((m) => m.text);
    expect(texts).toContain(copy.optionLabels.skills); // eco da escolha do usuário
    for (const line of copy.answers.skills) expect(texts).toContain(line);
    expect(texts.at(-1)).toBe(copy.backToMenu);
  });

  it("ignora selectOption fora de uma etapa de opções", () => {
    const start = initialChatState(copy); // nodeId = askName, não "options"
    const state = chatReducer(start, { type: "selectOption", id: "exp", copy });
    expect(state).toBe(start);
  });

  it("reset volta ao estado inicial", () => {
    let state = chatReducer(initialChatState(copy), { type: "submitName", value: "Ana", copy });
    state = chatReducer(state, { type: "selectOption", id: "contact", copy });
    const reset = chatReducer(state, { type: "reset", copy });
    expect(reset.nodeId).toBe("askName");
    expect(reset.name).toBeNull();
    expect(reset.messages).toHaveLength(2);
  });

  it("getChatNode lança erro para id inexistente (grafo mal configurado)", () => {
    expect(() => getChatNode("nó-que-não-existe")).toThrow();
  });
});
