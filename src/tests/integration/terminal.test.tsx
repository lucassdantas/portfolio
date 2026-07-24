import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Terminal } from "@/components/Terminal";
import { renderWithProviders } from "../helpers";

async function typeCommand(cmd: string) {
  const input = screen.getByRole("textbox");
  await userEvent.click(input);
  await userEvent.keyboard(cmd + "{Enter}");
}

describe("Terminal interativo", () => {
  it("mostra o banner inicial", () => {
    renderWithProviders(<Terminal />);
    expect(screen.getByText(/portfolio v2\.0/)).toBeInTheDocument();
  });

  it("help lista os comandos", async () => {
    renderWithProviders(<Terminal />);
    await typeCommand("help");
    expect(screen.getByText(/whoami\s+— quem sou eu/)).toBeInTheDocument();
    expect(screen.getByText(/sudo hire-me/)).toBeInTheDocument();
  });

  it("whoami responde com o perfil", async () => {
    renderWithProviders(<Terminal />);
    await typeCommand("whoami");
    expect(screen.getByText(/Lucas Dantas — Desenvolvedor Full Stack/)).toBeInTheDocument();
  });

  it("sudo hire-me responde com onboarding", async () => {
    renderWithProviders(<Terminal />);
    await typeCommand("sudo hire-me");
    expect(screen.getByText(/Iniciando onboarding/)).toBeInTheDocument();
  });

  it("comando desconhecido mostra erro", async () => {
    renderWithProviders(<Terminal />);
    await typeCommand("xyz");
    expect(screen.getByText(/comando não encontrado: xyz/)).toBeInTheDocument();
  });

  it("clear limpa o terminal", async () => {
    renderWithProviders(<Terminal />);
    await typeCommand("help");
    await typeCommand("clear");
    expect(screen.queryByText(/portfolio v2\.0/)).not.toBeInTheDocument();
    expect(screen.queryByText(/whoami\s+— quem sou eu/)).not.toBeInTheDocument();
  });

  it("lang en troca o idioma e persiste", async () => {
    renderWithProviders(<Terminal />);
    await typeCommand("lang en");
    expect(screen.getByText(/idioma: en ✔/)).toBeInTheDocument();
    expect(localStorage.getItem("ldp-lang")).toBe("en");
  });

  it("theme alterna o tema no <html>", async () => {
    renderWithProviders(<Terminal />);
    const before = document.documentElement.dataset.theme;
    await typeCommand("theme");
    expect(screen.getByText(/tema alterado ✔/)).toBeInTheDocument();
    expect(document.documentElement.dataset.theme).not.toBe(before);
  });

  it("histórico navega com seta para cima", async () => {
    renderWithProviders(<Terminal />);
    await typeCommand("whoami");
    const input = screen.getByRole("textbox") as HTMLInputElement;
    await userEvent.keyboard("{ArrowUp}");
    expect(input.value).toBe("whoami");
  });
});
