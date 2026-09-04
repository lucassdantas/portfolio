// Camada de conteúdo — princípios ("como eu trabalho")
//
// Regra editorial: cada princípio precisa de UMA evidência concreta na
// descrição. "Clean code, SOLID, boas práticas" é o que todo mundo escreve;
// só vale o que o resto do site consegue sustentar.
// São exatamente 4 (o grid e `data.test.ts` contam com isso).
import type { Principle } from "@/types";

export const principles: Principle[] = [
  {
    icon: "📐",
    title: "Extrair antes de duplicar",
    desc: "Na segunda vez que a mesma lógica aparece, ela vira serviço — não um segundo copy-paste. Foi assim que um motor de aprovações preso a um domínio virou a infraestrutura de quatro áreas.",
  },
  {
    icon: "🧪",
    title: "Teste onde o erro custa caro",
    desc: "Cálculo de verba rescisória e autorização de chatbot não vão para produção no “testei na mão”: regressão contra dados reais, testes de injeção e de vazamento entre sessões, end-to-end nas telas críticas.",
  },
  {
    icon: "💰",
    title: "Custo sob controle",
    desc: "Otimização que aparece na fatura, não no benchmark: consumo de tokens de IA cortado em cerca de 90% por fluxo de conversa, e uma consulta em linguagem natural que caiu de sete chamadas para duas.",
  },
  {
    icon: "📄",
    title: "Decisão documentada",
    desc: "Escrevo o porquê junto com o código — incluindo o que ficou fora do escopo e o que ainda não está resolvido. Limitação registrada custa menos que limitação descoberta em produção.",
  },
];
