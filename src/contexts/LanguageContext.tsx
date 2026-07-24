"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { translations } from "@/data";
import type { Lang, Translation } from "@/types";

export const LANGS: Lang[] = ["pt", "en", "es", "fr"];

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translation;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "pt",
  setLang: () => {},
  t: translations.pt,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt");

  useEffect(() => {
    const saved = localStorage.getItem("ldp-lang") as Lang | null;
    if (saved && LANGS.includes(saved)) setLangState(saved);
  }, []);

  const setLang = useCallback((next: Lang) => {
    localStorage.setItem("ldp-lang", next);
    setLangState(next);
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
