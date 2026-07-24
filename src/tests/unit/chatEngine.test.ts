import { describe, it, expect } from "vitest";
import { chatReducer, initialChatState, getChatNode, interpolate } from "@/lib/chatEngine";
import { translations, experiences } from "@/data";

const copy = translations.pt.chat;

describe("interpolate", () => {
  it("substitui placeholders conhecidos", () => {
    expect(interpolate("Oi {name}, tudo bem?", { name: "Ana" })).toBe("Oi Ana, tudo bem?");
  });

  it("mantém placeholders desconhecidos como estão", () => {
    expect(interpolate("Oi {desconhecido}", {})).toBe("Oi {desconhecido}");
  });
});

describe("motor do chatbot (chatEngine)", () => {
  it("initialChatState começa pedindo o nome, sem visitas registradas", () => {
    const state = initialChatState(copy);
    expect(state.nodeId).toBe("askName");
    expect(state.name).toBeNull();
    expect(state.visits).toEqual({});
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

  it("selectOption responde com fatos reais e volta pro menu", () => {
    let state = chatReducer(initialChatState(copy), { type: "submitName", value: "Ana", copy });
    state = chatReducer(state, { type: "selectOption", id: "skills", copy });
    expect(state.nodeId).toBe("menu");
    const texts = state.messages.map((m) => m.text);
    expect(texts).toContain(copy.optionLabels.skills); // eco da escolha do usuário
    expect(texts.some((t) => t.includes("Back-end"))).toBe(true); // fato real vindo de stackGroups
    expect(texts.at(-1)).toBe(copy.backToMenu);
  });

  it("nunca menciona o nome da empresa nas respostas do chat", () => {
    let state = initialChatState(copy);
    state = chatReducer(state, { type: "submitName", value: "Ana", copy });
    for (const id of ["about", "exp", "skills", "projects", "education", "contact"] as const) {
      state = chatReducer(state, { type: "selectOption", id, copy });
    }
    const allText = state.messages.map((m) => m.text).join(" \n ");
    for (const e of experiences) {
      expect(allText).not.toContain(e.company);
    }
  });

  it("clicar duas vezes na mesma opção mostra uma variante diferente", () => {
    let state = chatReducer(initialChatState(copy), { type: "submitName", value: "Ana", copy });
    state = chatReducer(state, { type: "selectOption", id: "about", copy });
    const firstAnswer = state.messages.map((m) => m.text).join("\n");

    state = chatReducer(state, { type: "selectOption", id: "about", copy });
    const secondBatch = state.messages.slice(-4, -1).map((m) => m.text); // eco + linhas da 2ª variante (antes do backToMenu)

    expect(state.visits.about).toBe(2);
    expect(secondBatch.join("\n")).not.toBe(firstAnswer);
  });

  it("ignora selectOption fora de uma etapa de opções", () => {
    const start = initialChatState(copy); // nodeId = askName, não "options"
    const state = chatReducer(start, { type: "selectOption", id: "exp", copy });
    expect(state).toBe(start);
  });

  it("reset volta ao estado inicial (encerra e começa nova conversa)", () => {
    let state = chatReducer(initialChatState(copy), { type: "submitName", value: "Ana", copy });
    state = chatReducer(state, { type: "selectOption", id: "contact", copy });
    const reset = chatReducer(state, { type: "reset", copy });
    expect(reset.nodeId).toBe("askName");
    expect(reset.name).toBeNull();
    expect(reset.visits).toEqual({});
    expect(reset.messages).toHaveLength(2);
  });

  it("getChatNode lança erro para id inexistente (grafo mal configurado)", () => {
    expect(() => getChatNode("nó-que-não-existe")).toThrow();
  });
});
