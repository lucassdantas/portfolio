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
- **Todo texto visível existe nos 4 idiomas** (pt/en/es/fr). Prosa é `Localized` (lista de linhas por idioma — bullets, descrição de projeto) ou `LocalizedText` (uma string por idioma — cargo, título, parágrafo). Nome próprio (tecnologia, empresa, instituição, título oficial em inglês) fica `string`; onde um campo mistura os dois casos, o tipo é `Text` e o componente resolve com `tx()`. Data é `"AAAA-MM"` (`Period` = `{ start, end? }`, sem `end` = "atual") e cada idioma formata a sua. `data.test.ts` varre as coleções e falha se algum idioma estiver vazio, se uma lista traduzida tiver nº de itens diferente do pt ou se prosa for cópia literal do português.
- **Novo idioma**: adicione o código em `Lang` (`src/types`) e o compilador lista tudo que precisa ser escrito — o objeto completo em `translations.ts` (sem spread), cada campo localizado das coleções e os nomes de mês em `src/lib/i18n.ts`. Ele entra sozinho no seletor da nav e no comando `lang` do terminal via `LANGS`.
- **Descrição de projeto é traduzida e em linhas**: `desc` recebe `{ pt, en, es, fr }`, e cada idioma é uma **lista de linhas curtas** — cada item vira uma linha no card. Dentro da linha, `**termo**` marca destaque (renderizado em negrito na cor do texto por `src/lib/richText.ts`). Os 4 idiomas são obrigatórios no tipo. `data.test.ts` checa linha vazia, `**` sem fechamento e tradução que ficou como cópia literal do português. Bullets de experiência seguem a mesma regra, com o destaque sobre o mesmo trecho em todos os idiomas.
- **Categorias de projeto**: apenas `"Sistemas"` ou `"Sites"` (tipo `ProjectCategory`), traduzidas via `catSys`/`catSite` em `translations.ts`. Para criar outra, ajuste o tipo e essas chaves.
- **Carrossel de projetos**: `featured: true` decide quem entra no carrossel (`ProjectsSection`); os demais caem no índice compacto abaixo. Projeto sem `live`/`repo` precisa de `status: "internal" | "offline"` — sem isso o índice não sabe qual rótulo mostrar.
- **Destaque não é categoria**: use `featured: true` no projeto. Ele continua em Sistemas/Sites e também aparece no filtro "Destaques" — que é o filtro aberto por padrão, já que a lista completa é longa. Se fosse uma terceira categoria, destacar um projeto o tiraria da categoria dele.
- **Imagens dos cards**: exporte com ~800px de largura (o card exibe ~350px; 800 cobre telas 2x). Acima disso é peso morto — os cards usam `loading="lazy"`, mas o arquivo continua grande quando entra na viewport.
- **Comandos do terminal**: a lógica está em `src/components/Terminal.tsx` (função `runCmd`); os textos fixos que ele imprime ficam em `translations.ts` → `term`, e as respostas de `stack`, `exp`, `projects` e `books` derivam das coleções de dados no idioma ativo.

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

- **Nos 4 idiomas**, como o resto do conteúdo: `domain`, `title`, `problem`, `built` e `result` são `LocalizedText`. Ao editar um card, edite as quatro versões juntas.
- **Nada de nome interno**: sistemas do cliente/empregador são descritos pela função que exercem ("o ERP da empresa", "o sistema legado"), nunca pelo nome de produto interno. Valores de política da empresa, nomes de pessoas, clientes, tabelas, endpoints e migrations ficam fora — o card conta a decisão de engenharia, não o dado da empresa.
