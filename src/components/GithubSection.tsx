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
    <section id="github" className="mx-auto max-w-[1000px] px-8 pb-10 pt-[100px]">
      <p className="mb-2 font-mono text-sm text-accent">05 — {t.ghTitle}</p>
      <p className="mb-8 text-base text-muted">{t.ghDesc}</p>
      {gh && (
        <>
          <div className="mb-7 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-bord bg-card p-5 text-center">
                <div className="font-mono text-[30px] font-bold text-accent">{s.value}</div>
                <div className="mt-[5px] text-[12.5px] text-muted">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-bord bg-card p-6">
            <p className="mb-4 font-mono text-[13px] text-muted">{t.ghLangs}</p>
            <div className="flex flex-col gap-3">
              {gh.langs.map((gl) => (
                <div key={gl.name} className="grid grid-cols-[120px_1fr_46px] items-center gap-3">
                  <span className="font-mono text-[12.5px]">{gl.name}</span>
                  <div className="h-2 overflow-hidden rounded bg-bg2">
                    <div
                      className="h-full rounded bg-accent transition-[width] duration-1000 ease-out"
                      style={{ width: `${gl.pct}%` }}
                    />
                  </div>
                  <span className="text-right font-mono text-[11.5px] text-muted">{gl.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {!gh && !err && (
        <p className="font-mono text-[13.5px] text-muted">
          $ fetch api.github.com/users/{site.githubUser}{" "}
          <span className="animate-[blink_1s_infinite]">▊</span>
        </p>
      )}
      <p className="mt-5 font-mono text-[13px]">
        <a href={site.githubUrl} target="_blank" rel="noreferrer">
          ↗ github.com/{site.githubUser}
        </a>
      </p>
    </section>
  );
}
