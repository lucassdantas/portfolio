# Arquitetura

## Princípio central: conteúdo separado de apresentação

Todo o conteúdo do site vive em `src/data/` — um "banco de dados" em módulos TypeScript tipados, estilo coleções NoSQL. Componentes apenas consomem essas coleções via `import { ... } from "@/data"`. **Editar conteúdo nunca deve exigir tocar em componentes.**

Coleções: `translations`, `experiences`, `projects`, `certifications`, `educations`, `stackGroups`, `principles`, `books`, `marquee`, `site`, `privacyPolicy`. As interfaces correspondentes estão em `src/types/index.ts` — o compilador garante que nenhum campo obrigatório falte.

## Temas (dark/light)

- Tokens de design são CSS vars definidas em `src/app/globals.css` (`--bg`, `--bg2`, `--card`, `--border`, `--text`, `--muted`, `--strong`, `--accent`, `--navbg`).
- O tema ativo é o atributo `data-theme` no `<html>`; `ThemeContext` alterna e persiste em `localStorage` (`ldp-theme`).
- Um script inline no `<head>` (em `layout.tsx`) aplica o tema salvo antes do primeiro paint, evitando flash.
- No Tailwind 4 os tokens são expostos como utilities via `@theme inline` (`bg-card`, `border-bord`, `text-muted`, `text-accent`…).
- **Exceção intencional**: terminal, playground e o case em destaque são SEMPRE dark (cores literais `#060D18`/`#0B1524`/`#16233A`), independente do tema.

## Idiomas (i18n)

`LanguageContext` mantém o idioma ativo (`pt`/`en`/`es`/`fr`), persiste em `localStorage` (`ldp-lang`) e entrega o objeto `t: Translation` já resolvido. Strings de UI são traduzidas; bullets de experiência/projetos ficam em PT (decisão do design). Os idiomas `en/es/fr` são criados por spread sobre `pt`, então chaves novas nunca ficam faltando.

## Camadas

```
app/page.tsx            monta as seções em ordem (Server Component)
components/*            um client component por seção; estado local a cada seção
contexts/*              estado global mínimo: tema + idioma
lib/github.ts           fetch da API do GitHub com cache de promise em módulo
                        (Terminal e GithubSection compartilham a mesma requisição)
data/* + types/*        conteúdo puro, sem lógica
```

Notas:

- `Reveal` encapsula o reveal-on-scroll (IntersectionObserver + fallback de 6s). CSS global fica em `@layer base` — no Tailwind 4, estilos fora de layer venceriam as utilities.
- `ParticlesCanvas` usa canvas puro (sem lib) e respeita `prefers-reduced-motion`.
- GitHub sem token tem rate limit baixo; em erro, a seção esconde os cards e mantém só o link (comportamento do protótipo).
- O breakpoint da nav é custom: `--breakpoint-nav: 920px` → variante `nav:`; abaixo disso os links viram menu hambúrguer.

## LGPD

`PrivacyModal` (aberto pelo rodapé) exibe a política de privacidade; o texto vive em `src/data/privacy.ts`. O site não coleta dados pessoais próprios — a política cobre localStorage, Google AdSense (`public/ads.txt`) e a consulta à API pública do GitHub.
