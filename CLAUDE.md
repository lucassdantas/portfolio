# CLAUDE.md

Portfólio one-page de Lucas Dantas (dev full stack). Next.js 16 (App Router) + React 19 + TypeScript + Tailwind 4. Docs completas em [docs/index.md](docs/index.md).

## Comandos

```bash
npm run dev        # dev server
npm run build      # build de produção
npm test           # vitest run (31 testes, unit + integração)
npm run test:watch
```

## Regra de ouro: conteúdo vive em src/data/

Textos, experiências, projetos, certificados, traduções e a política de privacidade estão em `src/data/*` (coleções tipadas por `src/types/index.ts`, estilo NoSQL). **Nunca hardcode conteúdo em componentes** — se um texto novo aparecer, ele entra em `src/data/` (e em `translations.ts` se for string de UI, nos 4 idiomas: pt/en/es/fr). Ver [docs/conteudo.md](docs/conteudo.md).

## Arquitetura (resumo)

- `src/app/page.tsx` monta as seções na ordem do design; um client component por seção em `src/components/`.
- Estado global mínimo: `ThemeContext` (dark/light, `data-theme` no `<html>`, localStorage `ldp-theme`) e `LanguageContext` (localStorage `ldp-lang`). Estado de seção fica local.
- `src/lib/github.ts`: única fonte de fetch da API do GitHub (promise cacheada em módulo).
- Detalhes e decisões: [docs/arquitetura.md](docs/arquitetura.md).

## Design (handoff em design_handoff/)

- Referência canônica de layout/estilo: `design_handoff/Portfolio Lucas Dantas.dc.html` (hifi, pixel-perfect). Em dúvida visual, consulte o protótipo.
- Tokens de tema são CSS vars em `globals.css`, expostos como utilities via `@theme inline`: `bg-bg`, `bg-bg2`, `bg-card`, `border-bord`, `text-txt`, `text-muted`, `text-strong`, `text-accent`. `text-strong` é o meio-termo entre `muted` e `txt`, usado para destacar termo dentro de texto muted (ver `src/lib/richText.ts`).
- Fontes: Space Grotesk (corpo/títulos, `font-sans`) e JetBrains Mono (labels/código, `font-mono`), via `next/font`.
- **Sempre dark, independente do tema**: terminal, playground e case em destaque (hex literais `#060D18`/`#0B1524`/`#16233A`).
- Radius: cards 12px, botões 8px, chips 6px, pills 20px. Verde de status `#22C55E`.
- Breakpoint da nav: variante custom `nav:` (920px); abaixo disso, menu hambúrguer.

## Padrões de código

- CSS global novo vai dentro de `@layer base` em `globals.css` — fora de layer ele vence as utilities do Tailwind 4 e causa bugs silenciosos de cor.
- Estilo: Tailwind direto no JSX; valores fora da escala usam arbitrary values (`px-[26px]`), mantendo fidelidade ao protótipo.
- Idioma do código: nomes em inglês; conteúdo, comentários e mensagens de teste em português.
- Animações/efeitos (partículas, reveal, tilt) em canvas/JS puro, sem libs; respeitar `prefers-reduced-motion`.
- Toda mudança passa por `npm test` e `npm run build` antes de commit. Teste novo segue os padrões de `src/tests/` ([docs/testes.md](docs/testes.md)).
- Rede em teste é sempre mockada (`setup.ts` desabilita `fetch` por padrão).

## Cuidados

- `old/` (site anterior) e `design_handoff/` são referência: **não importar código de lá e não editar** (estão fora do `tsconfig`).
- `public/ads.txt` é do Google AdSense — não remover.
- API do GitHub sem token tem rate limit: em erro a seção esconde os stats e mantém o link (não quebrar esse fallback).
- LGPD: o site não coleta dados pessoais próprios; se adicionar formulário/analytics, atualizar `src/data/privacy.ts`.
