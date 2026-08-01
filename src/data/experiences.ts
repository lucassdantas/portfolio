// Camada de conteúdo — experiências profissionais
//
// Regra editorial desta seção (vale ao adicionar bullet novo):
// o CARD de projeto conta *o que foi construído*; o BULLET de experiência
// conta *o que mudou porque você estava lá* — escala, responsabilidade,
// resultado, padrão introduzido. Se a frase cabe no card, ela não repete aqui.
//
// Bullets aceitam `**termo**` para destaque (ver src/lib/richText.ts).
// Marque resultado e tecnologia, nunca a frase inteira.
import type { Experience } from "@/types";

export const experiences: Experience[] = [
  {
    title: "Desenvolvedor Full Stack",
    company: "CMEXX",
    period: "dez/2025 — atual",
    mode: "Rio de Janeiro · Sistemas de saúde (CME)",
    bullets: [
      "Atuo em **sistemas críticos da área da saúde** (gestão e rastreabilidade de CME), garantindo **estabilidade, disponibilidade e confiabilidade em produção**",
      "Lidero a migração da arquitetura de chatbots corporativos de fluxos probabilísticos (n8n) para fluxos determinísticos modelados como **máquina de estados finitos (FSM)** em **Python**, com FastAPI, SQLAlchemy e Pytest",
      "Reduzi em **cerca de 90%** o consumo de tokens por fluxo de conversa: antes cada fluxo disparava várias chamadas ao modelo, e hoje apenas uma etapa consome token — o custo mensal da operação caiu na mesma proporção",
      "Projetei o **módulo de controle de estoque** de insumos hospitalares: troquei o lote pelo **código de produto como parâmetro de rastreio**, eliminando divergências causadas pela instabilidade desse dado no fluxo físico, e implementei **saldo mensal**, **baixa por leitura de QR code** e **transferência entre unidades de CME**",
      "Re-arquitetei a aplicação de monitoramento das conversas dos chatbots de WhatsApp (**Laravel** + **TypeScript**): refatoração completa, middlewares de segurança com **autenticação OAuth2** e um canal de **envio ativo de mensagens** ao usuário, orquestrado via **integração com n8n**. Instrumentei nela o **logging estruturado** que não existia, dando **rastreabilidade** para auditar o histórico e diagnosticar incidentes em produção em vez de depender de relato do usuário",
      "Participo da modernização do sistema legado, de jQuery + Bootstrap + PHP para **Next.js + TypeScript**, com documentação **Swagger**, testes unitários, de integração e **end-to-end em Cypress**, além da **otimização de queries SQL** críticas",
      "Implementei **MCPs** para consulta à base de conhecimento da empresa via IA e contribuo com a construção do **MCP de comunicação com a IA**",
      "Modelei o **controle de autorização** da intranet corporativa que conversa com o bot, aplicando o **princípio de menor privilégio**: a resposta é montada a partir do **nível de acesso de quem perguntou**, de modo que conteúdo restrito nunca chega a quem não tem permissão de vê-lo",
      "Cuido da infraestrutura das aplicações: **exposição controlada via proxy reverso**, roteamento e monitoramento em **Linux com Docker e Nginx**",
      "**Automatizo tarefas** de RH e financeiro em contato direto com os gestores de cada setor",
    ],
    tech: ["Python", "FastAPI", "Laravel", "CodeIgniter", "React", "TypeScript", "SQL Server", "PostgreSQL", "Docker", "Linux", "Nginx", "n8n", "Cypress"],
  },
  {
    title: "Desenvolvedor Full Stack",
    company: "Freelancer",
    period: "jun/2024 — atual",
    mode: "Remoto · clientes nacionais e internacionais",
    bullets: [
      "Entrego e mantenho **mais de 10 sites, sistemas e MVPs** para clientes nacionais e internacionais — incluindo **cliente da Nova Zelândia** (puredetail.co.nz) — com **100% das entregas dentro do prazo**",
      "**Lidero equipes** (design e desenvolvimento) e faço o **atendimento direto ao cliente**, do levantamento ao aceite",
      "Landing pages otimizadas entregues em **2 dias**, permitindo ao cliente antecipar campanhas",
      "Orientei contratação e configurei hospedagens (**VPS, CloudPanel, PM2, Nginx**), reduzindo o custo de infraestrutura dos clientes",
      "**Recuperei sites comprometidos por malware**, restaurando a operação de clientes que estavam com o negócio parado",
      "Mantenho relações longas: um **portal de imóveis** que evoluo há mais de um ano — onde criei um **plugin próprio em PHP** que exporta o catálogo em **XML** para portais parceiros — e uma clínica que atendo há **mais de 3 anos**",
    ],
    tech: ["Next.js", "React", "TypeScript", "PHP", "Node.js", "Tailwind CSS", "PM2", "Linux"],
  },
  {
    title: "Desenvolvedor WordPress Pleno",
    company: "RD Exclusive",
    period: "jul/2022 — jan/2026",
    mode: "Rio de Janeiro · Híbrido",
    bullets: [
      "Otimizei **mais de 30 projetos**, reduzindo o tempo de carregamento entre **50% e 90%**",
      "Sustentei um ritmo de cerca de **150 tarefas por mês** com entregas no prazo",
      "Construí os **blogs de lançamento** de campanhas de alto ticket — uma de **cidadania europeia** (**R$ 80 mil em 1 semana**) e uma de **certificação profissional** (**R$ 100 mil em 1 semana**, case premiado) — incluindo os **scripts de rastreamento** e a **distribuição round-robin de leads**, que dividia o volume em partes iguais entre os vendedores",
      "Criei **plugins WordPress sob medida** quando o mercado não resolvia: **regras condicionais de entrega** em WooCommerce e **consumo de API externa** renderizado direto no conteúdo — eliminando custo de licença de ferramentas de terceiros",
      "Desenvolvi **sistemas sob medida fora do WordPress**, com **React** no front e **PHP** no back-end, quando o CMS limitava o escopo do que o cliente precisava",
      "Desenvolvi **integrações com APIs** para **metrificação de leads em CRMs**",
      "Atendi marcas de **bebidas, hotelaria, móveis planejados, autopeças e investimentos**, entre sites institucionais, **e-commerces** e **landing pages sazonais** de campanha",
      "Cuidei de **segurança e infraestrutura**: remoção de malware com **hardening** posterior, correções em **registros DNS**, deploy com **propagação de domínio acelerada** e configuração de **AWS S3**",
    ],
    tech: ["WordPress", "PHP", "React", "JavaScript", "MySQL", "AWS S3", "DNS", "Elementor"],
  },
];
