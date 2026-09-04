"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage, LANGS } from "@/contexts/LanguageContext";
import { experiences, projects, stackGroups, books } from "@/data";
import { fetchGithubStats, type GithubStats } from "@/lib/github";
import { stripMarks } from "@/lib/richText";
import type { Lang } from "@/types";

interface TermLine {
  text: string;
  color: string;
}

const GRAY = "#8A857D";
const WHITE = "#EDEAE5";
const GREEN = "#22C55E";
const RED = "#C05B4D";
const BLUE = "#1D94E3";
const WARM = "#D7A45A";

const out = (text: string, color: string = GRAY): TermLine => ({ text, color });

/** Evento global que a Navbar dispara no botão `_shell` para abrir o terminal em tela cheia. */
export const TERMINAL_OPEN_EVENT = "ld:terminal-open";

export function Terminal() {
  const { t, lang, setLang } = useLanguage();
  const [lines, setLines] = useState<TermLine[]>([
    out("██ lucas.dantas — portfolio v3.0", BLUE),
    out("Digite 'help' para ver os comandos disponíveis.", GRAY),
  ]);
  const [fullscreen, setFullscreen] = useState(false);
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

  useEffect(() => {
    const open = () => {
      setFullscreen(true);
      requestAnimationFrame(() => inputRef.current?.focus());
    };
    window.addEventListener(TERMINAL_OPEN_EVENT, open);
    return () => window.removeEventListener(TERMINAL_OPEN_EVENT, open);
  }, []);

  useEffect(() => {
    if (!fullscreen) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [fullscreen]);

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
          out("Ex.: chatbot re-arquitetado → cerca de 90% menos tokens por fluxo 💸"),
        ];
        break;
      case "exp":
        res = experiences.flatMap((e) => [
          out(`${e.period} · ${e.title} @ ${e.company}`, WHITE),
          ...e.bullets.slice(0, 3).map((b) => out("  · " + stripMarks(b))),
        ]);
        break;
      case "projects":
        res = projects.map((p) =>
          out(`${p.name} [${p.cat}] — ${p.desc[lang].map(stripMarks).join(" ")}`),
        );
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
        res = [out("☕ compilando cafeína... pronto.", WARM)];
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

  const shell = (
    <div className="border border-bord bg-[#070605]">
      <div className="flex items-center gap-2 border-b border-bord bg-bg2 px-4 py-[11px]">
        <span className="h-[9px] w-[9px] rounded-full bg-[#3A342E]" />
        <span className="h-[9px] w-[9px] rounded-full bg-[#3A342E]" />
        <span className="h-[9px] w-[9px] rounded-full bg-[#3A342E]" />
        <span className="ml-2 font-mono text-[10.5px] tracking-[.14em] text-dim">lucas@portfolio: ~</span>
        <button
          onClick={() => setFullscreen((f) => !f)}
          className="ml-auto cursor-pointer rounded-[2px] border border-bord bg-transparent px-[9px] py-1 font-mono text-[9.5px] tracking-[.16em] text-dim uppercase hover:text-txt"
        >
          {fullscreen ? "esc" : "fullscreen"}
        </button>
      </div>
      <div
        ref={bodyRef}
        onClick={() => inputRef.current?.focus()}
        className={`cursor-text overflow-y-auto p-[18px] font-mono text-[13px] leading-[1.75] ${
          fullscreen ? "flex-1" : "h-[clamp(300px,48vh,460px)]"
        }`}
      >
        {lines.map((tl, i) => (
          <div key={i} className="whitespace-pre-wrap break-words" style={{ color: tl.color }}>
            {tl.text}
          </div>
        ))}
        <div className="flex items-baseline gap-2">
          <span className="text-ok">lucas@portfolio</span>
          <span className="text-dim">:~$</span>
          <input
            ref={inputRef}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            aria-label="terminal"
            className="flex-1 min-w-0 border-none bg-transparent font-mono text-[13px] text-txt caret-accent outline-none"
          />
        </div>
      </div>
    </div>
  );

  return (
    <section id="terminal" data-stg="3.6" className="border-t border-bord px-5 py-[clamp(70px,13vh,150px)] sm:px-8">
      <div className="mb-[clamp(24px,4vh,48px)] flex flex-wrap items-baseline justify-between gap-6">
        <p className="m-0 font-mono text-[11px] tracking-[.2em] text-dim uppercase">
          07 — {t.termTitle}
        </p>
        <p className="m-0 max-w-[46ch] text-sm leading-[1.55] text-muted">{t.termDesc}</p>
      </div>
      {shell}
      {fullscreen && (
        <div className="fixed inset-0 z-[180] flex flex-col bg-[#070605]/97 p-[clamp(16px,4vw,52px)] backdrop-blur-[6px]">
          <div className="mb-4 flex items-center justify-between font-mono text-[10.5px] tracking-[.18em] text-dim uppercase">
            <span>lucas@portfolio — shell</span>
          </div>
          <div className="flex min-h-0 flex-1 flex-col">{shell}</div>
        </div>
      )}
    </section>
  );
}
