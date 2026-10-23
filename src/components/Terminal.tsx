"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage, LANGS } from "@/contexts/LanguageContext";
import { experiences, projects, stackGroups, books, translations } from "@/data";
import { fetchGithubStats, type GithubStats } from "@/lib/github";
import { formatPeriod, tx } from "@/lib/i18n";
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

/** Troca "{chave}" pelos valores de `vars` (textos de `t.term`). */
const fill = (text: string, vars: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));

/** Evento global que a Navbar dispara no botão `_shell` para abrir o terminal em tela cheia. */
export const TERMINAL_OPEN_EVENT = "ld:terminal-open";

export function Terminal() {
  const { t, lang, setLang } = useLanguage();
  const [lines, setLines] = useState<TermLine[]>([]);
  // A saudação é derivada de `t` (não fica em `lines`) para trocar junto com
  // o idioma; `clear` a esconde de vez.
  const [cleared, setCleared] = useState(false);
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
      setCleared(true);
      return;
    }
    const tc = t.term;
    // 1ª linha em destaque, demais em cinza
    const block = (rows: string[]) => rows.map((r, i) => out(r, i === 0 ? WHITE : GRAY));
    let res: TermLine[];
    switch (c) {
      case "help":
        res = tc.help.map((r) => out(r));
        break;
      case "whoami":
        res = block(tc.whoami);
        break;
      case "stack":
        res = stackGroups.map((g) =>
          out(g.label[lang].padEnd(24, " ") + "→ " + g.items.map((x) => tx(x.name, lang)).join(", "))
        );
        break;
      case "arch":
        res = block(tc.arch);
        break;
      case "exp":
        res = experiences.flatMap((e) => [
          out(`${formatPeriod(e.period, lang)} · ${e.title[lang]} @ ${e.company}`, WHITE),
          ...e.bullets[lang].slice(0, 3).map((b) => out("  · " + stripMarks(b))),
        ]);
        break;
      case "projects":
        res = projects.map((p) =>
          out(`${p.name} [${p.cat === "Sistemas" ? t.catSys : t.catSite}] — ${p.desc[lang].map(stripMarks).join(" ")}`),
        );
        break;
      case "langs":
        res = block(tc.langs);
        break;
      case "github":
        res = [
          out("github.com/lucassdantas", BLUE),
          out(
            gh.current
              ? fill(tc.ghStats, { repos: gh.current.repos, followers: gh.current.followers, stars: gh.current.stars })
              : tc.ghLoading
          ),
        ];
        break;
      case "contact":
        res = [
          out("LinkedIn: linkedin.com/in/lucas-de-sousa-dantas", BLUE),
          out("GitHub:   github.com/lucassdantas", BLUE),
          out(tc.contactBase),
        ];
        break;
      case "lang":
        if (LANGS.includes(arg as Lang)) {
          setLang(arg as Lang);
          // confirma já no idioma escolhido
          res = [out(fill(translations[arg as Lang].term.langOk, { lang: arg }), GREEN)];
        } else {
          res = [out(tc.langUsage, RED)];
        }
        break;
      case "sudo":
        res = [out(arg === "hire-me" ? tc.sudoOk : tc.sudoNo, GREEN)];
        break;
      case "books":
        res = books.map((b) => out(`📖 ${b.title} — ${b.author}`));
        break;
      case "coffee":
        res = [out(tc.coffee, WARM)];
        break;
      case "ls":
        res = [out(tc.ls)];
        break;
      default:
        res = [out(fill(tc.notFound, { cmd: c }), RED)];
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
    <div className="border border-bord bg-[#070605]/92 backdrop-blur-[2px]">
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
        {[
          ...(cleared ? [] : [out("██ lucas.dantas — portfolio v3.0", BLUE), out(t.term.welcome)]),
          ...lines,
        ].map((tl, i) => (
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
          08 — {t.termTitle}
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
