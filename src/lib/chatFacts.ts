// "Mini RAG" do chatbot: fatos reais retirados de src/data (a mesma fonte que
// alimenta o resto do site), usados como placeholders {chave} nas respostas
// (src/data/translations.ts → chat.answers). Fica tudo aqui centralizado pra
// nunca dessincronizar do conteúdo real — e, de propósito, nunca inclui o
// campo `company` das experiências (o chatbot não deve citar nome de empresa).
import { books, educations, experiences, principles, projects, site, stackGroups } from "@/data";

const TECH_PER_ENTRY = 4;

export interface ChatFacts {
  [key: string]: string;
  years: string;
  projectCount: string;
  techTop: string;
  expList: string;
  stackList: string;
  principlesList: string;
  projectCategories: string;
  eduList: string;
  bookList: string;
}

export function getChatFacts(): ChatFacts {
  const techTop = Array.from(new Set(stackGroups.flatMap((g) => g.items.map((i) => i.name))))
    .slice(0, 6)
    .join(", ");

  const expList = experiences
    .map((e) => `• ${e.title} (${e.period}): ${e.tech.slice(0, TECH_PER_ENTRY).join(", ")}`)
    .join("\n");

  const stackList = stackGroups
    .map((g) => `• ${g.label}: ${g.items.slice(0, TECH_PER_ENTRY).map((i) => i.name).join(", ")}`)
    .join("\n");

  const principlesList = principles.map((p) => `• ${p.title}`).join("\n");

  const projectCategories = Array.from(new Set(projects.map((p) => p.cat))).join(", ");

  const eduList = educations.map((e) => `• ${e.course} — ${e.institution} (${e.period})`).join("\n");

  const bookList = books.slice(0, 3).map((b) => `• ${b.title} — ${b.author}`).join("\n");

  return {
    years: site.stats.years,
    projectCount: site.stats.projects,
    techTop,
    expList,
    stackList,
    principlesList,
    projectCategories,
    eduList,
    bookList,
  };
}
