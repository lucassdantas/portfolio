import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, render } from "@testing-library/react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

const user = { public_repos: 30, followers: 12, public_gists: 2 };
const repos = [
  { language: "TypeScript", stargazers_count: 4 },
  { language: "PHP", stargazers_count: 1 },
];

describe("GithubSection", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("mostra loading e depois as estatísticas", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) =>
        Promise.resolve({
          json: () => Promise.resolve(String(url).includes("/repos") ? repos : user),
        })
      )
    );
    const { GithubSection } = await import("@/components/GithubSection");
    render(
      <ThemeProvider>
        <LanguageProvider>
          <GithubSection />
        </LanguageProvider>
      </ThemeProvider>
    );
    expect(screen.getByText(/fetch api\.github\.com/)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("30")).toBeInTheDocument());
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getAllByText("50%")).toHaveLength(2);
  });

  it("em erro de API, esconde stats e mantém o link do perfil", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("rate limit"))));
    const { GithubSection } = await import("@/components/GithubSection");
    render(
      <ThemeProvider>
        <LanguageProvider>
          <GithubSection />
        </LanguageProvider>
      </ThemeProvider>
    );
    await waitFor(() =>
      expect(screen.queryByText(/fetch api\.github\.com/)).not.toBeInTheDocument()
    );
    expect(screen.getByText(/↗ github\.com\/lucassdantas/)).toBeInTheDocument();
  });
});
