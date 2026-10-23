// Camada de conteúdo — dados gerais do site (links, perfil, destaque)
import type { LocalizedText } from "@/types";

export const site = {
  name: "Lucas Dantas",
  url: "https://portfolio.devdantas.com.br",
  logo: "<lucas.dantas />",
  githubUser: "lucassdantas",
  githubUrl: "https://github.com/lucassdantas",
  linkedinUrl: "https://www.linkedin.com/in/lucas-de-sousa-dantas/",
  location: {
    pt: "Rio de Janeiro, Brasil",
    en: "Rio de Janeiro, Brazil",
    es: "Río de Janeiro, Brasil",
    fr: "Rio de Janeiro, Brésil",
  } as LocalizedText,
  coords: "22°54′S 43°10′W",
  heroImage: "/assets/desenvolvedor-web-lucas-dantas.jpg",
  /**
   * Trilha ambiente: vazio = trilha gerada ao vivo (src/lib/ambient.ts).
   * Para usar uma música própria, coloque o arquivo em /public (ex.:
   * "/audio/ambient.mp3") e aponte aqui — volume e intensidade continuam iguais.
   */
  ambientTrack: "" as string,
  stats: { years: "6+", projects: "40+", languages: "4" },
  /**
   * Régua de métricas da ExperienceSection — valores na ordem m1..m4 de translations.ts.
   * Só entra aqui número que algum bullet de `experiences.ts` sustenta; os demais
   * (30+ projetos otimizados, ~150 tarefas/mês) ficam no bullet, sem virar manchete.
   */
  expMetrics: [
    { value: "−90%", accent: true },
    { value: "31" },
    { value: "−71%" },
    { value: "100%", warm: true },
  ] as { value: string; accent?: boolean; warm?: boolean }[],
  featuredCase: {
    title: "Chatbots corporativos com IA — CMEXX",
    stack: ["Python", "FastAPI", "SQLAlchemy", "Pytest"],
    metrics: [
      { value: "−90%", color: "#22C55E" },
      { value: "n8n → Python", color: "#1D94E3" },
      { value: "MCP + LLM", color: "#A78BFA" },
    ],
  },
};
