# Portfólio Lucas Dantas — v3

One-page de portfólio editorial, sempre dark: terminal interativo, campo de partículas e núcleo 3D em WebGL, carrossel de projetos, playground de código, stats do GitHub ao vivo e i18n em 4 idiomas.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** (tokens via CSS vars, sem `tailwind.config`)
- **Vitest + Testing Library** para testes unitários e de integração

## Como rodar

```bash
npm install
npm run dev        # dev server em http://localhost:3000
npm run build      # build de produção
npm test           # roda a suíte de testes uma vez
npm run test:watch # testes em modo watch
```

## Estrutura

```
src/
  app/          # layout, página única e globals.css (tokens — site é sempre dark)
  components/   # um componente por seção da página
  contexts/     # LanguageContext (pt/en/es/fr) — único estado global
  data/         # ★ TODO o conteúdo do site (textos, projetos, certificados…)
  lib/          # utilitários (fetch cacheado da API do GitHub, richText, chat)
  shaders/      # os dois programas WebGL (partículas de fundo e núcleo 3D)
  tests/        # unit/ e integration/
  types/        # interfaces TypeScript das coleções de dados
public/assets/  # fotos e logos
docs/           # esta documentação
old/            # site anterior (referência, fora do build)
design_handoff/ # protótipo hifi do redesign v2 (histórico, não usar mais)
```

O protótipo canônico do redesign v3 é `Lucas Dantas - Portfolio.html`, na raiz do repo (bundle de artifact — não editar).

## Documentação por assunto

- [Arquitetura](./arquitetura.md) — decisões, camada de dados, contexts, tokens de design
- [Conteúdo](./conteudo.md) — como editar textos, projetos, certificados etc. sem tocar em componentes
- [Testes](./testes.md) — organização da suíte e como escrever novos testes

> O projeto é pequeno; docs em arquivos únicos por assunto. Se crescer, promover cada assunto a subpasta (ex.: `arquitetura/index.md`).
