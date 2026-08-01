// Camada de conteúdo — princípios ("como eu trabalho")
import type { Principle } from "@/types";

export const principles: Principle[] = [
  {
    icon: "📐",
    title: "Arquitetura consciente",
    desc: "System design, clean architecture, SOLID e padrões de projeto aplicados no dia a dia — decisões técnicas pensadas para durar, não para apagar incêndio.",
  },
  {
    icon: "💰",
    title: "Custo sob controle",
    desc: "Otimização que aparece na fatura: de queries SQL a consumo de tokens de IA reduzido em cerca de 90% num fluxo de chatbot.",
  },
  {
    icon: "⚙️",
    title: "Automação de processos",
    desc: "Se é repetitivo, vira automação: n8n, filas e mensageria, integrações e IA a serviço dos setores da empresa.",
  },
  {
    icon: "🎯",
    title: "Processo bem definido",
    desc: "Rituais ágeis, prazos coerentes, testes unitários/integração/regressão e CI/CD — previsibilidade da ideia ao deploy.",
  },
];
