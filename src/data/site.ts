// Camada de conteúdo — dados gerais do site (links, perfil, destaque)
export const site = {
  name: "Lucas Dantas",
  url: "https://portfolio.devdantas.com.br",
  logo: "<lucas.dantas />",
  githubUser: "lucassdantas",
  githubUrl: "https://github.com/lucassdantas",
  linkedinUrl: "https://www.linkedin.com/in/lucas-de-sousa-dantas/",
  location: "📍 Rio de Janeiro, Brasil",
  coords: "22°54′S 43°10′W",
  heroImage: "/assets/desenvolvedor-web-lucas-dantas.jpg",
  stats: { years: "4+", projects: "40+", languages: "4" },
  /** Régua de métricas da ExperienceSection — valores na ordem m1..m4 de translations.ts. */
  expMetrics: [
    { value: "−90%", accent: true },
    { value: "30+" },
    { value: "~150" },
    { value: "100%", warm: true },
  ] as { value: string; accent?: boolean; warm?: boolean }[],
  featuredCase: {
    title: "Chatbots corporativos com IA — CMEXX",
    metrics: [
      { value: "−90%", color: "#22C55E" },
      { value: "n8n → Python", color: "#1D94E3" },
      { value: "MCP + LLM", color: "#A78BFA" },
    ],
  },
};
