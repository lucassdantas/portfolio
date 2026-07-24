import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  translations,
  experiences,
  projects,
  certifications,
  educations,
  stackGroups,
  principles,
  books,
  marquee,
  site,
  privacyPolicy,
} from "@/data";
import type { Lang } from "@/types";

const LANGS: Lang[] = ["pt", "en", "es", "fr"];
const publicDir = path.resolve(__dirname, "../../../public");

describe("camada de dados", () => {
  it("tem tradução completa para os 4 idiomas", () => {
    const ptKeys = Object.keys(translations.pt).sort();
    LANGS.forEach((lang) => {
      expect(Object.keys(translations[lang]).sort()).toEqual(ptKeys);
      expect(translations[lang].langs).toHaveLength(4);
    });
  });

  it("todas as coleções têm conteúdo", () => {
    expect(experiences.length).toBeGreaterThan(0);
    expect(projects.length).toBeGreaterThan(0);
    expect(certifications.length).toBeGreaterThan(0);
    expect(educations.length).toBeGreaterThan(0);
    expect(stackGroups.length).toBeGreaterThan(0);
    expect(principles).toHaveLength(4);
    expect(books.length).toBeGreaterThan(0);
    expect(marquee.length).toBeGreaterThan(0);
    expect(privacyPolicy.sections.length).toBeGreaterThan(0);
  });

  it("projetos têm categoria válida e campos obrigatórios", () => {
    projects.forEach((p) => {
      expect(["Sistemas", "Sites"]).toContain(p.cat);
      expect(p.name).toBeTruthy();
      expect(p.desc).toBeTruthy();
      expect(p.tech.length).toBeGreaterThan(0);
    });
  });

  it("imagens referenciadas nos dados existem em public/", () => {
    const imgs = [
      site.heroImage,
      ...projects.map((p) => p.img),
      ...stackGroups.flatMap((g) => g.items.map((i) => i.img)).filter(Boolean),
    ] as string[];
    imgs.forEach((img) => {
      expect(fs.existsSync(path.join(publicDir, img)), `faltando: ${img}`).toBe(true);
    });
  });

  it("experiências têm bullets e tecnologias", () => {
    experiences.forEach((e) => {
      expect(e.bullets.length).toBeGreaterThan(0);
      expect(e.tech.length).toBeGreaterThan(0);
    });
  });

  it("urls externas usam https", () => {
    const urls = [
      site.githubUrl,
      site.linkedinUrl,
      ...projects.flatMap((p) => [p.live, p.repo]),
      ...certifications.map((c) => c.url),
    ].filter(Boolean);
    urls.forEach((u) => expect(u).toMatch(/^https:\/\//));
  });
});
