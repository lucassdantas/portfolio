import { describe, it, expect, beforeEach, vi } from "vitest";
import { useEffect, useState, type ComponentType } from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatWidget } from "@/components/ChatWidget";
import { renderWithProviders } from "../helpers";
import { CHAT_STORAGE_KEY } from "@/lib/chat";

// next/dynamic(..., { ssr: false }) faz "bailout to CSR" via runtime do Next —
// não existe fora de um app Next real, então sob Vitest/jsdom o import trava
// pra sempre. Mockamos next/dynamic por um wrapper simples que só resolve a
// mesma promise (import real do ChatPanel), preservando o comportamento
// assíncrono sem depender do runtime do Next.
vi.mock("next/dynamic", () => ({
  default: (loader: () => Promise<unknown>) => {
    function DynamicMock(props: Record<string, unknown>) {
      const [Comp, setComp] = useState<ComponentType<Record<string, unknown>> | null>(null);
      useEffect(() => {
        let alive = true;
        loader().then((mod) => {
          if (!alive) return;
          const resolved = (mod as { default?: unknown })?.default ?? mod;
          setComp(() => resolved as ComponentType<Record<string, unknown>>);
        });
        return () => {
          alive = false;
        };
      }, []);
      return Comp ? <Comp {...props} /> : null;
    }
    return DynamicMock;
  },
}));

const TYPING_TIMEOUT = { timeout: 2000 };

async function openChat() {
  await userEvent.click(screen.getByRole("button", { name: "Abrir chat" }));
  return screen.findByPlaceholderText("Seu nome…", undefined, TYPING_TIMEOUT);
}

describe("Chatbot (widget flutuante)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("bolha abre o painel e cumprimenta pedindo o nome", async () => {
    renderWithProviders(<ChatWidget />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await openChat();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/assistente virtual do Lucas/)).toBeInTheDocument();
  });

  it("fluxo completo: nome válido → menu → resposta de uma opção", async () => {
    renderWithProviders(<ChatWidget />);
    const input = await openChat();

    await userEvent.type(input, "Maria{Enter}");
    await waitFor(
      () => expect(screen.getByText(/Prazer, Maria!/)).toBeInTheDocument(),
      TYPING_TIMEOUT
    );

    await userEvent.click(screen.getByRole("button", { name: /Habilidades/ }));
    await waitFor(
      () => expect(screen.getByText(/Python, FastAPI, Laravel/)).toBeInTheDocument(),
      TYPING_TIMEOUT
    );
    // volta pro menu (as opções continuam visíveis) e pergunta se quer saber mais algo
    expect(screen.getByText("Quer saber mais alguma coisa?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Experiência/ })).toBeInTheDocument();
  });

  it("nome inválido (tentativa de XSS) mostra erro e não injeta HTML bruto", async () => {
    renderWithProviders(<ChatWidget />);
    const input = await openChat();

    await userEvent.type(input, "<script>alert(1)</script>{Enter}");
    await waitFor(
      () => expect(screen.getByText(/Pode digitar um nome válido/)).toBeInTheDocument(),
      TYPING_TIMEOUT
    );
    // continua pedindo o nome — não avançou pro menu
    expect(screen.getByPlaceholderText("Seu nome…")).toBeInTheDocument();
    // o texto digitado nunca deve virar HTML de verdade no DOM
    expect(document.querySelector("script")).toBeNull();
  });

  it("persiste a conversa: reabrir o painel mantém o histórico", async () => {
    renderWithProviders(<ChatWidget />);
    const input = await openChat();
    await userEvent.type(input, "Ana{Enter}");
    await waitFor(
      () => expect(screen.getByText(/Prazer, Ana!/)).toBeInTheDocument(),
      TYPING_TIMEOUT
    );

    await userEvent.click(screen.getByRole("button", { name: "Fechar" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(localStorage.getItem(CHAT_STORAGE_KEY)).toContain("Ana");

    await userEvent.click(screen.getByRole("button", { name: "Abrir chat" }));
    expect(await screen.findByText(/Prazer, Ana!/)).toBeInTheDocument();
  });

  it("conversa expira após 1h de inatividade e recomeça limpa", async () => {
    localStorage.setItem(
      CHAT_STORAGE_KEY,
      JSON.stringify({
        v: 1,
        nodeId: "menu",
        name: "Pedro",
        messages: [{ id: "old1", role: "user", text: "Pedro" }],
        lastInteractionAt: Date.now() - 2 * 60 * 60 * 1000,
      })
    );
    renderWithProviders(<ChatWidget />);
    await openChat();
    expect(screen.getByText(/assistente virtual do Lucas/)).toBeInTheDocument();
    expect(screen.queryByText("Pedro")).not.toBeInTheDocument();
  });
});
