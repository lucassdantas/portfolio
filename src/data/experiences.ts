// Camada de conteúdo — experiências profissionais
//
// Regra editorial desta seção (vale ao adicionar bullet novo):
// o CARD de projeto conta *o que foi construído*; o BULLET de experiência
// conta *o que mudou porque você estava lá* — escala, responsabilidade,
// resultado, padrão introduzido. Se a frase cabe no card, ela não repete aqui.
// O detalhamento das entregas de plataforma vive em `systems.ts`.
//
// Bullets aceitam `**termo**` para destaque (ver src/lib/richText.ts).
// LIMITE: no máximo DOIS destaques por bullet, sobre o resultado ou a
// decisão. Marcar tecnologia e frase inteira é o que mata o destaque —
// se tudo é negrito, nada é.
import type { Experience } from "@/types";

export const experiences: Experience[] = [
  {
    title: "Desenvolvedor Full Stack",
    company: "CMEXX",
    period: "dez/2025 — atual",
    mode: "Rio de Janeiro · Sistemas de saúde (CME)",
    bullets: [
      "Construí de ponta a ponta o fluxo de desligamento de RH — sete caminhos de aprovação por motivo de saída, documentos gerados já preenchidos, aprovação de diretoria condicionada ao valor simulado e trilha de auditoria — tirando o processo da **planilha e do e-mail**",
      "Reproduzi a simulação rescisória do RH linha a linha contra a planilha de referência, com memória de cálculo persistida e **teste de regressão sobre dados reais** — o custo do desligamento passou a ser conhecido antes da decisão",
      "Extraí o motor de aprovações de dentro desse domínio e o transformei em infraestrutura da empresa: hoje **quatro áreas rodam no mesmo motor**, e um processo novo virou configuração em tela de administração em vez de desenvolvimento",
      "Projetei o controle de estoque de insumos hospitalares, trocando o lote pelo **código de produto como parâmetro de rastreio** para eliminar a divergência causada pela instabilidade desse dado no fluxo físico; inclui saldo mensal com carry-over, transferência entre unidades, inventário por contagem em tela e baixa por QR code",
      "Liderei a migração dos chatbots corporativos de fluxos probabilísticos (orquestrador low-code) para fluxos determinísticos modelados como **máquina de estados finitos** em Python, com FastAPI, SQLAlchemy e Pytest",
      "Reduzi em **cerca de 90%** o consumo de tokens por fluxo de conversa: antes cada fluxo disparava várias chamadas ao modelo; hoje só uma etapa consome token, e o custo mensal da operação caiu na mesma proporção",
      "Desenhei a arquitetura multi-agente que sustenta os assistentes de RH, marketing e intranet na mesma aplicação, com base de conhecimento (RAG), histórico e sessão isolados por agente — e **reduzi de propósito a superfície onde a IA decide**: menu determinístico para escolha de motivo, escalonamento por contador, modelo só redigindo texto com confirmação humana antes de qualquer escrita",
      "Escrevi a suíte de testes de segurança do chatbot — **injeção, bypass de autorização e vazamento entre sessões** — porque um assistente que entrega contracheque e abre chamado em nome do funcionário é superfície de ataque real",
      "Migrei **31 telas** do sistema legado (PHP + jQuery) para Next.js e TypeScript, cada uma com rota de API, documentação Swagger e teste end-to-end em Cypress, fechando a leva com auditoria de paridade campo a campo contra o legado",
      "Expus o sistema para consulta em linguagem natural via **MCP**, com catálogo curado de telas e endpoints, autorização por setor e negação por padrão; uma rota desenhada para o formato da pergunta cortou em **71%** as chamadas por consulta",
      "Re-arquitetei a aplicação de monitoramento das conversas dos chatbots (Laravel + TypeScript): middlewares de segurança com autenticação OAuth2, canal de envio ativo de mensagens e o **logging estruturado que não existia** — dando rastreabilidade para auditar histórico e diagnosticar incidentes em vez de depender do relato do usuário",
      "Modelei o controle de autorização da intranet que conversa com o bot aplicando **menor privilégio**: a resposta é montada a partir do nível de acesso de quem perguntou, então conteúdo restrito nunca chega a quem não pode vê-lo",
      "Cuido da infraestrutura das aplicações — exposição controlada via proxy reverso, roteamento, pipeline de CI/CD para ambiente de teste e monitoramento em Linux com Docker e Nginx",
      "Documento a decisão junto com o código, incluindo **o que ficou fora do escopo e o que ainda não está resolvido** — limitação registrada custa menos que limitação descoberta em produção",
    ],
    tech: ["Python", "FastAPI", "LangChain", "Laravel", "Next.js", "React", "TypeScript", "SQL Server", "PostgreSQL", "Redis", "Docker", "Linux", "Nginx", "Cypress", "Pytest"],
  },
  {
    title: "Desenvolvedor Full Stack",
    company: "Freelancer",
    period: "jun/2024 — atual",
    mode: "Remoto · clientes nacionais e internacionais",
    bullets: [
      "Entrego e mantenho **mais de 10 sites, sistemas e MVPs** para clientes nacionais e internacionais — incluindo cliente da Nova Zelândia (puredetail.co.nz) — com 100% das entregas dentro do prazo",
      "Lidero equipes de design e desenvolvimento e faço o **atendimento direto ao cliente**, do levantamento ao aceite",
      "Landing pages otimizadas entregues em **2 dias**, permitindo ao cliente antecipar campanhas",
      "Orientei contratação e configurei hospedagens (VPS, CloudPanel, PM2, Nginx), **reduzindo o custo de infraestrutura** dos clientes",
      "**Recuperei sites comprometidos por malware**, restaurando a operação de clientes que estavam com o negócio parado",
      "Mantenho relações longas: um portal de imóveis que evoluo há mais de um ano — onde escrevi um **plugin próprio em PHP** que exporta o catálogo em XML para portais parceiros — e uma clínica que atendo há mais de 3 anos",
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
      "Construí os blogs de lançamento de campanhas de alto ticket — uma de cidadania europeia (**R$ 80 mil em 1 semana**) e uma de certificação profissional (**R$ 100 mil em 1 semana**, case premiado) — incluindo os scripts de rastreamento e a distribuição round-robin que dividia o volume de leads em partes iguais entre os vendedores",
      "Criei plugins WordPress sob medida quando o mercado não resolvia: regras condicionais de entrega em WooCommerce e consumo de API externa renderizado direto no conteúdo, **eliminando custo de licença** de ferramentas de terceiros",
      "Desenvolvi sistemas fora do WordPress, com React no front e PHP no back-end, quando o CMS **limitava o escopo** do que o cliente precisava",
      "Desenvolvi integrações com APIs para metrificação de leads em CRMs",
      "Atendi marcas de bebidas, hotelaria, móveis planejados, autopeças e investimentos, entre sites institucionais, e-commerces e landing pages sazonais de campanha",
      "Cuidei de segurança e infraestrutura: remoção de malware com **hardening** posterior, correções em registros DNS, deploy com propagação de domínio acelerada e configuração de AWS S3",
    ],
    tech: ["WordPress", "PHP", "React", "JavaScript", "MySQL", "AWS S3", "DNS", "Elementor"],
  },
];
