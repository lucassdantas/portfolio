# Handoff: Portfólio Lucas Dantas v2

## Overview
Redesign completo do portfólio de Lucas Dantas (desenvolvedor full stack) — one-page, estilo "dev moderno minimalista", com terminal interativo, animações e dados carregados de um módulo de conteúdo separado. Substitui o portfólio atual em `github.com/lucassdantas/portfolio` (Next.js).

## About the Design Files
Os arquivos deste pacote são **referências de design em HTML** — um protótipo funcional que mostra o visual e o comportamento pretendidos, **não código de produção para copiar diretamente**. A tarefa é **recriar este design no repositório Next.js existente do usuário** (`lucassdantas/portfolio`: Next.js 15 + App Router + Tailwind + TypeScript), seguindo os padrões já estabelecidos lá (componentes em `src/components`, dados em `src/utils`, contexts para tema/idioma).

- `Portfolio Lucas Dantas.dc.html` — protótipo completo (markup com estilos inline + lógica em classe React no `<script>` final)
- `portfolio-data.js` — **camada de conteúdo**: todas as strings, experiências, projetos, certificados, livros e traduções. **Requisito de arquitetura do usuário: manter esta separação.** No Next.js, transformar em módulos TS tipados (ex.: `src/data/*.ts`), simulando um banco não-relacional: editar conteúdo nunca deve exigir tocar em componentes.
- `src/assets/…` — fotos e logos de tecnologias/projetos (vindos do repositório original)

## Fidelity
**High-fidelity (hifi).** Cores, tipografia, espaçamentos e interações são finais. Recriar pixel-perfect usando Tailwind (mapear os tokens abaixo para o `tailwind.config`).

## Design Tokens
Temas via CSS vars (atributo `data-theme` no `<html>`):
- Dark (padrão): bg `#04080F`, bg2 `#081120`, card `#0B1524`, border `#16233A`, text `#E2E8F0`, muted `#8C98AB`
- Light: bg `#EEF1F5`, bg2/card `#FFFFFF`, border `#D7DCE5`, text `#111B29`, muted `#4E5D74`
- Accent: `#1D94E3` (configurável)
- Terminal/playground/case em destaque: SEMPRE dark (`#060D18` / `#0B1524` / border `#16233A`), independente do tema
- Fontes: **Space Grotesk** (400–700, títulos e corpo) + **JetBrains Mono** (400–700, labels, código, terminal)
- Radius: cards 12px, botões 8px, chips 6px, pills 20px; verde status `#22C55E`

## Screens / Views (one-page, seções em ordem)
1. **Nav fixa** — blur (`backdrop-filter:blur(12px)`), logo mono `<lucas.dantas />` em accent, links âncora, seletor de idioma PT/EN/ES/FR (pill, ativo = fundo accent), toggle tema ☀/☾. Links somem <920px (adicionar menu hambúrguer na implementação).
2. **Hero** — grid 2 col (min 320px). Esq: `// desenvolvedor full stack` (mono, accent), H1 "Lucas Dantas." clamp(52px–96px), tagline muted 19px, CTAs ("Ver projetos" accent sólido; "Fale comigo" outline), stats mono (4+ anos / 40+ projetos / 4 idiomas). Dir: foto 300×340 grayscale(60%)→0 no hover, tilt 3D via mouse (±10deg, perspective 700px), quadrados decorativos (accent 110px; gradiente #1E1D3F→accent 90px, float 5s), badge "● disponível para novos desafios". Fundo global: canvas fixo com rede de partículas (60 pts, linhas <130px, repulsão do mouse).
3. **Marquee** — faixa mono com stack (translateX 0→-50%, 36s, lista duplicada).
4. **01 — Terminal interativo** — janela mac (dots vermelho/amarelo/verde), 340px, prompt `lucas@portfolio:~$`. Comandos: `help, whoami, stack, arch, exp, projects, books, langs, github, contact, theme, lang [pt|en|es|fr], clear, ls, coffee, sudo hire-me`. Histórico com setas ↑/↓; clique foca o input; auto-scroll ao fundo.
5. **02 — Stack & competências** — grid de cards (min 300px) com chips mono (logo 16px quando houver em `src/assets/technologyImages/`); 6 grupos incl. "Arquitetura & Práticas". Abaixo, "// como eu trabalho": 4 cards de princípios (emoji, título, descrição).
6. **03 — Experiência** — timeline vertical (dot accent + linha border), acordeões: header (cargo @ empresa, período · modo, +/−), corpo com bullets e chips de tech. Primeiro item aberto por padrão.
7. **04 — Projetos** — Case em destaque (sempre dark, glow radial accent): "Chatbots corporativos com IA — CMEXX" com 3 métricas (~10k → 2–4k tokens / n8n → Python / MCP + LLM). Filtros pill (Todos/Sistemas/Sites). Grid de cards (min 330px): imagem 180px grayscale(35%)→0 + scale 1.04 no hover, card translateY(-5px), nome, pill categoria, descrição, hashtags mono, links `↗ live` / `↗ github`.
8. **05 — GitHub em tempo real** — fetch `api.github.com/users/lucassdantas` (+ `/repos?per_page=100`): 4 stat-cards (repos, followers, stars, gists) + top 5 linguagens com barras percentuais. Estado de loading estilo terminal com cursor piscando.
9. **06 — Playground** — editor JS (textarea, dark) + console lado a lado; RUN executa via `new Function('console', code)` com console capturado; erros com ✖.
10. **07 — Educação** — 2 cards de formação; grid de 11 certificados (link ↗ quando houver URL, horas em accent); **estante**: 4 livros (lombada 40×56 com borda esq. accent e iniciais mono + título/autor); idiomas falados com barras (Nativo 100 / C1 85 / B1 55 / A1 25).
11. **08 — Contato** — headline clamp(34–56px), texto, botões LinkedIn (sólido) / GitHub (outline), "📍 Rio de Janeiro, Brasil · remoto". Footer com © e link do GitHub.

## Interactions & Behavior
- Scroll suave (`scroll-behavior:smooth`), âncoras por id
- Reveal on scroll: IntersectionObserver em `[data-reveal]` (opacity 0 + translateY 26px → visível, .7s ease; fallback: revelar tudo após 6s)
- Tema e idioma persistem em `localStorage` (`ldp-theme`, `ldp-lang`)
- i18n: 4 idiomas para strings de UI; bullets de experiência/projetos em PT (como no site original)
- Hovers: bordas ganham accent; transições ~.3s

## State Management
`theme`, `lang`, `openExp` (índice do acordeão, -1 fechado), `cat` (filtro), `termLines` (array {text,color}), histórico do terminal, `playCode`/`playOut`, `gh`/`ghLangs`/`ghErr`. Conteúdo importado de `portfolio-data.js` (coleções: `translations`, `experiences`, `projects`, `certifications`, `educations`, `stackGroups`, `principles`, `books`, `marquee`).

## Assets
- `src/assets/desenvolvedor-web-lucas-dantas.jpg` — foto do hero
- `src/assets/technologyImages/**` — logos (12) para chips do stack
- `src/assets/Projects/**` — capas dos 12 projetos
Todos vindos do repositório original `lucassdantas/portfolio`.

## Files
- `Portfolio Lucas Dantas.dc.html` — protótipo hifi (referência canônica de layout/estilo/comportamento)
- `portfolio-data.js` — conteúdo completo (fonte da verdade para textos)
- `src/` — assets

## Notas de implementação no repo Next.js
- Manter contexts existentes (`ThemeContext`, `LanguageContext`) ou substituí-los pelo padrão deste design (CSS vars + localStorage)
- Sugerido: `src/data/` com um arquivo por coleção + types em `src/types`
- Partículas: canvas puro (sem lib); pausar com `prefers-reduced-motion`
- GitHub API sem token tem rate limit — tratar erro escondendo a seção (comportamento do protótipo) ou cachear via ISR
