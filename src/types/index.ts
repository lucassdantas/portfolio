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
  /** OrbitSection (astronauta, cena em public/astro-hero): textos da cena em três atos. */
  orbitHint: string;
  /** Enquanto o astronauta carrega. */
  orbitLoading: string;
  /** Crédito do modelo 3D (Smithsonian, CC0). */
  orbitCredit: string;
  /** Título do 1º ato. */
  orbitA: string;
  /** Frase do 3º ato; `
` vira quebra de linha. */
  orbitB: string;
  orbitMidTop: string;
  orbitMidBottom: string;
  /** Botão do 3º ato (leva ao contato). */
  orbitCta: string;
  /** Descrição da cena para leitor de tela. */
  orbitAria: string;
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
  /** Card de sistema: rótulos de antes/depois e o botão que abre o detalhe. */
  sysBefore: string;
  sysAfter: string;
  sysMore: string;
  sysLess: string;
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
  /** Trecho de `ctB` que aparece em azul (precisa ser substring exata de `ctB`). */
  ctAccent: string;
  /** Cartão de status do contato: linha de disponibilidade e os pares rótulo/valor. */
  ctStatus: string;
  ctLabRole: string;
  ctRole: string;
  ctLabModel: string;
  ctModel: string;
  ctLabBase: string;
  ctLabLangs: string;
  footer: string;
  privacy: string;
  langs: SpokenLang[];
  /** Rótulo acessível da trilha de seções (SectionRail). */
  railLabel: string;
  /** Rótulos acessíveis das setas do carrossel de projetos. */
  prevLabel: string;
  nextLabel: string;
  /** Rótulo "Projeto 01" do carrossel. */
  projLabel: string;
  /** Aviso de autoplay pausado (mouse sobre o palco do carrossel). */
  projPaused: string;
  /** Cabeçalho das colunas do índice de projetos e o rótulo do link. */
  idxProject: string;
  /** Botão da trilha ambiente: textos acessíveis de ligar/desligar. */
  soundOn: string;
  soundOff: string;
  idxTech: string;
  idxAccess: string;
  visit: string;
  /** Rótulo acessível de botão de fechar (modal de privacidade). */
  close: string;
  /** Código inicial do playground — comentário e chaves no idioma. */
  playCode: string;
  playIdle: string;
  playEmpty: string;
  all: string;
  term: TermCopy;
  chat: ChatCopy;
}

/**
 * Saídas do terminal interativo. Os comandos em si (`help`, `whoami`…) são
 * iguais em todo idioma; só o texto que eles imprimem muda.
 * Placeholders `{chave}` são substituídos em runtime.
 */
export interface TermCopy {
  welcome: string;
  help: string[];
  /** A 1ª linha sai em destaque (branco), as demais em cinza. */
  whoami: string[];
  /** A 1ª linha sai em destaque (branco), as demais em cinza. */
  arch: string[];
  /** A 1ª linha sai em destaque (branco), as demais em cinza. */
  langs: string[];
  ghLoading: string;
  /** Usa {repos}, {followers} e {stars}. */
  ghStats: string;
  contactBase: string;
  /** Usa {lang}. Sai no idioma NOVO, recém-escolhido. */
  langOk: string;
  langUsage: string;
  sudoOk: string;
  sudoNo: string;
  coffee: string;
  ls: string;
  /** Usa {cmd}. */
  notFound: string;
}

export interface Experience {
  title: LocalizedText;
  /** Nome próprio — igual em todos os idiomas. */
  company: string;
  period: Period;
  mode: LocalizedText;
  bullets: Localized;
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

/** Texto curto (uma string) escrito nos 4 idiomas — mesma regra de `Localized`. */
export type LocalizedText = Record<Lang, string>;

/**
 * Texto que pode ser nome próprio (igual em todo idioma, `string`) ou traduzível
 * (`LocalizedText`). Só para nomes — nome de tecnologia, título de certificado.
 * Prosa é sempre `LocalizedText`/`Localized`. Resolver com `tx()` (src/lib/i18n.ts).
 */
export type Text = string | LocalizedText;

/** Mês no formato "AAAA-MM"; o rótulo por idioma sai de `formatMonth()` (src/lib/i18n.ts). */
export type YearMonth = `${number}-${number}`;

/** Intervalo de datas; sem `end` significa "atual". */
export interface Period {
  start: YearMonth;
  end?: YearMonth;
}

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
  /**
   * Resultado em destaque (número grande + legenda), no topo do card do
   * carrossel e ao lado do nome no índice. SÓ com dado real que o autor
   * confirma — projeto sem resultado mensurável fica sem `impact`, não
   * ganha um número inventado.
   */
  impact?: { value: Text; label: LocalizedText };
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
  date: YearMonth;
  title: Text;
  institution: string;
  hours: number;
  url: string;
}

export interface Education {
  period: Period;
  course: LocalizedText;
  institution: string;
  grade: LocalizedText;
  desc: LocalizedText;
}

export interface StackItem {
  name: Text;
  img?: string;
}

export interface StackGroup {
  label: LocalizedText;
  items: StackItem[];
}

export interface Principle {
  icon: string;
  title: LocalizedText;
  desc: LocalizedText;
}

/**
 * Entrega de plataforma da seção "sistemas em produção" (src/data/systems.ts).
 *
 * Todo texto nos 4 idiomas, como o resto do conteúdo do site.
 *
 * `problem`/`built`/`result` aceitam `**termo**` para destaque (src/lib/richText.ts) —
 * até dois por parágrafo, no resultado ou na decisão, nunca na frase inteira.
 */
export interface SystemCase {
  /** Rótulo curto de domínio, ex.: "plataforma · motor de aprovações". */
  domain: LocalizedText;
  title: LocalizedText;
  /** O que existia antes — sem isso o card vira lista de features. */
  problem: LocalizedText;
  /** O que foi construído e por quê. */
  built: LocalizedText;
  /** Uma linha: o que mudou. */
  result: LocalizedText;
  /** Leitura rápida: número de destaque (só fato já dito no texto) + antes/depois curtos. */
  stat: { value: string; label: LocalizedText };
  before: LocalizedText;
  after: LocalizedText;
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
