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
// Destaque `**termo**` (src/lib/richText.ts): no máximo um por parágrafo,
// sempre sobre o resultado ou a decisão — nunca sobre a tecnologia.
import type { SystemCase } from "@/types";

export const systems: SystemCase[] = [
  {
    domain: "plataforma · motor de aprovações",
    title: "Um motor de fluxos para toda a empresa",
    problem:
      "Todo processo de aprovação da empresa nascia como sistema novo — a mesma sequência de etapas, o mesmo responsável por etapa, o mesmo anexo obrigatório, reescritos do zero a cada área que pedia.",
    built:
      "Extraí o motor de dentro do primeiro domínio que o usava e transformei em infraestrutura: etapas reutilizáveis entre fluxos, responsável resolvido dinamicamente (cargo, perfil ou hierarquia) e condições de execução registráveis como ponto de extensão — a regra que decide se uma etapa roda deixou de ser um condicional escondido no controller.",
    result:
      "Hoje **quatro áreas rodam no mesmo motor**. Processo novo virou configuração em tela de administração, não desenvolvimento.",
    tech: ["Laravel", "SQL Server", "PHPUnit"],
  },
  {
    domain: "rh · fluxo crítico",
    title: "Desligamento de ponta a ponta",
    problem:
      "O desligamento de um funcionário vivia em planilha, e-mail e conversa. Cada motivo de saída exige um caminho de aprovação, documentos e cálculo de verbas diferentes — e ninguém sabia em que etapa o processo estava, quem o estava travando, nem quanto a rescisão ia custar antes de decidir.",
    built:
      "Chamado especializado com **sete caminhos de aprovação**, um por motivo de saída: documentos exigidos por caminho, geração automática dos documentos já preenchidos, aprovação de diretoria condicionada ao valor simulado, lembrete diário para quem está travando a etapa e histórico completo de quem aprovou o quê, quando e com qual justificativa.",
    result:
      "A simulação replica linha a linha a planilha de referência do RH, com memória de cálculo persistida e teste de regressão contra dados reais — o custo passou a ser conhecido **antes** da decisão, não depois.",
    tech: ["Laravel", "SQL Server", "Blade", "PHPUnit"],
  },
  {
    domain: "operação · estoque hospitalar",
    title: "Saldo de insumos com fonte de verdade única",
    problem:
      "O saldo de insumos das centrais de esterilização existia só dentro do ERP, rastreado por lote — e o lote registrado divergia do lote que chegava fisicamente na unidade. Resultado: saldo divergente, baixa atrasada e ninguém com resposta para o porquê.",
    built:
      "Novo controle de movimentação e saldo mensal com carry-over, rastreio pelo **código do produto no lugar do lote**, transferência entre unidades numa única operação, inventário por contagem feita na própria tela e baixa por leitura de QR code.",
    result:
      "A regra de acumulação saiu do SQL para uma função pura — foi assim que o bug de saldo mais difícil do projeto (mês sem movimento quebrando o acumulado) virou caso de teste em vez de reincidência.",
    tech: ["Laravel", "SQL Server", "JavaScript", "PHPUnit"],
  },
  {
    domain: "ia · atendimento interno",
    title: "Assistentes de WhatsApp com a IA sob controle",
    problem:
      "Um assistente que entrega contracheque e abre chamado em nome do funcionário é superfície de ataque real — e um modelo de linguagem erra. Deixar a decisão de negócio para o modelo era o caminho fácil e o errado.",
    built:
      "Arquitetura multi-agente: vários assistentes na mesma aplicação, cada um com base de conhecimento, histórico e sessão isolados. A superfície onde a IA pode errar foi **reduzida de propósito** — motivo de chamado sempre por menu, escalonamento sempre por contador determinístico, IA apenas redigindo texto e sempre com confirmação humana antes de qualquer escrita.",
    result:
      "Suíte de testes de segurança dedicada (injeção, bypass de autorização, vazamento entre sessões) e uma chave que desliga a abertura automática de chamado sem derrubar o serviço.",
    tech: ["Python", "FastAPI", "LangChain", "PostgreSQL", "Redis", "Pytest"],
  },
  {
    domain: "modernização · frontend",
    title: "31 telas fora do legado",
    problem:
      "Um sistema em PHP e jQuery da metade da década passada, sendo substituído tela a tela, sem poder parar a operação um dia sequer.",
    built:
      "**31 telas migradas** para Next.js e TypeScript — cada uma com rota de API, teste end-to-end e documentação. Migrar não é copiar: cada tela exigiu descobrir o comportamento não documentado da versão antiga e decidir, campo a campo, o que replicar, o que corrigir e o que descartar.",
    result:
      "Fechei a leva com uma auditoria de paridade contra o legado, campo por campo e ação por ação — e o que tinha ficado de fora entrou.",
    tech: ["Next.js", "TypeScript", "Cypress", "Vitest", "Laravel"],
  },
  {
    domain: "ia · consulta ao sistema",
    title: "O sistema respondendo em linguagem natural",
    problem:
      "Responder “quanto faturamos no mês passado neste cliente?” exigia abrir o sistema, saber em qual tela olhar e cruzar o resultado à mão.",
    built:
      "Servidor MCP expondo um catálogo curado de telas e endpoints, com autorização por setor e **negação por padrão**: o que não foi curado e revisado não aparece para ninguém, em vez de vazar por omissão.",
    result:
      "Uma rota de consulta desenhada para o formato da pergunta cortou em **71%** as chamadas necessárias por consulta — de sete para duas.",
    tech: ["TypeScript", "MCP", "OpenAPI"],
  },
];
