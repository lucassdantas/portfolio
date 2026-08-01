import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { Playground } from "@/components/Playground";
import { Navbar } from "@/components/Navbar";
import { projects, experiences, translations } from "@/data";
import { stripMarks } from "@/lib/richText";
import { renderWithProviders } from "../helpers";

// O bullet é renderizado em pedaços (destaque em <strong>), então getByText não
// casa: comparamos o textContent do <li> com o texto sem marcação.
const bulletVisible = (i: number) =>
  screen
    .queryAllByRole("listitem")
    .some((li) => li.textContent === stripMarks(experiences[i].bullets[0]));

describe("ProjectsSection — filtros", () => {
  it("abre nos destaques, não na lista inteira", () => {
    renderWithProviders(<ProjectsSection />);
    const destaques = projects.filter((p) => p.featured);
    expect(destaques.length).toBeGreaterThan(0);
    destaques.forEach((p) => {
      expect(screen.getByRole("heading", { name: p.name })).toBeInTheDocument();
    });
    projects
      .filter((p) => !p.featured)
      .forEach((p) => {
        expect(screen.queryByRole("heading", { name: p.name })).not.toBeInTheDocument();
      });
  });

  it("mostra todos os projetos no filtro 'todos'", async () => {
    renderWithProviders(<ProjectsSection />);
    await userEvent.click(screen.getByRole("button", { name: translations.pt.all }));
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
    expect(bulletVisible(0)).toBe(true);
    expect(bulletVisible(1)).toBe(false);
  });

  it("clicar em outro cargo abre e fecha o anterior", async () => {
    renderWithProviders(<ExperienceSection />);
    await userEvent.click(screen.getByText(`@ ${experiences[1].company}`));
    expect(bulletVisible(1)).toBe(true);
    expect(bulletVisible(0)).toBe(false);
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
