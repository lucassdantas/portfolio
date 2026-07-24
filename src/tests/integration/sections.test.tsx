import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { Playground } from "@/components/Playground";
import { Navbar } from "@/components/Navbar";
import { projects, experiences } from "@/data";
import { renderWithProviders } from "../helpers";

describe("ProjectsSection — filtros", () => {
  it("mostra todos os projetos por padrão", () => {
    renderWithProviders(<ProjectsSection />);
    projects.forEach((p) => {
      expect(screen.getByRole("heading", { name: p.name })).toBeInTheDocument();
    });
  });

  it("filtra por Sistemas", async () => {
    renderWithProviders(<ProjectsSection />);
    await userEvent.click(screen.getByRole("button", { name: "Sistemas" }));
    const sistemas = projects.filter((p) => p.cat === "Sistemas");
    const sites = projects.filter((p) => p.cat === "Sites");
    sistemas.forEach((p) => {
      expect(screen.getByRole("heading", { name: p.name })).toBeInTheDocument();
    });
    sites.forEach((p) => {
      expect(screen.queryByRole("heading", { name: p.name })).not.toBeInTheDocument();
    });
  });
});

describe("ExperienceSection — acordeão", () => {
  it("primeira experiência aberta por padrão", () => {
    renderWithProviders(<ExperienceSection />);
    expect(screen.getByText(experiences[0].bullets[0])).toBeInTheDocument();
    expect(screen.queryByText(experiences[1].bullets[0])).not.toBeInTheDocument();
  });

  it("clicar em outro cargo abre e fecha o anterior", async () => {
    renderWithProviders(<ExperienceSection />);
    await userEvent.click(screen.getByText(`@ ${experiences[1].company}`));
    expect(screen.getByText(experiences[1].bullets[0])).toBeInTheDocument();
    expect(screen.queryByText(experiences[0].bullets[0])).not.toBeInTheDocument();
  });
});

describe("Playground — executa JS", () => {
  it("RUN executa o código e mostra o output", async () => {
    renderWithProviders(<Playground />);
    const editor = screen.getByRole("textbox");
    await userEvent.clear(editor);
    await userEvent.click(editor);
    await userEvent.keyboard("console.log(2 + 2)");
    await userEvent.click(screen.getByRole("button", { name: /RUN/ }));
    expect(screen.getByText(/> 4/)).toBeInTheDocument();
  });

  it("erro de sintaxe aparece com ✖", async () => {
    renderWithProviders(<Playground />);
    const editor = screen.getByRole("textbox");
    await userEvent.clear(editor);
    await userEvent.click(editor);
    await userEvent.keyboard("isso não é js válido!!!");
    await userEvent.click(screen.getByRole("button", { name: /RUN/ }));
    expect(screen.getByText(/✖/)).toBeInTheDocument();
  });
});

describe("Navbar — tema e idioma", () => {
  it("alterna o tema e persiste em localStorage", async () => {
    renderWithProviders(<Navbar />);
    await userEvent.click(screen.getByTitle("Tema"));
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem("ldp-theme")).toBe("light");
  });

  it("troca o idioma para EN e traduz os links", async () => {
    renderWithProviders(<Navbar />);
    await userEvent.click(screen.getByRole("button", { name: "EN" }));
    expect(screen.getAllByText("Experience").length).toBeGreaterThan(0);
    expect(localStorage.getItem("ldp-lang")).toBe("en");
  });
});
