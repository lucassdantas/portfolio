// Camada de conteúdo — Política de Privacidade (LGPD)
export interface PrivacySection {
  title: string;
  body: string[];
}

export const privacyPolicy: {
  updatedAt: string;
  intro: string;
  sections: PrivacySection[];
} = {
  updatedAt: "julho/2026",
  intro:
    "Este site é o portfólio pessoal de Lucas Dantas. Levo a sua privacidade a sério e, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018), explico abaixo quais dados são tratados ao navegar por aqui.",
  sections: [
    {
      title: "1. Dados coletados",
      body: [
        "Este site não possui formulários de cadastro, login ou coleta direta de dados pessoais. Nenhum dado pessoal identificável é armazenado em servidores próprios.",
        "As preferências de tema (claro/escuro) e idioma são salvas apenas no seu navegador (localStorage) e nunca saem do seu dispositivo.",
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
};
