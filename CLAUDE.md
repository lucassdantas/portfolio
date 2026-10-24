# CLAUDE.md

Portfólio one-page de Lucas Dantas (dev full stack). Next.js 16 (App Router) + React 19 + TypeScript + Tailwind 4. Docs completas em [docs/index.md](docs/index.md).

## Comandos

```bash
npm run dev        # dev server
npm run build      # build de produção
npm test           # vitest run (90 testes, unit + integração)
npm run test:watch
```

## Regra de ouro: conteúdo vive em src/data/

Textos, experiências, projetos, certificados, traduções e a política de privacidade estão em `src/data/*` (coleções tipadas por `src/types/index.ts`, estilo NoSQL). **Nunca hardcode conteúdo em componentes** — se um texto novo aparecer, ele entra em `src/data/` (e em `translations.ts` se for string de UI). Ver [docs/conteudo.md](docs/conteudo.md).

**Tudo que aparece na tela existe nos 4 idiomas (pt/en/es/fr)** — UI e conteúdo. Prosa é `Localized`/`LocalizedText` (`Record<Lang, …>`), data é `"AAAA-MM"` formatada por `src/lib/i18n.ts`, e `translations.ts` não tem spread sobre `pt`: idioma faltando é erro de compilação, e `data.test.ts` pega idioma vazio ou copiado do pt. Texto novo entra nos quatro de uma vez — nunca só em português.

Duas regras editoriais que os testes cobram:

- **`**termo**` no máximo duas vezes por texto** (bullet de experiência, parágrafo de `systems.ts`), sempre sobre o resultado ou a decisão — nunca sobre a tecnologia nem sobre a frase inteira.
- **Conteúdo sobre trabalho de cliente/empregador é genérico**: sistemas internos são descritos pela função ("o ERP da empresa", "o sistema legado"), nunca pelo nome de produto interno; valores de política, nomes de pessoas/clientes/tabelas/endpoints ficam fora. O texto conta a decisão de engenharia, não o dado da empresa.

## Arquitetura (resumo)

- `src/app/page.tsx` monta as seções na ordem do design; um client component por seção em `src/components/`. A numeração exibida (`01 —`, `02 —` …) é hardcoded no JSX de cada seção: inserir uma no meio obriga a renumerar as seguintes à mão, e a conferir se a `Navbar` ainda cabe no breakpoint `nav:`.
- `CaseSection` e `SystemsSection` são complementares e não devem se sobrepor: o case abre **um** trabalho em profundidade (com diagrama antes/depois); `SystemsSection` mostra a **largura** das outras entregas de plataforma, em cards problema → solução → resultado (`src/data/systems.ts`).
- Estado global mínimo: só `LanguageContext` (localStorage `ldp-lang`) — **o site é sempre dark, não existe mais tema claro/`ThemeContext`**. Estado de seção fica local; Navbar e Terminal se comunicam pelo evento global `TERMINAL_OPEN_EVENT` (botão `_shell` abre o terminal em tela cheia) em vez de um context novo.
- `src/lib/github.ts`: única fonte de fetch da API do GitHub (promise cacheada em módulo).
- `src/shaders/`: os três programas WebGL do site — `particles.ts` (campo de partículas de fundo), `core.ts` (núcleo raymarched da `CoreSection`) e `astronaut.ts` (astronauta raymarched da `OrbitSection`, interlúdio sem número antes do contato: seção de ~4,5 telas com palco sticky e barra de progresso; a coreografia — 3 tomadas (espaço, treliça escura, espaço) separadas por 2 transições (túnel neon, onda de choque) — é função do progresso da rolagem `uProg`; o canvas é transparente nas pontas para o céu entrar e sair por cima das partículas do site, sem corte). Mudar a matemática do shader é editar essas strings GLSL, não os componentes que os montam.
- Seções que se desenham sozinhas em tela cheia (`CoreSection`, `OrbitSection`) têm fundo próprio (opaco na Core; na Orbit, o céu do shader), só renderizam com a seção visível e usam `min-[1100px]:-mr-12 min-[1100px]:pr-20` para cobrir o respiro do `SectionRail` — sem isso as partículas de fundo aparecem numa faixa à direita.
- Legibilidade sobre as partículas: uma seção de leitura densa declara `data-pdim` (0..1) e o campo recua enquanto ela ocupa o meio da tela (`computeDim` em `particles.ts`); listas e blocos de texto pequeno ganham véu leve (`bg-bg/50`–`/55` + `backdrop-blur-[2px]`/`[3px]`) e títulos grandes um halo `textShadow` — a animação precisa continuar visível por trás, não some. Usam: `ProjectsSection` (0.75), `EducationSection` (0.7), `ContactSection` (0.7).
- Movimento (sem lib): `SmoothScroll` (inércia na roda do mouse, estilo Lenis; publica a velocidade em `--ld-vel`, que inclina `.ld-vel`), `MotionReveal` (títulos com cortina/clip-path e textos subindo do desfoque; prepara só com o navegador ocioso e nunca esconde o que já está na tela no carregamento — LCP) e `Reveal` (cards sobem crescendo, cantos se abrindo). Título recortado por clip-path tem área visível zero para o IntersectionObserver: observe o pai.
- Cena do astronauta tem velocidade máxima: `OrbitSection` limita o progresso a ~0,3/s (0,5 no toque) e o `SmoothScroll` segura a página a 820px/s dentro da `#orbita` — rolar "de maluco" não atravessa a coreografia; parar de rolar para a cena. O `dt` usado nesses limites é cortado em 34ms: o primeiro quadro depois que o shader compila chega com segundos de atraso e, sem o corte, virava um salto que jogava a cena para o fim (seção em branco, HUD sumido). A resolução do canvas cai após 4 quadros lentos seguidos e só sobe devagar.
- Botão de som (`SoundToggle`): alto-falante mudo + play com anel pulsando quando desligado; alto-falante com ondas + equalizador quando ligado. Sem texto — a dica está no `title`/`aria-label`.
- Contato é duas colunas: chamada à esquerda (uma cor, ponto final em azul) e cartão de status à direita (`ctStatus`, `ctRole`, `ctModel`, base, idiomas, links); o parágrafo `contactDesc` ficou só com a frase sobre como trabalho — cargo e modelo vivem no cartão, não duplicar.
- Trilha sonora: `src/lib/ambient.ts` gera a música ao vivo (Web Audio, sem arquivo): pad calmo no site todo e, a partir de intensidade 0,3, uma batida eletrônica (bumbo com sidechain nos acordes, clap, chimbal, baixo) que a `OrbitSection` liga durante o astronauta e desliga no fim. `SoundToggle` liga/desliga (desligada por padrão, preferência em `ldp-sound`, citada na política de privacidade). O Lucas aprovou a trilha calma — não trocar sem ele pedir. `site.ambientTrack` troca por um arquivo próprio em /public. O módulo só é baixado quando alguém liga o som.
- Abaixo da dobra, cada seção entra no `page.tsx` via `next/dynamic` dentro de um `<Suspense>`: o HTML vem do servidor e o React hidrata cada bloco **no lugar**, quando o código dele chega (hidratação seletiva, fatiada) — o script inicial fica só com o topo. Não trocar por esquema que recrie o DOM da seção ao rolar: cada recriação era uma travada de 50–70ms (já foi tentado com um `LazyHydrate` e removido). Componentes do topo (Navbar, Hero, Footer, contexto) importam `@/data/site` e `@/data/translations` direto — o barrel `@/data` puxaria todos os dados para o script inicial. Constantes de evento ficam em `src/lib/events.ts` pelo mesmo motivo.
- Seções de texto abaixo da dobra têm `content-visibility: auto` (globals.css): sem layout nem pintura até se aproximarem. Observadores de textos dentro delas recebem rect zerado no primeiro contato — `MotionReveal` espera a próxima resposta em vez de decidir.
- Nada de ler layout (`getBoundingClientRect`, `offsetTop`…) em laço de animação nem na montagem de muitos componentes: o laço das partículas só relê seções em scroll/resize/hidratação, e `Reveal`/`MotionReveal` decidem pelo IntersectionObserver. Antes disso "Style & Layout" passava de 1,5s no Lighthouse celular.
- Medir desempenho: `lighthouse` local varia ±10 pontos no celular entre rodadas; comparar medianas de 3+ rodadas, e usar o perfil de CPU (CDP Profiler com `Emulation.setCPUThrottlingRate 4`) para achar o culpado em vez de supor.
- Desempenho: seções pesadas fora do topo (`CoreSection`, `OrbitSection`, `Playground`, `ChatWidget`) entram por `next/dynamic` no `page.tsx`; shaders só compilam quando a seção chega a ~1 tela (IntersectionObserver com `rootMargin`), e a Orbit ajusta a resolução sozinha se o quadro passar de ~20ms. Mudança visual grande pede medir com Lighthouse (mediana de várias execuções — uma só varia demais).
- Seção atual: `src/lib/useActiveSection.ts` é a fonte única — a `Navbar` acende o link (sublinhado azul) e a `SectionRail` pinta o traço e mostra o nome da seção por ~2s ao entrar nela.
- Detalhes e decisões: [docs/arquitetura.md](docs/arquitetura.md).

## Design (redesign v3)

- O protótipo hi-fi que originou este redesign (bundle de artifact, HTML/CSS/JS compactados dentro) não está no repositório — vive fora, em `old_versions/` (gitignored, referência pessoal do autor). Se precisar consultá-lo, peça o arquivo; não é algo que uma sessão nova encontra no repo.
- Tokens são CSS vars em `globals.css`, expostos como utilities via `@theme inline`: `bg-bg`, `bg-bg2`, `bg-card`, `border-bord`, `text-txt`, `text-muted`, `text-strong`, `text-dim`, `text-accent`, `text-warm`, `text-ok`, `text-err`. `text-strong` é o meio-termo entre `muted` e `txt` (destaque dentro de texto muted, ver `src/lib/richText.ts`); `text-dim` é o piso de contraste do site (4.5:1 sobre `--bg`/`--bg2` — não usar cor mais escura que `--dim` sobre o fundo).
- Paleta (dark-only): `--bg:#0A0908`, `--bg2/--card:#0F0E0C`, `--border:#1E1C19`, `--text:#EDEAE5`, `--muted:#8A857D`, `--strong:#B5AFA6`, `--dim:#827C73`, `--accent:#1D94E3`, `--warm:#D7A45A`, `--ok:#22C55E`, `--err:#C05B4D`.
- Fontes: Schibsted Grotesk (corpo/títulos, `font-sans`) e DM Mono (labels/código, `font-mono`), via `next/font` — CSS vars `--font-schibsted`/`--font-dm-mono`.
- **Sempre dark** (o site inteiro já é dark, mas estes três continuam mais escuros que o fundo, de propósito): terminal, playground e o painel do case em destaque usam `#070605`/`#0F0E0C` fixos.
- Bordas de 1px (`border-bord`) no lugar de cards com sombra; grades usam `gap-px` + `bg-bord` para criar as linhas divisórias. Raio de borda nunca maior que 3px.
- Breakpoint da nav: variante custom `nav:` (1040px); abaixo disso, menu hambúrguer. Era 920px e subiu quando a nav passou a ter 7 links — link novo na nav pede reconferir esse valor. `SectionRail` (trilha vertical de seções) só aparece `≥1100px` (`min-[1100px]:`); nesse breakpoint o wrapper do `page.tsx` reserva `pr-12` para a trilha não cobrir conteúdo — ela ocupa só a largura das linhas (24px) e o rótulo aparece só em hover/foco, sem capturar clique.
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
