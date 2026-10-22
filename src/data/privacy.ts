// Camada de conteúdo — Política de Privacidade (LGPD), nos 4 idiomas.
// Mudou o que o site trata (formulário, analytics, novo serviço de terceiro)?
// Atualize as QUATRO versões e a data de `updated`.
import type { Lang } from "@/types";

export interface PrivacySection {
  title: string;
  body: string[];
}

export interface PrivacyPolicy {
  /** Linha completa exibida sob o título, já com a data. */
  updated: string;
  intro: string;
  sections: PrivacySection[];
}

export const privacyPolicy: Record<Lang, PrivacyPolicy> = {
  pt: {
    updated: "última atualização: outubro/2026",
    intro:
      "Este site é o portfólio pessoal de Lucas Dantas. Levo a sua privacidade a sério e, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018), explico abaixo quais dados são tratados ao navegar por aqui.",
    sections: [
      {
        title: "1. Dados coletados",
        body: [
          "Este site não possui formulários de cadastro, login ou coleta direta de dados pessoais. Nenhum dado pessoal identificável é armazenado em servidores próprios.",
          "A sua preferência de idioma é salva apenas no seu navegador (localStorage) e nunca sai do seu dispositivo.",
          "O assistente de chat (chatbot) deste site é determinístico — uma máquina de estados finitos (FSM), sem IA/LLM — e roda inteiramente no seu navegador: o nome que você informa e o histórico da conversa ficam salvos apenas no seu localStorage, nunca são enviados a nenhum servidor, e são apagados automaticamente após 1 hora sem interação.",
        ],
      },
      {
        title: "2. Cookies e serviços de terceiros",
        body: [
          "Google AdSense: este site pode exibir anúncios do Google AdSense, que utiliza cookies para personalização e medição de anúncios, conforme as políticas do Google. Você pode gerenciar a personalização de anúncios em adssettings.google.com.",
          "API do GitHub: a seção de estatísticas consulta a API pública do GitHub (api.github.com) para exibir dados públicos do perfil do autor. Nenhum dado seu é enviado nessa consulta.",
          "Fontes do Google (Google Fonts) são servidas de forma otimizada pelo próprio site via Next.js, sem requisições do seu navegador aos servidores do Google.",
        ],
      },
      {
        title: "3. Seus direitos (LGPD)",
        body: [
          "Nos termos do art. 18 da LGPD, você tem direito a confirmação de tratamento, acesso, correção, anonimização, portabilidade e eliminação de dados pessoais, entre outros.",
          "Como este site não armazena dados pessoais em servidores próprios, o exercício desses direitos se aplica principalmente aos serviços de terceiros citados acima, diretamente junto a eles.",
        ],
      },
      {
        title: "4. Contato",
        body: [
          "Para qualquer dúvida sobre privacidade ou solicitação relacionada a dados, entre em contato pelo LinkedIn: linkedin.com/in/lucas-de-sousa-dantas.",
        ],
      },
      {
        title: "5. Alterações",
        body: [
          "Esta política pode ser atualizada a qualquer momento para refletir mudanças no site ou na legislação. A data da última atualização consta no topo deste documento.",
        ],
      },
    ],
  },
  en: {
    updated: "last updated: October 2026",
    intro:
      "This website is Lucas Dantas's personal portfolio. I take your privacy seriously and, in compliance with Brazil's General Data Protection Law (LGPD — Law No. 13,709/2018), I explain below what data is processed while you browse here.",
    sections: [
      {
        title: "1. Data collected",
        body: [
          "This website has no sign-up forms, login or direct collection of personal data. No personally identifiable data is stored on servers of its own.",
          "Your language preference is saved only in your browser (localStorage) and never leaves your device.",
          "The chat assistant (chatbot) on this site is deterministic — a finite state machine (FSM), with no AI/LLM — and runs entirely in your browser: the name you enter and the conversation history are saved only in your localStorage, are never sent to any server, and are deleted automatically after 1 hour of inactivity.",
        ],
      },
      {
        title: "2. Cookies and third-party services",
        body: [
          "Google AdSense: this site may display Google AdSense ads, which use cookies for ad personalization and measurement, according to Google's policies. You can manage ad personalization at adssettings.google.com.",
          "GitHub API: the statistics section queries the public GitHub API (api.github.com) to show public data from the author's profile. None of your data is sent in this request.",
          "Google Fonts are served in an optimized way by the site itself via Next.js, with no requests from your browser to Google's servers.",
        ],
      },
      {
        title: "3. Your rights (LGPD)",
        body: [
          "Under article 18 of the LGPD, you have the right to confirmation of processing, access, correction, anonymization, portability and deletion of personal data, among others.",
          "Since this site does not store personal data on servers of its own, exercising these rights applies mainly to the third-party services listed above, directly with them.",
        ],
      },
      {
        title: "4. Contact",
        body: [
          "For any privacy question or data-related request, get in touch on LinkedIn: linkedin.com/in/lucas-de-sousa-dantas.",
        ],
      },
      {
        title: "5. Changes",
        body: [
          "This policy may be updated at any time to reflect changes to the site or to the law. The date of the last update appears at the top of this document.",
        ],
      },
    ],
  },
  es: {
    updated: "última actualización: octubre de 2026",
    intro:
      "Este sitio es el portafolio personal de Lucas Dantas. Me tomo en serio tu privacidad y, en cumplimiento de la Ley General de Protección de Datos de Brasil (LGPD — Ley n.º 13.709/2018), explico a continuación qué datos se tratan al navegar por aquí.",
    sections: [
      {
        title: "1. Datos recopilados",
        body: [
          "Este sitio no tiene formularios de registro, inicio de sesión ni recopilación directa de datos personales. Ningún dato personal identificable se almacena en servidores propios.",
          "Tu preferencia de idioma se guarda solo en tu navegador (localStorage) y nunca sale de tu dispositivo.",
          "El asistente de chat (chatbot) de este sitio es determinista — una máquina de estados finitos (FSM), sin IA/LLM — y funciona íntegramente en tu navegador: el nombre que indicas y el historial de la conversación se guardan solo en tu localStorage, nunca se envían a ningún servidor y se borran automáticamente tras 1 hora sin interacción.",
        ],
      },
      {
        title: "2. Cookies y servicios de terceros",
        body: [
          "Google AdSense: este sitio puede mostrar anuncios de Google AdSense, que utiliza cookies para la personalización y medición de anuncios, conforme a las políticas de Google. Puedes gestionar la personalización de anuncios en adssettings.google.com.",
          "API de GitHub: la sección de estadísticas consulta la API pública de GitHub (api.github.com) para mostrar datos públicos del perfil del autor. Ninguno de tus datos se envía en esa consulta.",
          "Las fuentes de Google (Google Fonts) las sirve el propio sitio de forma optimizada mediante Next.js, sin solicitudes de tu navegador a los servidores de Google.",
        ],
      },
      {
        title: "3. Tus derechos (LGPD)",
        body: [
          "Según el art. 18 de la LGPD, tienes derecho a la confirmación del tratamiento, al acceso, corrección, anonimización, portabilidad y eliminación de datos personales, entre otros.",
          "Como este sitio no almacena datos personales en servidores propios, el ejercicio de esos derechos se aplica principalmente a los servicios de terceros mencionados arriba, directamente ante ellos.",
        ],
      },
      {
        title: "4. Contacto",
        body: [
          "Para cualquier duda sobre privacidad o solicitud relacionada con datos, ponte en contacto por LinkedIn: linkedin.com/in/lucas-de-sousa-dantas.",
        ],
      },
      {
        title: "5. Cambios",
        body: [
          "Esta política puede actualizarse en cualquier momento para reflejar cambios en el sitio o en la legislación. La fecha de la última actualización figura al inicio de este documento.",
        ],
      },
    ],
  },
  fr: {
    updated: "dernière mise à jour : octobre 2026",
    intro:
      "Ce site est le portfolio personnel de Lucas Dantas. Je prends votre vie privée au sérieux et, conformément à la loi brésilienne sur la protection des données (LGPD — loi n° 13.709/2018), j'explique ci-dessous quelles données sont traitées lorsque vous naviguez ici.",
    sections: [
      {
        title: "1. Données collectées",
        body: [
          "Ce site ne comporte ni formulaire d'inscription, ni connexion, ni collecte directe de données personnelles. Aucune donnée personnelle identifiable n'est stockée sur des serveurs propres.",
          "Votre préférence de langue est enregistrée uniquement dans votre navigateur (localStorage) et ne quitte jamais votre appareil.",
          "L'assistant de chat (chatbot) de ce site est déterministe — une machine à états finis (FSM), sans IA/LLM — et fonctionne entièrement dans votre navigateur : le prénom que vous indiquez et l'historique de la conversation sont enregistrés uniquement dans votre localStorage, ne sont jamais envoyés à un serveur et sont supprimés automatiquement après 1 heure d'inactivité.",
        ],
      },
      {
        title: "2. Cookies et services tiers",
        body: [
          "Google AdSense : ce site peut afficher des annonces Google AdSense, qui utilise des cookies pour la personnalisation et la mesure des annonces, conformément aux règles de Google. Vous pouvez gérer la personnalisation des annonces sur adssettings.google.com.",
          "API GitHub : la section statistiques interroge l'API publique de GitHub (api.github.com) pour afficher des données publiques du profil de l'auteur. Aucune de vos données n'est envoyée lors de cette requête.",
          "Les polices Google (Google Fonts) sont servies de façon optimisée par le site lui-même via Next.js, sans requête de votre navigateur vers les serveurs de Google.",
        ],
      },
      {
        title: "3. Vos droits (LGPD)",
        body: [
          "En vertu de l'article 18 de la LGPD, vous disposez notamment d'un droit de confirmation du traitement, d'accès, de rectification, d'anonymisation, de portabilité et de suppression des données personnelles.",
          "Ce site ne stockant pas de données personnelles sur des serveurs propres, l'exercice de ces droits concerne principalement les services tiers cités ci-dessus, directement auprès d'eux.",
        ],
      },
      {
        title: "4. Contact",
        body: [
          "Pour toute question sur la confidentialité ou toute demande liée aux données, contactez-moi sur LinkedIn : linkedin.com/in/lucas-de-sousa-dantas.",
        ],
      },
      {
        title: "5. Modifications",
        body: [
          "Cette politique peut être mise à jour à tout moment pour refléter des changements du site ou de la législation. La date de la dernière mise à jour figure en haut de ce document.",
        ],
      },
    ],
  },
};
