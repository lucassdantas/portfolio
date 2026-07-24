# Testes

Suíte com **Vitest** + **Testing Library** em ambiente jsdom.

```bash
npm test           # roda tudo uma vez
npm run test:watch # modo watch
```

## Organização

```
src/tests/
  setup.ts                 # mocks globais: IntersectionObserver, matchMedia,
                           # canvas getContext e fetch (rede desabilitada)
  helpers.tsx              # renderWithProviders (Theme + Language)
  unit/
    data.test.ts           # integridade da camada de dados (traduções completas,
                           # categorias válidas, imagens existentes, urls https)
    github.test.ts         # agregação e cache de fetchGithubStats (fetch mockado)
  integration/
    terminal.test.tsx      # comandos, histórico, clear, troca de tema/idioma
    sections.test.tsx      # filtros de projetos, acordeão, playground, navbar
    github-section.test.tsx# loading → stats; fallback em erro de API
    privacy.test.tsx       # modal LGPD abre/fecha (botão e Escape)
```

## Convenções

- **Rede sempre mockada**: `setup.ts` substitui `fetch` por uma rejeição; testes que precisam de API usam `vi.stubGlobal("fetch", ...)` próprio.
- `lib/github.ts` cacheia a promise em escopo de módulo — testes que dependem de estado limpo usam `vi.resetModules()` + `import()` dinâmico.
- Componentes que usam contexts são renderizados com `renderWithProviders`.
- Prefira queries por role/texto visível (`getByRole`, `getByText`) a test-ids.
- Teste novo segue o padrão do vizinho: unit para dados/lib puros, integration para comportamento de componente.
