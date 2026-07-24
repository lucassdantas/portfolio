export type Lang = "pt" | "en" | "es" | "fr";

export type Theme = "dark" | "light";

/** [nome, nível, percentual da barra] */
export type SpokenLang = [string, string, number];

export interface Translation {
  navAbout: string;
  navStack: string;
  navExp: string;
  navProj: string;
  navEdu: string;
  navContact: string;
  role: string;
  tagline: string;
  cta1: string;
  cta2: string;
  statYears: string;
  statProj: string;
  statLangs: string;
  badges: string[];
  termTitle: string;
  termDesc: string;
  stackTitle: string;
  stackDesc: string;
  engTitle: string;
  expTitle: string;
  expDesc: string;
  projTitle: string;
  projDesc: string;
  featured: string;
  featDesc: string;
  featM1: string;
  featM2: string;
  featM3: string;
  ghTitle: string;
  ghDesc: string;
  ghRepos: string;
  ghFollowers: string;
  ghStars: string;
  ghLangs: string;
  playTitle: string;
  playDesc: string;
  run: string;
  eduTitle: string;
  certTitle: string;
  langTitle: string;
  booksTitle: string;
  contactTitle: string;
  contactHead: string;
  contactDesc: string;
  remote: string;
  footer: string;
  privacy: string;
  langs: SpokenLang[];
  all: string;
  chat: ChatCopy;
}

export interface Experience {
  title: string;
  company: string;
  period: string;
  mode: string;
  bullets: string[];
  tech: string[];
}

export type ProjectCategory = "Sistemas" | "Sites";

export interface Project {
  name: string;
  cat: ProjectCategory;
  desc: string;
  img: string;
  live: string;
  repo: string;
  tech: string[];
}

export interface Certification {
  period: string;
  title: string;
  institution: string;
  hours: number;
  url: string;
}

export interface Education {
  period: string;
  course: string;
  institution: string;
  grade: string;
  desc: string;
}

export interface StackItem {
  name: string;
  img?: string;
}

export interface StackGroup {
  label: string;
  items: StackItem[];
}

export interface Principle {
  icon: string;
  title: string;
  desc: string;
}

export interface Book {
  initials: string;
  title: string;
  author: string;
}

export type ChatOptionId = "exp" | "skills" | "projects" | "education" | "contact" | "about";

export interface ChatOption {
  id: ChatOptionId;
  icon: string;
}

/** Textos do chatbot determinístico (widget flutuante). */
export interface ChatCopy {
  launcher: string;
  title: string;
  greeting: string;
  askName: string;
  namePlaceholder: string;
  sendLabel: string;
  /** Usa "{name}" como placeholder — substituído em runtime. */
  menuPrompt: string;
  optionLabels: Record<ChatOptionId, string>;
  /**
   * Variantes de resposta por opção — mini-RAG: cada linha pode usar
   * placeholders "{chave}" resolvidos com fatos reais de src/data
   * (src/lib/chatFacts.ts). Ao clicar de novo na mesma opção, o motor
   * roda pra próxima variante da lista (respostas diferentes sobre o
   * mesmo assunto em vez de repetir o texto).
   */
  answers: Record<ChatOptionId, string[][]>;
  backToMenu: string;
  resetLabel: string;
  closeLabel: string;
  invalidName: string;
  typing: string;
}

// ------------------------------------------------------------------
// Grafo do fluxo do chatbot (src/data/chatbot.ts).
// Cada nó é uma etapa; `next`/`options[].next` apontam para o `id` da
// próxima etapa (ou sub-etapa). Adicionar/reordenar etapas é só editar
// o array `chatFlow` — o motor (src/lib/chatEngine.ts) não muda.
// ------------------------------------------------------------------

/** Etapa que aguarda texto livre do usuário (hoje só o nome). */
export interface ChatInputNode {
  kind: "input";
  id: string;
  next: string;
}

/** Etapa de menu: um botão por opção, cada uma podendo levar a uma sub-etapa. */
export interface ChatOptionsNode {
  kind: "options";
  id: string;
  options: { id: ChatOptionId; icon: string; next: string }[];
}

/** Etapa que só emite texto (respostas do bot) e segue automaticamente para `next`. */
export interface ChatMessageNode {
  kind: "message";
  id: string;
  answerId: ChatOptionId;
  next: string;
}

export type ChatNode = ChatInputNode | ChatOptionsNode | ChatMessageNode;
