"use client";

import { useState } from "react";
import { useLanguage, LANGS } from "@/contexts/LanguageContext";
import { site } from "@/data";
import { TERMINAL_OPEN_EVENT } from "./Terminal";
import { useActiveSection } from "@/lib/useActiveSection";

export function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);

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
            onClick={() => window.dispatchEvent(new CustomEvent(TERMINAL_OPEN_EVENT))}
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
        </div>
      )}
    </nav>
  );
}
