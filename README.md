# Lucas Dantas — Portfólio

One-page de portfólio com estética "dev moderno minimalista": terminal interativo, partículas em canvas, playground de código, stats do GitHub ao vivo, temas dark/light e i18n em 4 idiomas (pt/en/es/fr).

**[Documentação completa em docs/index.md](docs/index.md)** · [CLAUDE.md](CLAUDE.md) para convenções de código.

## Stack

- [Next.js 16](https://nextjs.org/) (App Router) + [React 19](https://react.dev/) + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com/) (tokens de tema via CSS vars, sem `tailwind.config`)
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) para testes

## Como rodar

```bash
npm install
npm run dev         # dev server em http://localhost:3000
```

```bash
npm run build        # build de produção
npm start             # serve o build

npm test              # roda a suíte de testes uma vez
npm run test:watch    # testes em modo watch
```

## Estrutura

```
src/
  app/          # layout, página única e globals.css (tokens de tema)
  components/   # um componente por seção da página
  contexts/     # tema (dark/light) e idioma (pt/en/es/fr)
  data/         # ★ todo o conteúdo do site — edite aqui, não em componentes
  lib/          # utilitários (fetch cacheado da API do GitHub)
  tests/        # testes unitários e de integração
  types/        # interfaces TypeScript das coleções de dados
public/assets/  # fotos e logos
docs/           # documentação do projeto
```

O conteúdo (textos, projetos, certificados, experiências, traduções, política de privacidade) vive inteiramente em `src/data/`, tipado por `src/types/`. Editar conteúdo nunca exige alterar componentes — veja [docs/conteudo.md](docs/conteudo.md).

## Privacidade

Em conformidade com a LGPD, o site expõe uma política de privacidade acessível pelo rodapé. Texto-fonte em `src/data/privacy.ts`.

## Licença

Uso pessoal — código de portfólio de Lucas Dantas.
