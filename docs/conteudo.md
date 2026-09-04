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
| Entregas da seção "sistemas em produção" | `systems.ts` |
| Estante de livros | `books.ts` |
| Links, stats, case em destaque, régua de métricas | `site.ts` |
| Política de privacidade (LGPD) | `privacy.ts` |

## Regras

- **Tipos**: cada coleção é tipada por `src/types/index.ts`. Se o TypeScript reclamar de campo faltando, é proposital.
- **Imagens**: coloque em `public/assets/...` e referencie com caminho absoluto (`/assets/...`). O teste `data.test.ts` falha se uma imagem referenciada não existir.
- **Novo idioma**: adicione o código em `Lang` (`src/types`), o objeto em `translations.ts` (spread sobre `pt` + overrides) e ele entra automaticamente no seletor da nav e no comando `lang` do terminal via `LANGS`. Atenção: `Project.desc` é `Localized` (`Record<Lang, string>`) — um idioma novo exige escrever a descrição de **todos** os projetos, e o compilador cobra isso.
- **Descrição de projeto é traduzida e em linhas**: `desc` recebe `{ pt, en, es, fr }`, e cada idioma é uma **lista de linhas curtas** — cada item vira uma linha no card. Dentro da linha, `**termo**` marca destaque (renderizado em negrito na cor do texto por `src/lib/richText.ts`). Ao contrário de `translations.ts` (que faz spread sobre `pt`), aqui não há fallback: os 4 idiomas são obrigatórios no tipo. `data.test.ts` checa linha vazia, `**` sem fechamento e tradução que ficou como cópia literal do português. Bullets de experiência seguem só em PT, sem marcação.
- **Categorias de projeto**: apenas `"Sistemas"` ou `"Sites"` (tipo `ProjectCategory`), traduzidas via `catSys`/`catSite` em `translations.ts`. Para criar outra, ajuste o tipo e essas chaves.
- **Carrossel de projetos**: `featured: true` decide quem entra no carrossel (`ProjectsSection`); os demais caem no índice compacto abaixo. Projeto sem `live`/`repo` precisa de `status: "internal" | "offline"` — sem isso o índice não sabe qual rótulo mostrar.
- **Destaque não é categoria**: use `featured: true` no projeto. Ele continua em Sistemas/Sites e também aparece no filtro "Destaques" — que é o filtro aberto por padrão, já que a lista completa é longa. Se fosse uma terceira categoria, destacar um projeto o tiraria da categoria dele.
- **Imagens dos cards**: exporte com ~800px de largura (o card exibe ~350px; 800 cobre telas 2x). Acima disso é peso morto — os cards usam `loading="lazy"`, mas o arquivo continua grande quando entra na viewport.
- **Comandos do terminal**: a lógica está em `src/components/Terminal.tsx` (função `runCmd`), mas as respostas de `stack`, `exp`, `projects` e `books` derivam das coleções de dados automaticamente.

## Destaque (`**termo**`) — máximo dois por texto

`data.test.ts` **falha** se um bullet de experiência ou um parágrafo de `systems.ts` usar mais de dois destaques. Não é preciosismo: o conteúdo já chegou ao ponto em que metade da frase estava em negrito, e destaque que cobre tudo não destaca nada. Marque o **resultado** ou a **decisão** — nunca a tecnologia (a stack já aparece nos chips) e nunca a frase inteira.

## Divisão editorial entre as seções que falam do mesmo trabalho

Três lugares descrevem o trabalho na CMEXX, e a diferença entre eles é proposital:

| Onde | O que conta | Formato |
|---|---|---|
| `experiences.ts` | o que mudou porque você estava lá — escala, responsabilidade, padrão introduzido | bullet curto |
| `systems.ts` (seção "sistemas em produção") | uma entrega de plataforma inteira: **problema → o que construí → o que mudou** | card |
| `translations.ts` (`case*`/`feat*`, seção "case em destaque") | **um** case em profundidade, com o diagrama antes/depois | seção própria |

Se um card de `systems.ts` não consegue dizer o que existia **antes**, ele não é um sistema: é uma feature, e vira bullet de experiência.

## Idioma e confidencialidade em `systems.ts`

- **Só PT**, como os bullets de experiência: são textos longos e específicos demais para manter em 4 idiomas sem apodrecer. O que é traduzido são os rótulos da seção (`sysTitle`, `sysDesc`, `sysProblem`, `sysBuilt`).
- **Nada de nome interno**: sistemas do cliente/empregador são descritos pela função que exercem ("o ERP da empresa", "o sistema legado"), nunca pelo nome de produto interno. Valores de política da empresa, nomes de pessoas, clientes, tabelas, endpoints e migrations ficam fora — o card conta a decisão de engenharia, não o dado da empresa.
