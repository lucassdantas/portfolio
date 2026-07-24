# Portfólio Lucas Dantas — v2

One-page de portfólio com estética "dev moderno minimalista": terminal interativo, partículas em canvas, playground de código, stats do GitHub ao vivo, i18n em 4 idiomas e temas dark/light.

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
  app/          # layout, página única e globals.css (tokens de tema)
  components/   # um componente por seção da página
  contexts/     # ThemeContext (dark/light) e LanguageContext (pt/en/es/fr)
  data/         # ★ TODO o conteúdo do site (textos, projetos, certificados…)
  lib/          # utilitários (fetch cacheado da API do GitHub)
  tests/        # unit/ e integration/
  types/        # interfaces TypeScript das coleções de dados
public/assets/  # fotos e logos
docs/           # esta documentação
old/            # versão anterior do site (referência, fora do build)
design_handoff/ # protótipo hifi de referência do redesign
```

## Documentação por assunto

- [Arquitetura](./arquitetura.md) — decisões, camada de dados, contexts, tokens de design
- [Conteúdo](./conteudo.md) — como editar textos, projetos, certificados etc. sem tocar em componentes
- [Testes](./testes.md) — organização da suíte e como escrever novos testes

> O projeto é pequeno; docs em arquivos únicos por assunto. Se crescer, promover cada assunto a subpasta (ex.: `arquitetura/index.md`).
