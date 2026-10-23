import { afterEach, describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { Navbar } from "@/components/Navbar";
import { SectionRail } from "@/components/SectionRail";
import { translations } from "@/data";
import { renderWithProviders } from "../helpers";

// Monta seções falsas com o topo em posições conhecidas (jsdom não faz layout):
// tudo acima de 40% da tela conta como "já entrou".
function mountSections(tops: Record<string, number>) {
  Object.entries(tops).forEach(([id, top]) => {
    const el = document.createElement("section");
    el.id = id;
    el.getBoundingClientRect = () => ({ top, bottom: top + 800 }) as DOMRect;
    document.body.appendChild(el);
  });
}

afterEach(() => {
  document.querySelectorAll("section").forEach((s) => s.remove());
});

describe("Seção atual — menu do topo e trilha lateral", () => {
  const tops = { top: -3000, stack: -2000, experiencia: -1200, sistemas: -600, projetos: 100, github: 900 };

  it("acende no menu do topo o link da seção que está na tela", () => {
    mountSections(tops);
    renderWithProviders(<Navbar />);
    const link = screen.getAllByRole("link", { name: translations.pt.navProj })[0];
    expect(link).toHaveAttribute("aria-current", "location");
    expect(screen.getAllByRole("link", { name: "GitHub" })[0]).not.toHaveAttribute("aria-current");
  });

  it("a trilha marca a seção atual e mostra o nome dela", () => {
    mountSections(tops);
    renderWithProviders(<SectionRail />);
    const btn = screen.getByRole("button", { name: translations.pt.navProj });
    expect(btn).toHaveAttribute("aria-current", "location");
    // o nome aparece (classe opacity-100) assim que entra na seção
    expect(btn.querySelector("span")!.className).toContain("opacity-100");
  });
});
