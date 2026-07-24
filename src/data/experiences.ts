// Camada de conteúdo — experiências profissionais
import type { Experience } from "@/types";

export const experiences: Experience[] = [
  {
    title: "Desenvolvedor Full Stack",
    company: "CMEXX",
    period: "dez/2025 — atual",
    mode: "Rio de Janeiro · Sistemas de saúde (CME)",
    bullets: [
      "Atuo em sistemas críticos da área da saúde (gestão e rastreabilidade de CME), garantindo estabilidade, disponibilidade e confiabilidade em produção",
      "Lidero a migração da arquitetura de chatbots corporativos de fluxos probabilísticos (n8n) para fluxos determinísticos em Python, com FastAPI, SQLAlchemy e Pytest",
      "Reduzi o consumo de tokens de IA de ~10 mil por request para 2–4 mil no fluxo completo, cortando drasticamente o custo mensal da operação",
      "Re-arquitetei a aplicação de monitoramento de conversas dos chatbots: refatoração completa, migração para TypeScript, middlewares de segurança e autenticação OAuth2 (client credentials)",
      "Otimizei queries SQL críticas, melhorando o desempenho das aplicações",
      "Participo da modernização do sistema legado: de jQuery + Bootstrap + PHP para Next.js + TypeScript, com documentação Swagger e testes unitários e de integração",
      "Implementei MCPs para consulta à base de conhecimento da empresa via IA, com restrição de acesso por perfil",
      "Automatizo tarefas dos setores (RH, financeiro) em contato direto com gestores; implanto e monitoro aplicações em Linux com Docker e Nginx",
      "Participo de dailies e rituais ágeis, análises técnicas e planejamento de soluções",
    ],
    tech: ["Python", "FastAPI", "Laravel", "CodeIgniter", "React", "TypeScript", "SQL Server", "PostgreSQL", "Docker", "Linux", "Nginx", "n8n"],
  },
  {
    title: "Desenvolvedor Full Stack",
    company: "Freelancer",
    period: "jun/2024 — atual",
    mode: "Remoto · clientes nacionais e internacionais",
    bullets: [
      "Entreguei sistemas, landing pages e MVPs para clientes nacionais e internacionais — incluindo cliente da Nova Zelândia (puredetail.co.nz) — com 100% das entregas dentro do prazo",
      "Desenvolvo e mantenho mais de 10 sites com responsividade, segurança e otimização",
      "Landing pages otimizadas entregues em 2 dias, permitindo ao cliente antecipar campanhas",
      "Orientei contratação e configurei hospedagens (VPS, CloudPanel, PM2, Nginx), reduzindo custos e maximizando eficiência",
      "Reestruturei e recuperei sites comprometidos por malware, restaurando a operação dos clientes",
      "Liderei equipes de desenvolvimento, planejando projetos e cumprindo prazos estimados",
    ],
    tech: ["Next.js", "React", "TypeScript", "PHP", "Node.js", "Tailwind CSS", "PM2", "Linux"],
  },
  {
    title: "Desenvolvedor WordPress Pleno",
    company: "RD Exclusive",
    period: "jul/2022 — jan/2026",
    mode: "Rio de Janeiro · Híbrido",
    bullets: [
      "Otimizei mais de 30 projetos, reduzindo o tempo de carregamento entre 50% e 90%",
      "Participei de projetos que faturaram mais de R$ 100 mil em uma semana, contribuindo com desenvolvimento, correções e melhorias",
      "Realizei cerca de 150 tarefas por mês, garantindo entregas no prazo e alta satisfação dos clientes",
      "Criei plugins WordPress personalizados, garantindo recursos exclusivos e reduzindo custos com ferramentas de terceiros",
      "Desenvolvi integrações com APIs customizadas para metrificação de leads em CRMs",
      "Removi vírus de hospedagens e sites, com análises e melhorias de segurança; configurei DNS e AWS S3",
      "Desenvolvi sistemas sob medida sem WordPress quando necessário, com deploy otimizado",
    ],
    tech: ["WordPress", "PHP", "JavaScript", "MySQL", "AWS S3", "DNS", "Elementor"],
  },
];
