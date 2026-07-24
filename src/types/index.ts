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
