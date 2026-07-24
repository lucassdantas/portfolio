import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Footer } from "@/components/Footer";
import { renderWithProviders } from "../helpers";

describe("Política de Privacidade (LGPD)", () => {
  it("abre o modal a partir do rodapé", async () => {
    renderWithProviders(<Footer />);
    await userEvent.click(screen.getByRole("button", { name: "Política de Privacidade" }));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(screen.getAllByText(/LGPD/).length).toBeGreaterThan(0);
    expect(screen.getByText(/1\. Dados coletados/)).toBeInTheDocument();
  });

  it("fecha com o botão ✕", async () => {
    renderWithProviders(<Footer />);
    await userEvent.click(screen.getByRole("button", { name: "Política de Privacidade" }));
    await userEvent.click(screen.getByRole("button", { name: "Fechar" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("fecha com Escape", async () => {
    renderWithProviders(<Footer />);
    await userEvent.click(screen.getByRole("button", { name: "Política de Privacidade" }));
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
