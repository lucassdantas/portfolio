import { describe, it, expect, vi, beforeEach } from "vitest";

const user = { public_repos: 42, followers: 10, public_gists: 3 };
const repos = [
  { language: "TypeScript", stargazers_count: 5 },
  { language: "TypeScript", stargazers_count: 2 },
  { language: "PHP", stargazers_count: 1 },
  { language: null, stargazers_count: 0 },
];

function mockFetchOk() {
  vi.stubGlobal(
    "fetch",
    vi.fn((url: string) =>
      Promise.resolve({
        json: () => Promise.resolve(String(url).includes("/repos") ? repos : user),
      })
    )
  );
}

describe("fetchGithubStats", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("agrega repos, stars, gists e linguagens", async () => {
    mockFetchOk();
    const { fetchGithubStats } = await import("@/lib/github");
    const stats = await fetchGithubStats();
    expect(stats.repos).toBe(42);
    expect(stats.followers).toBe(10);
    expect(stats.stars).toBe(8);
    expect(stats.gists).toBe(3);
    expect(stats.langs[0]).toEqual({ name: "TypeScript", pct: 67 });
    expect(stats.langs[1]).toEqual({ name: "PHP", pct: 33 });
  });

  it("usa cache: múltiplas chamadas fazem um único fetch", async () => {
    mockFetchOk();
    const { fetchGithubStats } = await import("@/lib/github");
    await fetchGithubStats();
    await fetchGithubStats();
    expect(vi.mocked(fetch).mock.calls).toHaveLength(2); // user + repos, uma vez só
  });

  it("rejeita quando a API falha e permite nova tentativa", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("rate limit"))));
    const { fetchGithubStats } = await import("@/lib/github");
    await expect(fetchGithubStats()).rejects.toThrow();
  });
});
