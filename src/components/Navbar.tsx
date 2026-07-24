"use client";

import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage, LANGS } from "@/contexts/LanguageContext";
import { site } from "@/data";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { label: t.navStack, href: "#stack" },
    { label: t.navExp, href: "#experiencia" },
    { label: t.navProj, href: "#projetos" },
    { label: "GitHub", href: "#github" },
    { label: t.navEdu, href: "#educacao" },
    { label: t.navContact, href: "#contato" },
  ];

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
              className="text-[15px] font-medium text-muted hover:text-accent"
            >
              {nl.label}
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
                    ? "bg-accent font-bold text-white"
                    : "bg-transparent text-muted"
                }`}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            onClick={toggleTheme}
            title="Tema"
            className="cursor-pointer rounded-md border border-bord bg-transparent px-2.5 py-[5px] text-[15px] text-txt hover:border-accent"
          >
            {theme === "dark" ? "☀" : "☾"}
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
              className="rounded-md px-2 py-2 text-[15px] font-medium text-muted hover:text-accent"
            >
              {nl.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
