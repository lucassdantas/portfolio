# Editando conteúdo

Todo o conteúdo fica em `src/data/`. Nenhuma alteração em componentes é necessária.

| O que mudar | Arquivo |
|---|---|
| Textos de UI e traduções (4 idiomas) | `translations.ts` |
| Experiências profissionais (cargos, bullets, techs) | `experiences.ts` |
| Projetos do grid (nome, imagem, links, categoria) | `projects.ts` |
| Certificados | `certifications.ts` |
| Formação acadêmica | `educations.ts` |
| Grupos da stack e logos | `stack.ts` |
| Cards "como eu trabalho" | `principles.ts` |
| Estante de livros | `books.ts` |
| Itens da faixa animada | `marquee.ts` |
| Links, foto do hero, stats, case em destaque | `site.ts` |
| Política de privacidade (LGPD) | `privacy.ts` |

## Regras

- **Tipos**: cada coleção é tipada por `src/types/index.ts`. Se o TypeScript reclamar de campo faltando, é proposital.
- **Imagens**: coloque em `public/assets/...` e referencie com caminho absoluto (`/assets/...`). O teste `data.test.ts` falha se uma imagem referenciada não existir.
- **Novo idioma**: adicione o código em `Lang` (`src/types`), o objeto em `translations.ts` (spread sobre `pt` + overrides) e ele entra automaticamente no seletor da nav e no comando `lang` do terminal via `LANGS`.
- **Categorias de projeto**: apenas `"Sistemas"` ou `"Sites"` (tipo `ProjectCategory`). Para criar outra, ajuste o tipo e os filtros em `ProjectsSection`.
- **Comandos do terminal**: a lógica está em `src/components/Terminal.tsx` (função `runCmd`), mas as respostas de `stack`, `exp`, `projects` e `books` derivam das coleções de dados automaticamente.
