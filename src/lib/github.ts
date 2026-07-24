// Fetch cacheado da API do GitHub (compartilhado entre Terminal e seção GitHub)
import { site } from "@/data";

export interface GithubStats {
  repos: number;
  followers: number;
  stars: number;
  gists: number;
  langs: { name: string; pct: number }[];
}

let cached: Promise<GithubStats> | null = null;

export function fetchGithubStats(): Promise<GithubStats> {
  if (!cached) {
    cached = Promise.all([
      fetch(`https://api.github.com/users/${site.githubUser}`).then((r) => r.json()),
      fetch(`https://api.github.com/users/${site.githubUser}/repos?per_page=100`).then((r) => r.json()),
    ]).then(([u, repos]) => {
      if (!u || !u.public_repos || !Array.isArray(repos)) throw new Error("github api error");
      const stars = repos.reduce((s: number, r: { stargazers_count?: number }) => s + (r.stargazers_count || 0), 0);
      const langCount: Record<string, number> = {};
      repos.forEach((r: { language?: string | null }) => {
        if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
      });
      const total = Object.values(langCount).reduce((a, b) => a + b, 0) || 1;
      const langs = Object.entries(langCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, n]) => ({ name, pct: Math.round((n / total) * 100) }));
      return {
        repos: u.public_repos,
        followers: u.followers,
        stars,
        gists: u.public_gists || 0,
        langs,
      };
    });
    cached.catch(() => {
      cached = null;
    });
  }
  return cached;
}
