# CLAUDE.md

Portfólio one-page de Lucas Dantas (dev full stack). Next.js 16 (App Router) + React 19 + TypeScript + Tailwind 4. Docs completas em [docs/index.md](docs/index.md).

## Comandos

```bash
npm run dev        # dev server
npm run build      # build de produção
npm test           # vitest run (76 testes, unit + integração)
npm run test:watch
```

## Regra de ouro: conteúdo vive em src/data/

Textos, experiências, projetos, certificados, traduções e a política de privacidade estão em `src/data/*` (coleções tipadas por `src/types/index.ts`, estilo NoSQL). **Nunca hardcode conteúdo em componentes** — se um texto novo aparecer, ele entra em `src/data/` (e em `translations.ts` se for string de UI, nos 4 idiomas: pt/en/es/fr). Ver [docs/conteudo.md](docs/conteudo.md).

Duas regras editoriais que os testes cobram:

- **`**termo**` no máximo duas vezes por texto** (bullet de experiência, parágrafo de `systems.ts`), sempre sobre o resultado ou a decisão — nunca sobre a tecnologia nem sobre a frase inteira.
- **Conteúdo sobre trabalho de cliente/empregador é genérico**: sistemas internos são descritos pela função ("o ERP da empresa", "o sistema legado"), nunca pelo nome de produto interno; valores de política, nomes de pessoas/clientes/tabelas/endpoints ficam fora. O texto conta a decisão de engenharia, não o dado da empresa.

## Arquitetura (resumo)

- `src/app/page.tsx` monta as seções na ordem do design; um client component por seção em `src/components/`. A numeração exibida (`01 —`, `02 —` …) é hardcoded no JSX de cada seção: inserir uma no meio obriga a renumerar as seguintes à mão, e a conferir se a `Navbar` ainda cabe no breakpoint `nav:`.
- `CaseSection` e `SystemsSection` são complementares e não devem se sobrepor: o case abre **um** trabalho em profundidade (com diagrama antes/depois); `SystemsSection` mostra a **largura** das outras entregas de plataforma, em cards problema → solução → resultado (`src/data/systems.ts`).
- Estado global mínimo: só `LanguageContext` (localStorage `ldp-lang`) — **o site é sempre dark, não existe mais tema claro/`ThemeContext`**. Estado de seção fica local; Navbar e Terminal se comunicam pelo evento global `TERMINAL_OPEN_EVENT` (botão `_shell` abre o terminal em tela cheia) em vez de um context novo.
- `src/lib/github.ts`: única fonte de fetch da API do GitHub (promise cacheada em módulo).
- `src/shaders/particles.ts` e `src/shaders/core.ts`: os dois programas WebGL do site (campo de partículas de fundo e o núcleo raymarched da `CoreSection`), portados do protótipo. Mudar a matemática do shader é editar essas strings GLSL, não os componentes que os montam.
- Detalhes e decisões: [docs/arquitetura.md](docs/arquitetura.md).

## Design (redesign v3)

- O protótipo hi-fi que originou este redesign (bundle de artifact, HTML/CSS/JS compactados dentro) não está no repositório — vive fora, em `old_versions/` (gitignored, referência pessoal do autor). Se precisar consultá-lo, peça o arquivo; não é algo que uma sessão nova encontra no repo.
- Tokens são CSS vars em `globals.css`, expostos como utilities via `@theme inline`: `bg-bg`, `bg-bg2`, `bg-card`, `border-bord`, `text-txt`, `text-muted`, `text-strong`, `text-dim`, `text-accent`, `text-warm`, `text-ok`, `text-err`. `text-strong` é o meio-termo entre `muted` e `txt` (destaque dentro de texto muted, ver `src/lib/richText.ts`); `text-dim` é o piso de contraste do site (4.5:1 sobre `--bg`/`--bg2` — não usar cor mais escura que `--dim` sobre o fundo).
- Paleta (dark-only): `--bg:#0A0908`, `--bg2/--card:#0F0E0C`, `--border:#1E1C19`, `--text:#EDEAE5`, `--muted:#8A857D`, `--strong:#B5AFA6`, `--dim:#827C73`, `--accent:#1D94E3`, `--warm:#D7A45A`, `--ok:#22C55E`, `--err:#C05B4D`.
- Fontes: Schibsted Grotesk (corpo/títulos, `font-sans`) e DM Mono (labels/código, `font-mono`), via `next/font` — CSS vars `--font-schibsted`/`--font-dm-mono`.
- **Sempre dark** (o site inteiro já é dark, mas estes três continuam mais escuros que o fundo, de propósito): terminal, playground e o painel do case em destaque usam `#070605`/`#0F0E0C` fixos.
- Bordas de 1px (`border-bord`) no lugar de cards com sombra; grades usam `gap-px` + `bg-bord` para criar as linhas divisórias. Raio de borda nunca maior que 3px.
- Breakpoint da nav: variante custom `nav:` (1040px); abaixo disso, menu hambúrguer. Era 920px e subiu quando a nav passou a ter 7 links — link novo na nav pede reconferir esse valor. `SectionRail` (trilha vertical de seções) só aparece `≥1100px` (`min-[1100px]:`).
- Efeitos que dependem de mouse (`Cursor`, campo de partículas) checam `matchMedia("(hover: none)")`/largura antes de montar — não é CSS escondendo, é não instanciar em touch.

## Padrões de código

- CSS global novo vai dentro de `@layer base` em `globals.css` — fora de layer ele vence as utilities do Tailwind 4 e causa bugs silenciosos de cor.
- Estilo: Tailwind direto no JSX; valores fora da escala usam arbitrary values (`px-[26px]`), mantendo fidelidade ao protótipo.
- Idioma do código: nomes em inglês; conteúdo, comentários e mensagens de teste em português.
- Animações/efeitos (partículas, núcleo 3D, reveal, carrossel) em canvas/JS puro ou `IntersectionObserver` + CSS, sem libs de animação; respeitar `prefers-reduced-motion` e nunca escutar teclado/mouse fora da seção visível.
- Toda mudança passa por `npm test` e `npm run build` antes de commit. Teste novo segue os padrões de `src/tests/` ([docs/testes.md](docs/testes.md)).
- Rede em teste é sempre mockada (`setup.ts` desabilita `fetch` por padrão); `IntersectionObserver` também é mockado lá (não dispara sozinho — componentes que dependem dele para uma feature funcionar em teste devem assumir "visível" por padrão, como o carrossel de projetos).

## Cuidados

- O site anterior e os protótipos de design (antigo e este) ficam em `old_versions/`, fora do repositório (gitignored) — não existem mais aqui, não tente importar código de lá.
- `public/ads.txt` é do Google AdSense — não remover.
- API do GitHub sem token tem rate limit: em erro a seção esconde os stats e mantém o link (não quebrar esse fallback).
- LGPD: o site não coleta dados pessoais próprios; se adicionar formulário/analytics, atualizar `src/data/privacy.ts`.
