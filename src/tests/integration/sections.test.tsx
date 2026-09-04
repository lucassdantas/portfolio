import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import { screen, within, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { SystemsSection } from "@/components/SystemsSection";
import { Playground } from "@/components/Playground";
import { Navbar } from "@/components/Navbar";
import { projects, experiences, systems } from "@/data";
import { stripMarks } from "@/lib/richText";
import { renderWithProviders } from "../helpers";

// O bullet é renderizado em pedaços (destaque em <strong>), então getByText não
// casa: comparamos o textContent do <li> com o texto sem marcação.
const bulletVisible = (i: number) =>
  screen
    .queryAllByRole("listitem")
    .some((li) => li.textContent === stripMarks(experiences[i].bullets[0]));

describe("ProjectsSection — carrossel", () => {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  it("abre no primeiro projeto em destaque e lista o restante abaixo", () => {
    renderWithProviders(<ProjectsSection />);
    expect(screen.getByRole("heading", { name: featured[0].name })).toBeInTheDocument();
    featured.slice(1).forEach((p) => {
      expect(screen.queryByRole("heading", { name: p.name })).not.toBeInTheDocument();
    });
    expect(rest.length).toBeGreaterThan(0);
    rest.forEach((p) => {
      expect(screen.getByText(p.name)).toBeInTheDocument();
    });
  });

  it("a seta → avança para o próximo projeto em destaque", async () => {
    renderWithProviders(<ProjectsSection />);
    await userEvent.click(screen.getByRole("button", { name: "próximo" }));
    expect(screen.getByRole("heading", { name: featured[1].name })).toBeInTheDocument();
  });

  it("clicar num número da trilha troca direto para aquele projeto", async () => {
    renderWithProviders(<ProjectsSection />);
    await userEvent.click(screen.getByRole("button", { name: "03" }));
    expect(screen.getByRole("heading", { name: featured[2].name })).toBeInTheDocument();
  });

  it("seta do teclado ArrowRight avança o carrossel", () => {
    renderWithProviders(<ProjectsSection />);
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(screen.getByRole("heading", { name: featured[1].name })).toBeInTheDocument();
  });

  it("projeto sem link publica o status (interno/fora do ar)", () => {
    renderWithProviders(<ProjectsSection />);
    const semLink = rest.find((p) => !p.live && !p.repo);
    expect(semLink).toBeDefined();
    const row = screen.getByText(semLink!.name).closest("div");
    expect(within(row!).getByText(/interno|fora do ar/)).toBeInTheDocument();
  });
});

describe("ProjectsSection — autoplay", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("avança sozinho depois do intervalo, mas pausa com o mouse em cima", () => {
    renderWithProviders(<ProjectsSection />);
    const featured = projects.filter((p) => p.featured);
    const stage = screen.getByTestId("proj-stage");

    fireEvent.mouseEnter(stage);
    act(() => vi.advanceTimersByTime(7000));
    expect(screen.getByRole("heading", { name: featured[0].name })).toBeInTheDocument();

    fireEvent.mouseLeave(stage);
    act(() => vi.advanceTimersByTime(7000));
    expect(screen.getByRole("heading", { name: featured[1].name })).toBeInTheDocument();
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
    await userEvent.click(screen.getByRole("button", { name: new RegExp(experiences[1].company) }));
    expect(bulletVisible(1)).toBe(true);
    expect(bulletVisible(0)).toBe(false);
  });
});

describe("SystemsSection — sistemas em produção", () => {
  it("renderiza um card por entrega, com título e resultado", () => {
    renderWithProviders(<SystemsSection />);
    systems.forEach((s) => {
      expect(screen.getByRole("heading", { name: s.title })).toBeInTheDocument();
    });
    // o resultado é a linha que justifica o card existir — se sumir, o card
    // vira lista de features
    const first = systems[0];
    const card = screen.getByRole("heading", { name: first.title }).closest("article");
    expect(card!.textContent).toContain(stripMarks(first.result));
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

describe("Navbar — idioma", () => {
  it("troca o idioma para EN e traduz os links", async () => {
    renderWithProviders(<Navbar />);
    await userEvent.click(screen.getByRole("button", { name: "EN" }));
    expect(screen.getAllByText("Experience").length).toBeGreaterThan(0);
    expect(localStorage.getItem("ldp-lang")).toBe("en");
  });
});
