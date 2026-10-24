"use client";

import { useEffect, useState } from "react";
import { useLanguage, LANGS } from "@/contexts/LanguageContext";
import { site } from "@/data/site";
import { TERMINAL_OPEN_EVENT } from "@/lib/events";
import { installAnchorNav } from "@/lib/nav";
import { useActiveSection } from "@/lib/useActiveSection";

export function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  // salto de âncora exato apesar do content-visibility das seções (lib/nav.ts)
  useEffect(() => installAnchorNav(), []);

  const navLinks = [
    { label: t.navStack, href: "#stack" },
    { label: t.navExp, href: "#experiencia" },
    { label: t.navSys, href: "#sistemas" },
    { label: t.navProj, href: "#projetos" },
    { label: "GitHub", href: "#github" },
    { label: t.navEdu, href: "#educacao" },
    { label: t.navContact, href: "#contato" },
  ];
  // link da seção atual fica aceso (seções sem link, como o case, mantêm o anterior)
  const active = useActiveSection(navLinks.map((nl) => nl.href.slice(1)));

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-bord bg-navbg backdrop-blur-[12px]">
      <div className="flex items-center justify-between gap-4 px-8 py-3.5 max-nav:px-5">
        <a href="#top" className="font-mono text-base font-bold text-accent hover:text-accent">
          {site.logo}
        </a>
        <div className="hidden items-center gap-[26px] nav:flex">
          {navLinks.map((nl) => (
            <a
              key={nl.href}
              href={nl.href}
              aria-current={active === nl.href.slice(1) ? "location" : undefined}
              className={`relative py-1 text-[15px] font-medium transition-colors duration-300 hover:text-accent ${
                active === nl.href.slice(1) ? "text-txt" : "text-muted"
              }`}
            >
              {nl.label}
              <span
                aria-hidden
                className={`absolute right-0 -bottom-[3px] left-0 h-[2px] origin-left bg-accent transition-transform duration-300 ${
                  active === nl.href.slice(1) ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2.5">
          {/* contato direto a um clique, sem texto: só os dois ícones */}
          <div className="hidden items-center gap-1 sm:flex">
            <a
              href={site.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              title="LinkedIn"
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:text-accent"
            >
              <svg aria-hidden viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="currentColor">
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
              </svg>
            </a>
            <a
              href={site.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              title="GitHub"
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:text-accent"
            >
              <svg aria-hidden viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor">
                <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3z" />
              </svg>
            </a>
          </div>
          <div className="flex gap-0.5 rounded-md border border-bord p-0.5 font-mono">
            {LANGS.map((code) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`cursor-pointer rounded border-none px-2 py-1 text-[11px] ${
                  lang === code
                    ? "bg-accent font-bold text-bg"
                    : "bg-transparent text-muted"
                }`}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              document.documentElement.dataset.openTerminal = "1";
              window.dispatchEvent(new CustomEvent(TERMINAL_OPEN_EVENT));
            }}
            className="hidden cursor-pointer rounded-md border border-bord bg-transparent px-[13px] py-[7px] font-mono text-[10.5px] tracking-[.14em] text-txt uppercase hover:border-accent hover:text-accent nav:inline-block"
          >
            _shell
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            className="cursor-pointer rounded-md border border-bord bg-transparent px-2.5 py-[5px] text-[15px] text-txt hover:border-accent nav:hidden"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>
      {open && (
        <div className="flex flex-col gap-1 border-t border-bord bg-navbg px-5 pb-4 pt-2 backdrop-blur-[12px] nav:hidden">
          {navLinks.map((nl) => (
            <a
              key={nl.href}
              href={nl.href}
              onClick={() => setOpen(false)}
              aria-current={active === nl.href.slice(1) ? "location" : undefined}
              className={`rounded-md border-l-2 px-2 py-2 text-[15px] font-medium hover:text-accent ${
                active === nl.href.slice(1) ? "border-accent text-txt" : "border-transparent text-muted"
              }`}
            >
              {nl.label}
            </a>
          ))}
          <div className="mt-2 flex gap-4 border-t border-bord px-2 pt-3 font-mono text-[11px] tracking-[.14em] uppercase sm:hidden">
            <a href={site.linkedinUrl} target="_blank" rel="noreferrer" className="text-accent">
              LinkedIn ↗
            </a>
            <a href={site.githubUrl} target="_blank" rel="noreferrer" className="text-accent">
              GitHub ↗
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
