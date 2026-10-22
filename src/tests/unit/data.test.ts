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
    LANGS.forEach((lang) => expect(privacyPolicy[lang].sections.length).toBeGreaterThan(0));
  });

  // Todo campo `Record<Lang, …>` do conteúdo: o compilador garante que as 4
  // chaves existem, mas não que estão preenchidas — nem que a tradução não é
  // o português colado. Este teste varre as coleções inteiras atrás disso.
  it("todo texto localizado está preenchido nos 4 idiomas", () => {
    const isLocalized = (v: unknown): v is Record<Lang, string | string[]> =>
      !!v && typeof v === "object" && !Array.isArray(v) &&
      Object.keys(v).sort().join() === [...LANGS].sort().join();

    const found: string[] = [];
    const walk = (v: unknown, where: string) => {
      if (isLocalized(v)) {
        found.push(where);
        LANGS.forEach((lang) => {
          const val = v[lang];
          const items = Array.isArray(val) ? val : [val];
          expect(items.length, `${where} [${lang}] vazio`).toBeGreaterThan(0);
          items.forEach((s) => expect(s.trim(), `${where} [${lang}] vazio`).toBeTruthy());
          // lista traduzida precisa ter os mesmos itens, na mesma ordem
          if (Array.isArray(val)) {
            expect(val.length, `${where} [${lang}] com nº de itens diferente do pt`).toBe(
              (v.pt as string[]).length,
            );
          }
        });
        return;
      }
      if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${where}[${i}]`));
      else if (v && typeof v === "object") Object.entries(v).forEach(([k, x]) => walk(x, `${where}.${k}`));
    };
    walk({ experiences, systems, principles, educations, certifications, stackGroups, site }, "data");
    expect(found.length).toBeGreaterThan(50);
  });

  it("prosa traduzida não é cópia do português", () => {
    const prose: [string, Record<Lang, string | string[]>][] = [
      ...experiences.map((e) => [`${e.company} bullets`, e.bullets] as [string, Record<Lang, string[]>]),
      ...systems.flatMap((s) =>
        [s.problem, s.built, s.result].map((p) => [s.title.pt, p] as [string, Record<Lang, string>]),
      ),
      ...principles.map((p) => [p.title.pt, p.desc] as [string, Record<Lang, string>]),
      ...educations.map((e) => [e.course.pt, e.desc] as [string, Record<Lang, string>]),
    ];
    prose.forEach(([where, text]) =>
      LANGS.filter((l) => l !== "pt").forEach((lang) => {
        expect(text[lang], `${where}: ${lang} é cópia do pt`).not.toEqual(text.pt);
      }),
    );
    LANGS.filter((l) => l !== "pt").forEach((lang) => {
      expect(privacyPolicy[lang].intro, `privacidade: ${lang} é cópia do pt`).not.toBe(privacyPolicy.pt.intro);
      expect(privacyPolicy[lang].sections).toHaveLength(privacyPolicy.pt.sections.length);
    });
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
      LANGS.forEach((lang) => {
        expect(e.bullets[lang].length).toBeGreaterThan(0);
        e.bullets[lang].forEach((b) => {
          expect(
            (b.match(/\*\*/g) ?? []).length % 2,
            `${e.company} [${lang}]: destaque ** sem fechamento`,
          ).toBe(0);
        });
      });
      expect(e.tech.length).toBeGreaterThan(0);
    });
  });

  // Regra editorial de experiences.ts/systems.ts: destaque é escasso por
  // design. Sem esse limite o negrito volta a cobrir metade da frase e
  // deixa de destacar qualquer coisa.
  it("nenhum texto usa mais de dois destaques", () => {
    const marks = (s: string) => (s.match(/\*\*/g) ?? []).length / 2;
    LANGS.forEach((lang) => {
      experiences.forEach((e) =>
        e.bullets[lang].forEach((b) =>
          expect(marks(b), `${e.company} [${lang}]: bullet com destaque demais — "${b.slice(0, 48)}…"`)
            .toBeLessThanOrEqual(2),
        ),
      );
      systems.forEach((s) =>
        [s.problem, s.built, s.result].forEach((p) =>
          expect(marks(p[lang]), `${s.title.pt} [${lang}]: parágrafo com destaque demais`).toBeLessThanOrEqual(2),
        ),
      );
    });
  });

  it("sistemas em produção têm problema, solução, resultado e stack", () => {
    expect(systems.length).toBeGreaterThan(0);
    systems.forEach((s) => {
      LANGS.forEach((lang) => {
        expect(s.domain[lang].trim(), `${s.title.pt} [${lang}] sem domínio`).toBeTruthy();
        [s.problem, s.built, s.result].forEach((p) => {
          expect(p[lang].trim(), `${s.title.pt} [${lang}] com campo vazio`).toBeTruthy();
          expect(
            (p[lang].match(/\*\*/g) ?? []).length % 2,
            `${s.title.pt} [${lang}]: destaque ** sem fechamento`,
          ).toBe(0);
        });
      });
      expect(s.tech.length, `${s.title.pt} sem stack`).toBeGreaterThan(0);
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
