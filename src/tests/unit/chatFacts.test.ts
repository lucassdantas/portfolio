import { describe, it, expect } from "vitest";
import { getChatFacts } from "@/lib/chatFacts";
import { experiences, projects, stackGroups, site } from "@/data";

describe("getChatFacts (mini-RAG do chatbot)", () => {
  it("nunca inclui o nome da empresa das experiências", () => {
    const facts = getChatFacts();
    for (const e of experiences) {
      expect(facts.expList).not.toContain(e.company);
    }
  });

  it("reflete dados reais de src/data (não texto solto)", () => {
    const facts = getChatFacts();
    expect(facts.years).toBe(site.stats.years);
    expect(facts.stackList).toContain(stackGroups[0].label);
  });

  it("projectCount é a contagem de cards publicados, não o total de carreira", () => {
    const facts = getChatFacts();
    expect(facts.projectCount).toBe(String(projects.length));
    // "40+" é o número do hero (carreira inteira) e não deve vazar pro chatbot,
    // que fala em "projetos publicados aqui"
    expect(facts.projectCount).not.toBe(site.stats.projects);
  });

  it("expList tem uma linha por experiência", () => {
    const facts = getChatFacts();
    expect(facts.expList.split("\n")).toHaveLength(experiences.length);
  });
});
