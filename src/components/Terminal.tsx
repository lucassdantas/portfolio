"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage, LANGS } from "@/contexts/LanguageContext";
import { experiences, projects, stackGroups, books } from "@/data";
import { fetchGithubStats, type GithubStats } from "@/lib/github";
import type { Lang } from "@/types";

interface TermLine {
  text: string;
  color: string;
}

const GRAY = "#8C98AB";
const WHITE = "#E2E8F0";
const GREEN = "#22C55E";
const RED = "#FF5F57";
const BLUE = "#1D94E3";
const YELLOW = "#FEBC2E";

const out = (text: string, color: string = GRAY): TermLine => ({ text, color });

export function Terminal() {
  const { t } = useLanguage();
  const { toggleTheme } = useTheme();
  const { setLang } = useLanguage();
  const [lines, setLines] = useState<TermLine[]>([
    out("██ lucas.dantas — portfolio v2.0", BLUE),
    out("Digite 'help' para ver os comandos disponíveis.", GRAY),
  ]);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const history = useRef<string[]>([]);
  const histIdx = useRef(0);
  const gh = useRef<GithubStats | null>(null);

  useEffect(() => {
    fetchGithubStats()
      .then((s) => {
        gh.current = s;
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const runCmd = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    const [c, arg] = cmd.split(/\s+/);
    const echo = out("lucas@portfolio:~$ " + raw, WHITE);
    if (!cmd) return;
    if (c === "clear") {
      setLines([]);
      return;
    }
    let res: TermLine[];
    switch (c) {
      case "help":
        res = [
          out("help        — lista de comandos"),
          out("whoami      — quem sou eu"),
          out("stack       — tecnologias"),
          out("arch        — arquitetura & práticas"),
          out("exp         — experiência profissional"),
          out("projects    — projetos"),
          out("langs       — idiomas"),
          out("github      — perfil no GitHub"),
          out("contact     — contato"),
          out("theme       — alterna dark/light"),
          out("lang [pt|en|es|fr] — muda o idioma"),
          out("clear       — limpa o terminal"),
          out("books       — estante do dev"),
          out("sudo hire-me — ...tente"),
        ];
        break;
      case "whoami":
        res = [
          out("Lucas Dantas — Desenvolvedor Full Stack, Rio de Janeiro/BR.", WHITE),
          out("4+ anos entregando web apps, APIs, automações e sistemas críticos de saúde."),
          out("Foco: arquitetura limpa, redução de custo e automação com IA."),
        ];
        break;
      case "stack":
        res = stackGroups.map((g) =>
          out(g.label.padEnd(24, " ") + "→ " + g.items.map((x) => x.name).join(", "))
        );
        break;
      case "arch":
        res = [
          out("System Design · Clean Architecture · SOLID · Design Patterns", WHITE),
          out("Filas & mensageria, MCPs, APIs REST bem versionadas"),
          out("Testes: unitários, integração e regressão · CI/CD no GitHub"),
          out("Ex.: chatbot re-arquitetado → tokens de ~10k para 2–4k por fluxo 💸"),
        ];
        break;
      case "exp":
        res = experiences.flatMap((e) => [
          out(`${e.period} · ${e.title} @ ${e.company}`, WHITE),
          ...e.bullets.slice(0, 3).map((b) => out("  · " + b)),
        ]);
        break;
      case "projects":
        res = projects.map((p) => out(`${p.name} [${p.cat}] — ${p.desc}`));
        break;
      case "langs":
        res = [
          out("Português — Nativo", WHITE),
          out("Inglês — C1 (cliente gringo aprova ✔)"),
          out("Espanhol — B1"),
          out("Francês — A1"),
        ];
        break;
      case "github":
        res = [
          out("github.com/lucassdantas", BLUE),
          out(
            gh.current
              ? `${gh.current.repos} repos · ${gh.current.followers} followers · ${gh.current.stars} stars`
              : "stats carregando..."
          ),
        ];
        break;
      case "contact":
        res = [
          out("LinkedIn: linkedin.com/in/lucas-de-sousa-dantas", BLUE),
          out("GitHub:   github.com/lucassdantas", BLUE),
          out("Base:     Rio de Janeiro, Brasil (remoto 🌎)"),
        ];
        break;
      case "theme":
        toggleTheme();
        res = [out("tema alterado ✔", GREEN)];
        break;
      case "lang":
        if (LANGS.includes(arg as Lang)) {
          setLang(arg as Lang);
          res = [out("idioma: " + arg + " ✔", GREEN)];
        } else {
          res = [out("uso: lang pt|en|es|fr", RED)];
        }
        break;
      case "sudo":
        res = [
          out(
            arg === "hire-me"
              ? "Permissão concedida. Iniciando onboarding... 🚀 (me chama no LinkedIn)"
              : 'sudo: permissão negada — mas "sudo hire-me" funciona',
            GREEN
          ),
        ];
        break;
      case "books":
        res = books.map((b) => out(`📖 ${b.title} — ${b.author}`));
        break;
      case "coffee":
        res = [out("☕ compilando cafeína... pronto.", YELLOW)];
        break;
      case "ls":
        res = [out("stack/  experiencia/  projetos/  educacao/  contato.md")];
        break;
      default:
        res = [out(`comando não encontrado: ${c}. Digite 'help'.`, RED)];
    }
    setLines((prev) => [...prev, echo, ...res]);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    if (e.key === "Enter") {
      const v = target.value;
      target.value = "";
      history.current.push(v);
      histIdx.current = history.current.length;
      runCmd(v);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (histIdx.current > 0) {
        histIdx.current--;
        target.value = history.current[histIdx.current] || "";
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      histIdx.current = Math.min(histIdx.current + 1, history.current.length);
      target.value = history.current[histIdx.current] || "";
    }
  };

  return (
    <section id="terminal" className="mx-auto max-w-[1000px] px-8 pb-10 pt-[100px]">
      <p className="mb-2 font-mono text-sm text-accent">01 — {t.termTitle}</p>
      <p className="mb-6 text-base text-muted">{t.termDesc}</p>
      <div className="overflow-hidden rounded-xl border border-[#16233A] bg-[#060D18] shadow-[0_20px_60px_rgba(0,0,0,.4)]">
        <div className="flex items-center gap-2 border-b border-[#16233A] bg-[#0B1524] px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
          <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
          <span className="h-3 w-3 rounded-full bg-[#28C840]" />
          <span className="ml-3 font-mono text-xs text-[#8C98AB]">lucas@portfolio: ~</span>
        </div>
        <div
          ref={bodyRef}
          onClick={() => inputRef.current?.focus()}
          className="h-[340px] cursor-text overflow-y-auto p-[18px] font-mono text-[13.5px] leading-[1.7]"
        >
          {lines.map((tl, i) => (
            <div key={i} className="whitespace-pre-wrap break-words" style={{ color: tl.color }}>
              {tl.text}
            </div>
          ))}
          <div className="flex items-baseline gap-2">
            <span className="text-[#22C55E]">lucas@portfolio</span>
            <span className="text-[#8C98AB]">:~$</span>
            <input
              ref={inputRef}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoComplete="off"
              className="flex-1 border-none bg-transparent font-mono text-[13.5px] text-[#E2E8F0] caret-[#1D94E3] outline-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
