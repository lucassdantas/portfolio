// Camada de conteúdo — "sistemas em produção" (SystemsSection)
//
// Regra editorial desta seção:
// cada card é uma ENTREGA DE PLATAFORMA, não uma tecnologia. A ordem é
// problema → o que foi construído → o que mudou. Se o card não consegue
// dizer o que existia antes, ele não entra aqui: vira bullet de experiência.
//
// Confidencialidade: nomes internos de sistemas, valores de política da
// empresa, nomes de pessoas/clientes/tabelas e detalhes de endpoint ficam
// fora — os domínios são descritos pela função que exercem.
//
// Todo texto nos 4 idiomas (pt/en/es/fr). `stat`, `before` e `after` são a
// camada de leitura rápida do card (número + antes/depois); o número só pode
// vir de um fato já escrito em `problem`/`built`/`result`.
// Destaque `**termo**`
// (src/lib/richText.ts): no máximo um por parágrafo, sempre sobre o
// resultado ou a decisão — nunca sobre a tecnologia — e no mesmo trecho
// em todos os idiomas.
import type { SystemCase } from "@/types";

export const systems: SystemCase[] = [
  {
    domain: {
      pt: "plataforma · motor de aprovações",
      en: "platform · approval engine",
      es: "plataforma · motor de aprobaciones",
      fr: "plateforme · moteur d'approbations",
    },
    title: {
      pt: "Um motor de fluxos para toda a empresa",
      en: "One workflow engine for the whole company",
      es: "Un motor de flujos para toda la empresa",
      fr: "Un moteur de workflows pour toute l'entreprise",
    },
    stat: {
      value: "4",
      label: {
        pt: "áreas rodando no mesmo motor",
        en: "departments on the same engine",
        es: "áreas sobre el mismo motor",
        fr: "services sur le même moteur",
      },
    },
    before: {
      pt: "Cada área pedia um sistema de aprovação novo",
      en: "Every department asked for a new approval system",
      es: "Cada área pedía un sistema de aprobación nuevo",
      fr: "Chaque service réclamait un nouveau système d'approbation",
    },
    after: {
      pt: "Processo novo vira configuração em tela",
      en: "A new process is just configuration on screen",
      es: "Un proceso nuevo es configuración en pantalla",
      fr: "Un nouveau processus devient de la configuration à l'écran",
    },
    problem: {
      pt: "Todo processo de aprovação da empresa nascia como sistema novo — a mesma sequência de etapas, o mesmo responsável por etapa, o mesmo anexo obrigatório, reescritos do zero a cada área que pedia.",
      en: "Every approval process in the company was born as a new system — the same sequence of steps, the same owner per step, the same mandatory attachment, rewritten from scratch for each department that asked.",
      es: "Cada proceso de aprobación de la empresa nacía como un sistema nuevo — la misma secuencia de etapas, el mismo responsable por etapa, el mismo adjunto obligatorio, reescritos desde cero para cada área que lo pedía.",
      fr: "Chaque processus d'approbation de l'entreprise naissait comme un nouveau système — la même suite d'étapes, le même responsable par étape, la même pièce jointe obligatoire, réécrits de zéro pour chaque service qui en faisait la demande.",
    },
    built: {
      pt: "Extraí o motor de dentro do primeiro domínio que o usava e transformei em infraestrutura: etapas reutilizáveis entre fluxos, responsável resolvido dinamicamente (cargo, perfil ou hierarquia) e condições de execução registráveis como ponto de extensão — a regra que decide se uma etapa roda deixou de ser um condicional escondido no controller.",
      en: "I extracted the engine from the first domain that used it and turned it into infrastructure: steps reusable across workflows, owners resolved dynamically (role, profile or hierarchy) and execution conditions registered as extension points — the rule that decides whether a step runs stopped being a conditional hidden in the controller.",
      es: "Extraje el motor del primer dominio que lo usaba y lo convertí en infraestructura: etapas reutilizables entre flujos, responsable resuelto dinámicamente (cargo, perfil o jerarquía) y condiciones de ejecución registrables como punto de extensión — la regla que decide si una etapa se ejecuta dejó de ser un condicional escondido en el controller.",
      fr: "J'ai extrait le moteur du premier domaine qui l'utilisait pour en faire une infrastructure : étapes réutilisables d'un workflow à l'autre, responsable déterminé dynamiquement (poste, profil ou hiérarchie) et conditions d'exécution enregistrables comme points d'extension — la règle qui décide si une étape s'exécute n'est plus une condition cachée dans le contrôleur.",
    },
    result: {
      pt: "**Quatro áreas** passaram a rodar no mesmo motor. Processo novo virou configuração em tela de administração, não desenvolvimento.",
      en: "**Four departments** came to run on the same engine. A new process became configuration in an admin screen, not development.",
      es: "**Cuatro áreas** pasaron a funcionar sobre el mismo motor. Un proceso nuevo se volvió configuración en una pantalla de administración, no desarrollo.",
      fr: "**Quatre services** tournent désormais sur le même moteur. Un nouveau processus est devenu de la configuration dans un écran d'administration, pas du développement.",
    },
    tech: ["Laravel", "SQL Server", "PHPUnit"],
  },
  {
    domain: {
      pt: "rh · fluxo crítico",
      en: "hr · critical workflow",
      es: "rr. hh. · flujo crítico",
      fr: "rh · processus critique",
    },
    title: {
      pt: "Desligamento de ponta a ponta",
      en: "Offboarding end to end",
      es: "Desvinculación de punta a punta",
      fr: "Départ d'un salarié, de bout en bout",
    },
    stat: {
      value: "7",
      label: {
        pt: "caminhos de aprovação, um por motivo",
        en: "approval paths, one per exit reason",
        es: "caminos de aprobación, uno por motivo",
        fr: "circuits d'approbation, un par motif",
      },
    },
    before: {
      pt: "Planilha, e-mail e ninguém sabia o custo",
      en: "Spreadsheets, email and no one knew the cost",
      es: "Planillas, correos y nadie sabía el costo",
      fr: "Tableurs, e-mails et personne ne connaissait le coût",
    },
    after: {
      pt: "Fluxo rastreável, custo conhecido antes de decidir",
      en: "Traceable flow, cost known before deciding",
      es: "Flujo trazable, costo conocido antes de decidir",
      fr: "Processus traçable, coût connu avant de décider",
    },
    problem: {
      pt: "O desligamento de um funcionário vivia em planilha, e-mail e conversa. Cada motivo de saída exige um caminho de aprovação, documentos e cálculo de verbas diferentes — e ninguém sabia em que etapa o processo estava, quem o estava travando, nem quanto a rescisão ia custar antes de decidir.",
      en: "An employee's offboarding lived in spreadsheets, email and hallway conversations. Each exit reason requires a different approval path, documents and severance calculation — and nobody knew which step the process was at, who was holding it up, or how much the termination would cost before deciding.",
      es: "La desvinculación de un empleado vivía en planillas, correos y conversaciones. Cada motivo de salida exige un camino de aprobación, documentos y cálculo de liquidación distintos — y nadie sabía en qué etapa estaba el proceso, quién lo estaba trabando ni cuánto iba a costar la desvinculación antes de decidir.",
      fr: "Le départ d'un salarié vivait dans des tableurs, des e-mails et des conversations. Chaque motif de départ exige un circuit d'approbation, des documents et un calcul d'indemnités différents — et personne ne savait à quelle étape en était le dossier, qui le bloquait, ni combien le départ allait coûter avant de décider.",
    },
    built: {
      pt: "Chamado especializado com **sete caminhos de aprovação**, um por motivo de saída: documentos exigidos por caminho, geração automática dos documentos já preenchidos, aprovação de diretoria condicionada ao valor simulado, lembrete diário para quem está travando a etapa e histórico completo de quem aprovou o quê, quando e com qual justificativa.",
      en: "A dedicated ticket type with **seven approval paths**, one per exit reason: required documents per path, automatic generation of pre-filled documents, board approval tied to the simulated amount, a daily reminder to whoever is holding up the step and a full history of who approved what, when and with what justification.",
      es: "Ticket especializado con **siete caminos de aprobación**, uno por motivo de salida: documentos exigidos por camino, generación automática de los documentos ya completados, aprobación de dirección condicionada al valor simulado, recordatorio diario para quien traba la etapa e historial completo de quién aprobó qué, cuándo y con qué justificación.",
      fr: "Un ticket dédié avec **sept circuits d'approbation**, un par motif de départ : documents exigés par circuit, génération automatique des documents pré-remplis, validation de la direction conditionnée au montant simulé, rappel quotidien à la personne qui bloque l'étape et historique complet de qui a approuvé quoi, quand et avec quelle justification.",
    },
    result: {
      pt: "A simulação replica linha a linha a planilha de referência do RH, com memória de cálculo persistida e teste de regressão contra dados reais — o custo passou a ser conhecido **antes** da decisão, não depois.",
      en: "The simulation matches HR's reference spreadsheet line by line, with a persisted calculation breakdown and regression tests against real data — the cost became known **before** the decision, not after.",
      es: "La simulación replica línea por línea la planilla de referencia de RR. HH., con memoria de cálculo persistida y pruebas de regresión contra datos reales — el costo pasó a conocerse **antes** de la decisión, no después.",
      fr: "La simulation reproduit ligne par ligne le tableur de référence des RH, avec le détail du calcul conservé et des tests de régression sur données réelles — le coût est désormais connu **avant** la décision, pas après.",
    },
    tech: ["Laravel", "SQL Server", "Blade", "PHPUnit"],
  },
  {
    domain: {
      pt: "operação · estoque hospitalar",
      en: "operations · hospital inventory",
      es: "operación · inventario hospitalario",
      fr: "opérations · stock hospitalier",
    },
    title: {
      pt: "Saldo de insumos com fonte de verdade única",
      en: "Supply balances with a single source of truth",
      es: "Saldo de insumos con una única fuente de verdad",
      fr: "Des stocks de fournitures avec une source de vérité unique",
    },
    stat: {
      value: "1",
      label: {
        pt: "fonte de verdade para o saldo",
        en: "source of truth for the balance",
        es: "fuente de verdad para el saldo",
        fr: "source de vérité pour le stock",
      },
    },
    before: {
      pt: "Saldo divergente, rastreado por um lote instável",
      en: "Mismatched balance, tracked by an unstable batch",
      es: "Saldo divergente, rastreado por un lote inestable",
      fr: "Stock incohérent, suivi par un lot instable",
    },
    after: {
      pt: "Saldo mensal rastreado pelo código do produto",
      en: "Monthly balance tracked by product code",
      es: "Saldo mensual rastreado por código de producto",
      fr: "Solde mensuel suivi par code produit",
    },
    problem: {
      pt: "O saldo de insumos das centrais de esterilização existia só dentro do ERP, rastreado por lote — e o lote registrado divergia do lote que chegava fisicamente na unidade. Resultado: saldo divergente, baixa atrasada e ninguém com resposta para o porquê.",
      en: "The supply balance of the sterile processing centers existed only inside the ERP, tracked by batch — and the recorded batch didn't match the batch that physically arrived at the unit. The result: mismatched balances, late write-offs and nobody able to explain why.",
      es: "El saldo de insumos de las centrales de esterilización existía solo dentro del ERP, rastreado por lote — y el lote registrado no coincidía con el lote que llegaba físicamente a la unidad. Resultado: saldo divergente, bajas atrasadas y nadie con una respuesta para el porqué.",
      fr: "Le stock de fournitures des centrales de stérilisation n'existait que dans l'ERP, suivi par lot — et le lot enregistré ne correspondait pas au lot qui arrivait physiquement sur site. Résultat : des stocks incohérents, des sorties en retard et personne pour expliquer pourquoi.",
    },
    built: {
      pt: "Novo controle de movimentação e saldo mensal com carry-over, rastreio pelo **código do produto no lugar do lote**, transferência entre unidades numa única operação, inventário por contagem feita na própria tela e baixa por leitura de QR code.",
      en: "New stock movement control and monthly balance with carry-over, tracking by **product code instead of batch**, transfers between units in a single operation, stock counts done right on screen and write-offs by scanning a QR code.",
      es: "Nuevo control de movimientos y saldo mensual con arrastre, seguimiento por el **código de producto en lugar del lote**, transferencia entre unidades en una sola operación, inventario por conteo hecho en la propia pantalla y baja por lectura de código QR.",
      fr: "Nouveau suivi des mouvements et solde mensuel reporté, traçabilité par le **code produit au lieu du lot**, transfert entre sites en une seule opération, inventaire par comptage directement à l'écran et sortie par lecture de QR code.",
    },
    result: {
      pt: "A regra de acumulação saiu do SQL para uma função pura — foi assim que o bug de saldo mais difícil do projeto (mês sem movimento quebrando o acumulado) virou caso de teste em vez de reincidência.",
      en: "The accumulation rule moved out of SQL into a pure function — that's how the project's hardest balance bug (a month with no movements breaking the running total) became a test case instead of a recurring issue.",
      es: "La regla de acumulación salió del SQL a una función pura — así el bug de saldo más difícil del proyecto (un mes sin movimientos rompiendo el acumulado) se volvió un caso de prueba en lugar de una reincidencia.",
      fr: "La règle de cumul est sortie du SQL pour devenir une fonction pure — c'est ainsi que le bug de stock le plus difficile du projet (un mois sans mouvement qui cassait le cumul) est devenu un cas de test plutôt qu'une récidive.",
    },
    tech: ["Laravel", "SQL Server", "JavaScript", "PHPUnit"],
  },
  {
    domain: {
      pt: "ia · atendimento interno",
      en: "ai · internal support",
      es: "ia · atención interna",
      fr: "ia · support interne",
    },
    title: {
      pt: "Assistentes de WhatsApp com a IA sob controle",
      en: "WhatsApp assistants with AI kept under control",
      es: "Asistentes de WhatsApp con la IA bajo control",
      fr: "Des assistants WhatsApp avec une IA sous contrôle",
    },
    stat: {
      value: "0",
      label: {
        pt: "escritas da IA sem confirmação humana",
        en: "AI writes without human confirmation",
        es: "escrituras de la IA sin confirmación humana",
        fr: "écritures de l'IA sans confirmation humaine",
      },
    },
    before: {
      pt: "IA decidindo sozinha com dados sensíveis",
      en: "AI deciding alone over sensitive data",
      es: "IA decidiendo sola con datos sensibles",
      fr: "Une IA qui décide seule sur des données sensibles",
    },
    after: {
      pt: "IA só redige; menu, regras e humano decidem",
      en: "AI only drafts; menus, rules and people decide",
      es: "La IA solo redacta; menú, reglas y personas deciden",
      fr: "L'IA rédige ; menus, règles et humains décident",
    },
    problem: {
      pt: "Um assistente que entrega contracheque e abre chamado em nome do funcionário é superfície de ataque real — e um modelo de linguagem erra. Deixar a decisão de negócio para o modelo era o caminho fácil e o errado.",
      en: "An assistant that hands out payslips and opens tickets on an employee's behalf is a real attack surface — and a language model makes mistakes. Leaving business decisions to the model was the easy path, and the wrong one.",
      es: "Un asistente que entrega recibos de sueldo y abre tickets en nombre del empleado es una superficie de ataque real — y un modelo de lenguaje se equivoca. Dejarle la decisión de negocio al modelo era el camino fácil, y el equivocado.",
      fr: "Un assistant qui délivre des fiches de paie et ouvre des tickets au nom d'un salarié est une vraie surface d'attaque — et un modèle de langage se trompe. Laisser la décision métier au modèle était la voie facile, et la mauvaise.",
    },
    built: {
      pt: "Arquitetura multi-agente: vários assistentes na mesma aplicação, cada um com base de conhecimento, histórico e sessão isolados. A superfície onde a IA pode errar foi **reduzida de propósito** — motivo de chamado sempre por menu, escalonamento sempre por contador determinístico, IA apenas redigindo texto e sempre com confirmação humana antes de qualquer escrita.",
      en: "Multi-agent architecture: several assistants in the same application, each with its own isolated knowledge base, history and session. The surface where AI can get things wrong was **deliberately shrunk** — ticket reason always picked from a menu, escalation always by a deterministic counter, AI only drafting text and always with human confirmation before any write.",
      es: "Arquitectura multiagente: varios asistentes en la misma aplicación, cada uno con base de conocimiento, historial y sesión aislados. La superficie donde la IA puede equivocarse se **redujo a propósito** — motivo del ticket siempre por menú, escalamiento siempre por contador determinista, la IA solo redactando texto y siempre con confirmación humana antes de cualquier escritura.",
      fr: "Architecture multi-agents : plusieurs assistants dans la même application, chacun avec sa base de connaissances, son historique et sa session isolés. La surface où l'IA peut se tromper a été **volontairement réduite** — motif du ticket toujours choisi dans un menu, escalade toujours par compteur déterministe, l'IA se limitant à rédiger du texte, toujours avec confirmation humaine avant toute écriture.",
    },
    result: {
      pt: "Suíte de testes de segurança dedicada (injeção, bypass de autorização, vazamento entre sessões) e uma chave que desliga a abertura automática de chamado sem derrubar o serviço.",
      en: "A dedicated security test suite (injection, authorization bypass, cross-session leakage) and a switch that turns off automatic ticket creation without taking the service down.",
      es: "Suite de pruebas de seguridad dedicada (inyección, bypass de autorización, fuga entre sesiones) y un interruptor que desactiva la apertura automática de tickets sin tumbar el servicio.",
      fr: "Une suite de tests de sécurité dédiée (injection, contournement d'autorisation, fuite entre sessions) et un interrupteur qui coupe l'ouverture automatique de tickets sans arrêter le service.",
    },
    tech: ["Python", "FastAPI", "LangChain", "PostgreSQL", "Redis", "Pytest"],
  },
  {
    domain: {
      pt: "modernização · frontend",
      en: "modernization · frontend",
      es: "modernización · frontend",
      fr: "modernisation · frontend",
    },
    title: {
      pt: "31 telas fora do legado",
      en: "31 screens out of the legacy system",
      es: "31 pantallas fuera del legado",
      fr: "31 écrans sortis du legacy",
    },
    stat: {
      value: "31",
      label: {
        pt: "telas migradas, cada uma com teste e2e",
        en: "screens migrated, each with an e2e test",
        es: "pantallas migradas, cada una con prueba e2e",
        fr: "écrans migrés, chacun avec un test e2e",
      },
    },
    before: {
      pt: "PHP + jQuery que não podia parar",
      en: "PHP + jQuery that couldn't stop",
      es: "PHP + jQuery que no podía detenerse",
      fr: "Du PHP + jQuery qui ne pouvait pas s'arrêter",
    },
    after: {
      pt: "Next.js + TypeScript com paridade auditada",
      en: "Next.js + TypeScript with audited parity",
      es: "Next.js + TypeScript con paridad auditada",
      fr: "Next.js + TypeScript avec parité auditée",
    },
    problem: {
      pt: "Um sistema em PHP e jQuery da metade da década passada, sendo substituído tela a tela, sem poder parar a operação um dia sequer.",
      en: "A PHP and jQuery system from the middle of the last decade, being replaced screen by screen without stopping operations for a single day.",
      es: "Un sistema en PHP y jQuery de mediados de la década pasada, reemplazado pantalla por pantalla sin poder detener la operación ni un solo día.",
      fr: "Un système en PHP et jQuery datant du milieu de la décennie précédente, remplacé écran par écran sans pouvoir arrêter l'activité un seul jour.",
    },
    built: {
      pt: "**31 telas migradas** para Next.js e TypeScript — cada uma com rota de API, teste end-to-end e documentação. Migrar não é copiar: cada tela exigiu descobrir o comportamento não documentado da versão antiga e decidir, campo a campo, o que replicar, o que corrigir e o que descartar.",
      en: "**31 screens migrated** to Next.js and TypeScript — each with an API route, an end-to-end test and documentation. Migrating isn't copying: every screen meant uncovering the old version's undocumented behavior and deciding, field by field, what to replicate, what to fix and what to drop.",
      es: "**31 pantallas migradas** a Next.js y TypeScript — cada una con ruta de API, prueba end-to-end y documentación. Migrar no es copiar: cada pantalla exigió descubrir el comportamiento no documentado de la versión anterior y decidir, campo por campo, qué replicar, qué corregir y qué descartar.",
      fr: "**31 écrans migrés** vers Next.js et TypeScript — chacun avec sa route d'API, son test end-to-end et sa documentation. Migrer n'est pas copier : chaque écran a demandé de découvrir le comportement non documenté de l'ancienne version et de décider, champ par champ, quoi reproduire, quoi corriger et quoi abandonner.",
    },
    result: {
      pt: "Fechei a leva com uma auditoria de paridade contra o legado, campo por campo e ação por ação — e o que tinha ficado de fora entrou.",
      en: "I closed the batch with a parity audit against the legacy system, field by field and action by action — and whatever had been left out went in.",
      es: "Cerré la tanda con una auditoría de paridad contra el legado, campo por campo y acción por acción — y lo que había quedado afuera entró.",
      fr: "J'ai clôturé le lot par un audit de parité face au legacy, champ par champ et action par action — et ce qui avait été oublié a été ajouté.",
    },
    tech: ["Next.js", "TypeScript", "Cypress", "Vitest", "Laravel"],
  },
  {
    domain: {
      pt: "ia · consulta ao sistema",
      en: "ai · querying the system",
      es: "ia · consulta al sistema",
      fr: "ia · interroger le système",
    },
    title: {
      pt: "O sistema respondendo em linguagem natural",
      en: "The system answering in natural language",
      es: "El sistema respondiendo en lenguaje natural",
      fr: "Le système qui répond en langage naturel",
    },
    stat: {
      value: "−71%",
      label: {
        pt: "chamadas por consulta (7 → 2)",
        en: "calls per query (7 → 2)",
        es: "llamadas por consulta (7 → 2)",
        fr: "appels par requête (7 → 2)",
      },
    },
    before: {
      pt: "Abrir telas e cruzar dados à mão",
      en: "Opening screens and cross-checking by hand",
      es: "Abrir pantallas y cruzar datos a mano",
      fr: "Ouvrir des écrans et recouper à la main",
    },
    after: {
      pt: "Pergunta em linguagem natural, negação por padrão",
      en: "Natural-language questions, deny by default",
      es: "Preguntas en lenguaje natural, denegación por defecto",
      fr: "Questions en langage naturel, refus par défaut",
    },
    problem: {
      pt: "Responder “quanto faturamos no mês passado neste cliente?” exigia abrir o sistema, saber em qual tela olhar e cruzar o resultado à mão.",
      en: "Answering “how much did we bill this client last month?” meant opening the system, knowing which screen to look at and cross-checking the result by hand.",
      es: "Responder “¿cuánto facturamos el mes pasado a este cliente?” exigía abrir el sistema, saber en qué pantalla mirar y cruzar el resultado a mano.",
      fr: "Répondre à « combien avons-nous facturé à ce client le mois dernier ? » obligeait à ouvrir le système, savoir quel écran consulter et recouper le résultat à la main.",
    },
    built: {
      pt: "Servidor MCP expondo um catálogo curado de telas e endpoints, com autorização por setor e **negação por padrão**: o que não foi curado e revisado não aparece para ninguém, em vez de vazar por omissão.",
      en: "An MCP server exposing a curated catalog of screens and endpoints, with per-department authorization and **deny by default**: anything not curated and reviewed is visible to no one, instead of leaking by omission.",
      es: "Servidor MCP que expone un catálogo curado de pantallas y endpoints, con autorización por sector y **denegación por defecto**: lo que no fue curado y revisado no aparece para nadie, en lugar de filtrarse por omisión.",
      fr: "Un serveur MCP exposant un catalogue curé d'écrans et d'endpoints, avec autorisation par service et **refus par défaut** : ce qui n'a pas été curé et relu n'apparaît pour personne, au lieu de fuiter par omission.",
    },
    result: {
      pt: "Uma rota de consulta desenhada para o formato da pergunta cortou em **71%** as chamadas necessárias por consulta — de sete para duas.",
      en: "A query route designed around the shape of the question cut the calls needed per query by **71%** — from seven to two.",
      es: "Una ruta de consulta diseñada según la forma de la pregunta redujo un **71%** las llamadas necesarias por consulta — de siete a dos.",
      fr: "Une route de requête pensée pour la forme de la question a réduit de **71 %** les appels nécessaires par requête — de sept à deux.",
    },
    tech: ["TypeScript", "MCP", "OpenAPI"],
  },
];
