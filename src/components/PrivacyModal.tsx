"use client";

import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { privacyPolicy } from "@/data";

export function PrivacyModal({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.privacy}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-full max-w-[720px] overflow-y-auto rounded-xl border border-bord bg-card p-7"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">{t.privacy}</h2>
            <p className="mt-1 font-mono text-xs text-muted">
              última atualização: {privacyPolicy.updatedAt}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="cursor-pointer rounded-md border border-bord bg-transparent px-2.5 py-1 text-sm text-txt hover:border-accent"
          >
            ✕
          </button>
        </div>
        <p className="mb-5 text-sm leading-[1.6] text-muted [text-wrap:pretty]">
          {privacyPolicy.intro}
        </p>
        {privacyPolicy.sections.map((sec) => (
          <div key={sec.title} className="mb-5">
            <h3 className="mb-2 font-mono text-sm text-accent">{sec.title}</h3>
            {sec.body.map((p, i) => (
              <p key={i} className="mb-2 text-sm leading-[1.6] text-muted [text-wrap:pretty]">
                {p}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
