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
  site,
  systems,
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
    expect(privacyPolicy.sections.length).toBeGreaterThan(0);
  });

  it("projetos têm categoria válida e campos obrigatórios", () => {
    projects.forEach((p) => {
      expect(["Sistemas", "Sites"]).toContain(p.cat);
      expect(p.name).toBeTruthy();
      expect(p.tech.length).toBeGreaterThan(0);
    });
  });

  it("descrições de projeto existem nos 4 idiomas", () => {
    projects.forEach((p) => {
      LANGS.forEach((lang) => {
        const lines = p.desc[lang];
        expect(lines.length, `${p.name} sem descrição em ${lang}`).toBeGreaterThan(0);
        lines.forEach((line) => {
          expect(line.trim(), `${p.name} [${lang}] tem linha vazia`).toBeTruthy();
          expect(
            (line.match(/\*\*/g) ?? []).length % 2,
            `${p.name} [${lang}]: destaque ** sem fechamento`,
          ).toBe(0);
        });
      });
      // tradução esquecida costuma aparecer como cópia literal do pt
      LANGS.filter((l) => l !== "pt").forEach((lang) => {
        expect(p.desc[lang], `${p.name}: ${lang} é cópia do pt`).not.toEqual(p.desc.pt);
      });
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
      e.bullets.forEach((b) => {
        expect(
          (b.match(/\*\*/g) ?? []).length % 2,
          `${e.company}: destaque ** sem fechamento`,
        ).toBe(0);
      });
      expect(e.tech.length).toBeGreaterThan(0);
    });
  });

  // Regra editorial de experiences.ts/systems.ts: destaque é escasso por
  // design. Sem esse limite o negrito volta a cobrir metade da frase e
  // deixa de destacar qualquer coisa.
  it("nenhum texto usa mais de dois destaques", () => {
    const marks = (s: string) => (s.match(/\*\*/g) ?? []).length / 2;
    experiences.forEach((e) =>
      e.bullets.forEach((b) =>
        expect(marks(b), `${e.company}: bullet com destaque demais — "${b.slice(0, 48)}…"`)
          .toBeLessThanOrEqual(2),
      ),
    );
    systems.forEach((s) =>
      [s.problem, s.built, s.result].forEach((p) =>
        expect(marks(p), `${s.title}: parágrafo com destaque demais`).toBeLessThanOrEqual(2),
      ),
    );
  });

  it("sistemas em produção têm problema, solução, resultado e stack", () => {
    expect(systems.length).toBeGreaterThan(0);
    systems.forEach((s) => {
      expect(s.domain.trim(), `${s.title} sem domínio`).toBeTruthy();
      [s.problem, s.built, s.result].forEach((p) => {
        expect(p.trim(), `${s.title} com campo vazio`).toBeTruthy();
        expect(
          (p.match(/\*\*/g) ?? []).length % 2,
          `${s.title}: destaque ** sem fechamento`,
        ).toBe(0);
      });
      expect(s.tech.length, `${s.title} sem stack`).toBeGreaterThan(0);
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
