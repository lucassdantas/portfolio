"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { site } from "@/data/site";
import dynamic from "next/dynamic";

// o modal (e o texto da política) só carregam ao clicar
const PrivacyModal = dynamic(() => import("./PrivacyModal").then((m) => m.PrivacyModal), { ssr: false });

export function Footer() {
  const { t } = useLanguage();
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <footer className="flex flex-wrap items-center justify-between gap-3.5 border-t border-bord px-5 py-[26px] font-mono text-[11px] tracking-[.06em] text-dim sm:px-8">
      <span>© 2026 Lucas Dantas — {t.footer}</span>
      <span className="flex flex-wrap items-center gap-4.5">
        <button
          onClick={() => setShowPrivacy(true)}
          className="cursor-pointer border-none bg-transparent p-0 font-mono text-[11px] tracking-[.06em] text-accent"
        >
          {t.privacy}
        </button>
        <span>
          code:{" "}
          <a href={site.githubUrl} target="_blank" rel="noreferrer">
            github.com/{site.githubUser}
          </a>
        </span>
      </span>
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
    </footer>
  );
}
