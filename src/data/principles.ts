// Camada de conteúdo — princípios ("como eu trabalho")
//
// Regra editorial: cada princípio precisa de UMA evidência concreta na
// descrição. "Clean code, SOLID, boas práticas" é o que todo mundo escreve;
// só vale o que o resto do site consegue sustentar.
// São exatamente 4 (o grid e `data.test.ts` contam com isso), nos 4 idiomas.
import type { Principle } from "@/types";

export const principles: Principle[] = [
  {
    icon: "📐",
    title: {
      pt: "Extrair antes de duplicar",
      en: "Extract before duplicating",
      es: "Extraer antes de duplicar",
      fr: "Extraire avant de dupliquer",
    },
    desc: {
      pt: "Na segunda vez que a mesma lógica aparece, ela vira serviço — não um segundo copy-paste. Foi assim que um motor de aprovações preso a um domínio virou a infraestrutura de quatro áreas.",
      en: "The second time the same logic shows up, it becomes a service — not a second copy-paste. That's how an approval engine stuck inside one domain became the infrastructure for four departments.",
      es: "La segunda vez que aparece la misma lógica, se vuelve un servicio — no un segundo copy-paste. Así un motor de aprobaciones atrapado en un dominio se convirtió en la infraestructura de cuatro áreas.",
      fr: "La deuxième fois que la même logique apparaît, elle devient un service — pas un deuxième copier-coller. C'est ainsi qu'un moteur d'approbations enfermé dans un domaine est devenu l'infrastructure de quatre services.",
    },
  },
  {
    icon: "🧪",
    title: {
      pt: "Teste onde o erro custa caro",
      en: "Test where mistakes are expensive",
      es: "Probar donde el error cuesta caro",
      fr: "Tester là où l'erreur coûte cher",
    },
    desc: {
      pt: "Cálculo de verba rescisória e autorização de chatbot não vão para produção no “testei na mão”: regressão contra dados reais, testes de injeção e de vazamento entre sessões, end-to-end nas telas críticas.",
      en: "Severance calculations and chatbot authorization don't go to production on “I tested it by hand”: regression against real data, injection and cross-session leakage tests, end-to-end on critical screens.",
      es: "El cálculo de una liquidación y la autorización de un chatbot no van a producción con un “lo probé a mano”: regresión contra datos reales, pruebas de inyección y de fuga entre sesiones, end-to-end en las pantallas críticas.",
      fr: "Un calcul d'indemnités de départ et l'autorisation d'un chatbot ne partent pas en production sur un « j'ai testé à la main » : régression sur données réelles, tests d'injection et de fuite entre sessions, end-to-end sur les écrans critiques.",
    },
  },
  {
    icon: "💰",
    title: {
      pt: "Custo sob controle",
      en: "Cost under control",
      es: "Costo bajo control",
      fr: "Des coûts maîtrisés",
    },
    desc: {
      pt: "Otimização que aparece na fatura, não no benchmark: consumo de tokens de IA cortado em cerca de 90% por fluxo de conversa, e uma consulta em linguagem natural que caiu de sete chamadas para duas.",
      en: "Optimization that shows up on the bill, not in a benchmark: AI token usage cut by about 90% per conversation flow, and a natural-language query that went from seven calls to two.",
      es: "Optimización que se ve en la factura, no en el benchmark: consumo de tokens de IA reducido cerca de un 90% por flujo de conversación, y una consulta en lenguaje natural que pasó de siete llamadas a dos.",
      fr: "Une optimisation qui se voit sur la facture, pas dans un benchmark : consommation de tokens d'IA réduite d'environ 90 % par flux de conversation, et une requête en langage naturel passée de sept appels à deux.",
    },
  },
  {
    icon: "📄",
    title: {
      pt: "Decisão documentada",
      en: "Documented decisions",
      es: "Decisiones documentadas",
      fr: "Des décisions documentées",
    },
    desc: {
      pt: "Escrevo o porquê junto com o código — incluindo o que ficou fora do escopo e o que ainda não está resolvido. Limitação registrada custa menos que limitação descoberta em produção.",
      en: "I write the why alongside the code — including what was left out of scope and what is still unresolved. A recorded limitation costs less than one discovered in production.",
      es: "Escribo el porqué junto al código — incluido lo que quedó fuera del alcance y lo que aún no está resuelto. Una limitación registrada cuesta menos que una descubierta en producción.",
      fr: "J'écris le pourquoi avec le code — y compris ce qui est resté hors périmètre et ce qui n'est pas encore résolu. Une limite consignée coûte moins cher qu'une limite découverte en production.",
    },
  },
];
