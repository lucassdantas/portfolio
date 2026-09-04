"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { site } from "@/data";
import { fetchGithubStats, type GithubStats } from "@/lib/github";

export function GithubSection() {
  const { t } = useLanguage();
  const [gh, setGh] = useState<GithubStats | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    fetchGithubStats()
      .then(setGh)
      .catch(() => setErr(true));
  }, []);

  const stats = gh
    ? [
        { value: gh.repos, label: t.ghRepos },
        { value: gh.followers, label: t.ghFollowers },
        { value: gh.stars, label: t.ghStars },
        { value: gh.gists, label: "gists" },
      ]
    : [];

  return (
    <section id="github" data-stg="3.4" className="border-t border-bord px-5 py-[clamp(70px,13vh,150px)] sm:px-8">
      <div className="mb-[clamp(24px,4vh,48px)] flex flex-wrap items-baseline justify-between gap-6">
        <p className="m-0 font-mono text-[11px] tracking-[.2em] text-dim uppercase">
          07 — {t.ghTitle}
        </p>
        <a href={site.githubUrl} target="_blank" rel="noreferrer" className="font-mono text-[11.5px] tracking-[.08em]">
          ↗ github.com/{site.githubUser}
        </a>
      </div>
      <div className="border border-bord bg-bg2 p-[clamp(18px,2.6vw,32px)]">
        {gh && (
          <>
            <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-px border border-bord bg-bord">
              {stats.map((s) => (
                <div key={s.label} className="bg-bg2 px-4 py-5 text-center">
                  <div className="font-mono text-[26px] font-bold text-accent">{s.value}</div>
                  <div className="mt-1.5 font-mono text-[10.5px] tracking-[.1em] text-muted uppercase">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
            <p className="m-0 mb-3.5 font-mono text-[10.5px] tracking-[.16em] text-dim uppercase">
              {t.ghLangs}
            </p>
            <div className="flex flex-col gap-3">
              {gh.langs.map((gl) => (
                <div key={gl.name} className="grid grid-cols-[110px_1fr_44px] items-center gap-3">
                  <span className="font-mono text-[12px] text-muted">{gl.name}</span>
                  <div className="h-px bg-bord">
                    <div
                      className="h-px bg-accent transition-[width] duration-1000 ease-out"
                      style={{ width: `${gl.pct}%` }}
                    />
                  </div>
                  <span className="text-right font-mono text-[11px] text-dim">{gl.pct}%</span>
                </div>
              ))}
            </div>
          </>
        )}
        {!gh && !err && (
          <p className="m-0 font-mono text-[13.5px] leading-[1.9] text-muted">
            $ fetch api.github.com/users/{site.githubUser}{" "}
            <span className="animate-[blink_1s_infinite] text-accent">▊</span>
          </p>
        )}
      </div>
    </section>
  );
}
