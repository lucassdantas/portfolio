export type Lang = "pt" | "en" | "es" | "fr";

/** [nome, nível, percentual da barra] */
export type SpokenLang = [string, string, number];

export interface Translation {
  navAbout: string;
  navStack: string;
  navExp: string;
  navSys: string;
  navProj: string;
  navEdu: string;
  navContact: string;
  navTerm: string;
  role: string;
  heroLine: string;
  secManifesto: string;
  mfHead: string;
  mfW1: string;
  mfW2: string;
  mfW3: string;
  mfW4: string;
  mfW5: string;
  mfW6: string;
  mfEnd: string;
  tagline: string;
  cta1: string;
  cta2: string;
  statYears: string;
  statProj: string;
  statLangs: string;
  scrollCue: string;
  termTitle: string;
  termDesc: string;
  stackTitle: string;
  stackDesc: string;
  engTitle: string;
  expTitle: string;
  expDesc: string;
  m1: string;
  m2: string;
  m3: string;
  m4: string;
  projTitle: string;
  projDesc: string;
  projFeatured: string;
  catSys: string;
  catSite: string;
  internal: string;
  offline: string;
  /** Contagem hardcoded como no protótipo — atualize se a lista de projetos mudar. */
  secIndex: string;
  coreEyebrow: string;
  coreHint: string;
  coreA: string;
  coreB: string;
  coreCap: string;
  coreFlow: string;
  featured: string;
  caseTitle: string;
  caseKind: string;
  caseBefore: string;
  caseAfter: string;
  caseNodeInput: string;
  caseNodeN8n: string;
  caseNodeModel: string;
  caseNodeIntent: string;
  caseNodeAuth: string;
  caseNodeMcp: string;
  caseToken: string;
  caseToken1x: string;
  caseOut1: string;
  caseOut2: string;
  featDesc: string;
  featM1: string;
  featM2: string;
  featM3: string;
  sysTitle: string;
  sysDesc: string;
  sysProblem: string;
  sysBuilt: string;
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
  ctA: string;
  ctB: string;
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

/**
 * Texto de conteúdo escrito nos 4 idiomas. Diferente de `Translation`
 * (strings de UI, criadas por spread sobre `pt`): aqui cada idioma é
 * obrigatório, então um projeto novo não passa no compilador sem tradução.
 *
 * Cada idioma é uma lista de linhas curtas (renderizadas uma por linha),
 * e dentro da linha `**termo**` marca destaque — ver `src/lib/richText.ts`.
 */
export type Localized = Record<Lang, string[]>;

export interface Project {
  name: string;
  cat: ProjectCategory;
  /**
   * Destaque é flag, não categoria: o projeto continua sendo Sistema ou Site
   * e aparece também no filtro "Destaques". Se fosse uma terceira categoria,
   * destacar um projeto o tiraria da sua própria categoria.
   */
  featured?: boolean;
  desc: Localized;
  img: string;
  live: string;
  repo: string;
  tech: string[];
  /**
   * Quando `live`/`repo` estão vazios, diz por quê: `internal` (sistema
   * interno de cliente, nunca teve URL pública) ou `offline` (existiu e
   * saiu do ar). Sem `live`/`repo` e sem `status`, o índice de projetos
   * assume `offline`.
   */
  status?: "internal" | "offline";
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

/**
 * Entrega de plataforma da seção "sistemas em produção" (src/data/systems.ts).
 *
 * Conteúdo só em PT, como os bullets de experiência: são textos longos e
 * específicos demais para manter em 4 idiomas sem apodrecer. O que é traduzido
 * são os rótulos da seção (`sysTitle`, `sysDesc`, `sysProblem`, `sysBuilt`).
 *
 * `problem`/`built`/`result` aceitam `**termo**` para destaque (src/lib/richText.ts) —
 * um destaque por parágrafo, no resultado ou na decisão, nunca na frase inteira.
 */
export interface SystemCase {
  /** Rótulo curto de domínio, ex.: "plataforma · motor de aprovações". */
  domain: string;
  title: string;
  /** O que existia antes — sem isso o card vira lista de features. */
  problem: string;
  /** O que foi construído e por quê. */
  built: string;
  /** Uma linha: o que mudou. */
  result: string;
  tech: string[];
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

/** Textos do chatbot determinístico — máquina de estados finitos (FSM), sem IA. */
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
