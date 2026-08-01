// Camada de conteúdo — projetos
// `desc` é Localized: cada idioma recebe uma lista de linhas curtas, e
// dentro da linha `**termo**` marca destaque (ver src/lib/richText.ts).
import type { Project } from "@/types";

const IMG = "/assets/Projects/";

export const projects: Project[] = [
  {
    name: "Parceiros Rubraz",
    featured: true,
    cat: "Sistemas",
    desc: {
      pt: [
        "Calcula frete cruzando **distância (Google Maps API)** com as dimensões do produto.",
        "Backend próprio em **PHP + MySQL**: autenticação, recuperação de senha e envio de e-mail.",
        "Cadastro e painel do parceiro em **React**, com arquitetura fácil de manter.",
      ],
      en: [
        "Calculates shipping by crossing **distance (Google Maps API)** with product dimensions.",
        "Custom **PHP + MySQL** backend: authentication, password recovery and transactional email.",
        "Partner signup and dashboard in **React**, on a maintainable architecture.",
      ],
      es: [
        "Calcula el flete cruzando **distancia (Google Maps API)** con las dimensiones del producto.",
        "Backend propio en **PHP + MySQL**: autenticación, recuperación de contraseña y envío de correos.",
        "Registro y panel del socio en **React**, con una arquitectura fácil de mantener.",
      ],
      fr: [
        "Calcule la livraison en croisant **distance (API Google Maps)** et dimensions du produit.",
        "Backend maison en **PHP + MySQL** : authentification, récupération de mot de passe et e-mails.",
        "Inscription et tableau de bord partenaire en **React**, sur une architecture maintenable.",
      ],
    },
    img: IMG + "systems/rubraz-parceiros/versao-final/rubraz-parceiros-versao-final-tela.jpg",
    live: "https://rubrazlajes.com/parceiros",
    repo: "", // código de cliente
    tech: ["React", "TypeScript", "PHP", "MySQL"],
  },
  {
    name: "Área do Arquiteto — Trançarte",
    cat: "Sistemas",
    desc: {
      pt: [
        "**Ranking de arquitetos** por pontuação, conforme pedidos e tarefas concluídas.",
        "Upload, download e tratamento de **imagens e arquivos**.",
        "**PHP puro**, sem framework e sem nenhuma linha de IA.",
      ],
      en: [
        "**Architect ranking** by score, based on completed orders and tasks.",
        "Upload, download and handling of **images and files**.",
        "**Plain PHP** — no framework, not a single AI-written line.",
      ],
      es: [
        "**Ranking de arquitectos** por puntuación, según pedidos y tareas completadas.",
        "Subida, descarga y tratamiento de **imágenes y archivos**.",
        "**PHP puro**, sin framework y sin ninguna línea de IA.",
      ],
      fr: [
        "**Classement des architectes** par points, selon les commandes et tâches accomplies.",
        "Envoi, téléchargement et traitement des **images et fichiers**.",
        "**PHP pur**, sans framework et sans une seule ligne d'IA.",
      ],
    },
    img: IMG + "systems/trancarte-system/area-do-arquiteto-inicio.jpg",
    // sistema interno do cliente: endereço não é divulgado
    live: "",
    repo: "",
    tech: ["PHP", "MySQL"],
  },
  {
    name: "Calculadora ACAD Economia",
    featured: true,
    cat: "Sistemas",
    desc: {
      pt: [
        "Calculadora de economia para academias, com design reproduzido do **Figma**.",
        "Fluxo em **etapas condicionais**: cada resposta muda as perguntas seguintes.",
        "**Cálculo monetário** e envio do resultado por e-mail via backend próprio.",
      ],
      en: [
        "Savings calculator for gyms, with the design reproduced from **Figma**.",
        "**Conditional step flow**: each answer changes the questions that follow.",
        "**Monetary calculation** and result sent by email through a custom backend.",
      ],
      es: [
        "Calculadora de ahorro para gimnasios, con el diseño reproducido de **Figma**.",
        "Flujo por **etapas condicionales**: cada respuesta cambia las preguntas siguientes.",
        "**Cálculo monetario** y envío del resultado por correo mediante un backend propio.",
      ],
      fr: [
        "Calculateur d'économies pour salles de sport, maquette reproduite depuis **Figma**.",
        "Parcours en **étapes conditionnelles** : chaque réponse modifie les questions suivantes.",
        "**Calcul monétaire** et envoi du résultat par e-mail via un backend maison.",
      ],
    },
    img: IMG + "systems/calculadora-acad/calculadora-acad-main.jpg",
    live: "https://acadbrasil.com.br/calculadora-acad-economia/",
    repo: "",
    tech: ["Next.js", "TypeScript", "Tailwind", "Node.js"],
  },
  {
    name: "Categorizador de E-mails com IA",
    featured: true,
    cat: "Sistemas",
    desc: {
      pt: [
        "Classificador de e-mails para o **setor financeiro**: separa produtivos de improdutivos e sugere a resposta.",
        "IA via **Google Gemini**, com **fallback por palavras-chave (NLTK)** quando a API falha.",
        "Entrada por texto ou **upload de TXT/PDF**, em **Flask** com front em Tailwind.",
      ],
      en: [
        "Email classifier for the **financial sector**: sorts productive from unproductive and drafts the reply.",
        "AI via **Google Gemini**, with a **keyword fallback (NLTK)** when the API fails.",
        "Text input or **TXT/PDF upload**, on **Flask** with a Tailwind front end.",
      ],
      es: [
        "Clasificador de correos para el **sector financiero**: separa productivos de improductivos y sugiere la respuesta.",
        "IA vía **Google Gemini**, con **fallback por palabras clave (NLTK)** cuando la API falla.",
        "Entrada por texto o **subida de TXT/PDF**, en **Flask** con front en Tailwind.",
      ],
      fr: [
        "Classificateur d'e-mails pour le **secteur financier** : trie les productifs des improductifs et propose la réponse.",
        "IA via **Google Gemini**, avec un **repli par mots-clés (NLTK)** quand l'API échoue.",
        "Saisie texte ou **envoi de TXT/PDF**, en **Flask** avec un front en Tailwind.",
      ],
    },
    img: IMG + "systems/categorizador-emails/categorizador-emails-main.svg",
    // deploy de demonstração encerrado; código segue público
    live: "",
    repo: "https://github.com/lucassdantas/categorizador-de-emails-com-ia",
    tech: ["Python", "Flask", "Gemini API", "NLTK", "Tailwind"],
  },
  {
    name: "Fórum Breno Silva",
    cat: "Sistemas",
    desc: {
      pt: [
        "Fórum com **CRUD de posts** e rede de amizades (adicionar e remover).",
        "**Storage e upload de imagens** + área administrativa.",
        "**Coordenei a equipe** (design + 1 dev) e atendi o cliente.",
      ],
      en: [
        "Forum with **post CRUD** and a friend network (add and remove).",
        "**Image storage and upload** plus an admin area.",
        "**Led the team** (design + 1 dev) and handled the client directly.",
      ],
      es: [
        "Foro con **CRUD de publicaciones** y red de amistades (agregar y eliminar).",
        "**Almacenamiento y subida de imágenes** + área administrativa.",
        "**Coordiné al equipo** (diseño + 1 dev) y atendí al cliente.",
      ],
      fr: [
        "Forum avec **CRUD des publications** et réseau d'amis (ajout et suppression).",
        "**Stockage et envoi d'images** + espace d'administration.",
        "**J'ai coordonné l'équipe** (design + 1 dev) et géré la relation client.",
      ],
    },
    img: IMG + "systems/blog-breno/blog-breno-silva.jpg",
    live: "",
    repo: "",
    tech: ["React", "TypeScript", "PHP", "MySQL"],
  },
  {
    name: "Royal4House",
    featured: true,
    cat: "Sites",
    desc: {
      pt: [
        "Portal de imóveis para compra e locação, que **mantenho e evoluo há mais de um ano**.",
        "**Plugin próprio em PHP**: widgets para Elementor e exportação do catálogo em **XML** para portais parceiros.",
        "Busca em **JetEngine + JetSmartFilters**, eventos no **GTM** e chat para captação de leads.",
      ],
      en: [
        "Real estate portal for sales and rentals, which I have **maintained and evolved for over a year**.",
        "**Custom PHP plugin**: Elementor widgets and catalog export as **XML** to partner portals.",
        "Search on **JetEngine + JetSmartFilters**, event tracking in **GTM** and chat for lead capture.",
      ],
      es: [
        "Portal inmobiliario de compra y alquiler, que **mantengo y evoluciono desde hace más de un año**.",
        "**Plugin propio en PHP**: widgets para Elementor y exportación del catálogo en **XML** a portales asociados.",
        "Búsqueda con **JetEngine + JetSmartFilters**, eventos en **GTM** y chat para captación de leads.",
      ],
      fr: [
        "Portail immobilier de vente et location, que je **maintiens et fais évoluer depuis plus d'un an**.",
        "**Plugin PHP sur mesure** : widgets Elementor et export du catalogue en **XML** vers des portails partenaires.",
        "Recherche via **JetEngine + JetSmartFilters**, événements dans **GTM** et chat pour la captation de leads.",
      ],
    },
    img: IMG + "sites/royal4house/royal4house-main.jpg",
    live: "https://royal4house.com.br/",
    repo: "",
    tech: ["WordPress", "PHP", "JavaScript", "JetEngine", "GTM"],
  },
  {
    name: "Precnet — Investidor",
    cat: "Sites",
    desc: {
      pt: [
        "Site de investimento em **precatórios**.",
        "**Plugin WordPress em PHP** que consome a API da plataforma e renderiza os precatórios no conteúdo.",
        "**Simulador de investimento** em JavaScript, rodando no navegador.",
      ],
      en: [
        "Investment site for **precatórios** (Brazilian court-ordered debt).",
        "**WordPress plugin in PHP** that consumes the platform's API and renders the securities into the content.",
        "**Investment simulator** in JavaScript, running in the browser.",
      ],
      es: [
        "Sitio de inversión en **precatorios** (títulos de deuda judicial).",
        "**Plugin de WordPress en PHP** que consume la API de la plataforma y renderiza los precatorios en el contenido.",
        "**Simulador de inversión** en JavaScript, corriendo en el navegador.",
      ],
      fr: [
        "Site d'investissement en **precatórios** (créances judiciaires brésiliennes).",
        "**Plugin WordPress en PHP** qui consomme l'API de la plateforme et affiche les créances dans le contenu.",
        "**Simulateur d'investissement** en JavaScript, exécuté dans le navigateur.",
      ],
    },
    img: IMG + "sites/precnet-investidor/precnet-main.jpg",
    live: "https://investidor.precnet.com.br/",
    repo: "",
    tech: ["WordPress", "PHP", "JavaScript", "REST API"],
  },
  {
    name: "Help Baterias — Loja",
    featured: true,
    cat: "Sites",
    desc: {
      pt: [
        "E-commerce de **baterias automotivas** em WooCommerce: desenvolvi, mantenho e faço o **deploy**.",
        "**Plugin próprio** para campos customizados e as modalidades de entrega do cliente.",
        "Regras condicionais: cada entrega se habilita sozinha conforme o **produto** e o **momento da compra**.",
      ],
      en: [
        "**Car battery** e-commerce on WooCommerce: I built it, maintain it and handle the **deploy**.",
        "**Custom plugin** for the client's custom fields and delivery methods.",
        "Conditional rules: each delivery option enables itself based on the **product** and the **time of purchase**.",
      ],
      es: [
        "E-commerce de **baterías automotrices** en WooCommerce: lo desarrollé, lo mantengo y hago el **deploy**.",
        "**Plugin propio** para campos personalizados y las modalidades de entrega del cliente.",
        "Reglas condicionales: cada entrega se habilita sola según el **producto** y el **momento de la compra**.",
      ],
      fr: [
        "E-commerce de **batteries automobiles** sous WooCommerce : développé, maintenu et **déployé** par mes soins.",
        "**Plugin sur mesure** pour les champs personnalisés et les modes de livraison du client.",
        "Règles conditionnelles : chaque mode de livraison s'active selon le **produit** et le **moment de l'achat**.",
      ],
    },
    img: IMG + "sites/help-baterias/help-baterias-main.jpg",
    live: "https://loja.helpbaterias.com.br/",
    repo: "",
    tech: ["WordPress", "WooCommerce", "PHP", "JavaScript"],
  },
  {
    name: "Help Baterias — Institucional",
    cat: "Sites",
    desc: {
      pt: ["**Manutenção** do site institucional da Help Baterias, feito em **CodeIgniter**."],
      en: ["**Maintenance** of Help Baterias' institutional site, built on **CodeIgniter**."],
      es: ["**Mantenimiento** del sitio institucional de Help Baterias, hecho en **CodeIgniter**."],
      fr: ["**Maintenance** du site institutionnel de Help Baterias, développé avec **CodeIgniter**."],
    },
    img: IMG + "sites/help-baterias-institucional/help-baterias-institucional-main.jpg",
    live: "https://www.helpbaterias.com.br/",
    repo: "",
    tech: ["CodeIgniter", "PHP"],
  },
  {
    name: "Guaraviton",
    cat: "Sites",
    desc: {
      pt: ["**Manutenção** do site da marca Guaraviton, incluindo as **configurações de hospedagem**."],
      en: ["**Maintenance** of the Guaraviton brand site, including the **hosting setup**."],
      es: ["**Mantenimiento** del sitio de la marca Guaraviton, incluidas las **configuraciones de hospedaje**."],
      fr: ["**Maintenance** du site de la marque Guaraviton, y compris la **configuration de l'hébergement**."],
    },
    img: IMG + "sites/guaraviton/guaraviton-main.jpg",
    live: "https://guaravita.com.br/",
    repo: "",
    tech: ["WordPress", "PHP"],
  },
  {
    name: "Italínea Rio",
    cat: "Sites",
    desc: {
      pt: [
        "Site das lojas **Italínea Rio** (móveis planejados), em WordPress com Elementor.",
        "Também produzi **diversas landing pages** de campanha para a marca.",
      ],
      en: [
        "Site for the **Italínea Rio** stores (custom furniture), on WordPress with Elementor.",
        "I also produced **several campaign landing pages** for the brand.",
      ],
      es: [
        "Sitio de las tiendas **Italínea Rio** (muebles a medida), en WordPress con Elementor.",
        "También produje **varias landing pages** de campaña para la marca.",
      ],
      fr: [
        "Site des magasins **Italínea Rio** (mobilier sur mesure), sous WordPress avec Elementor.",
        "J'ai aussi produit **plusieurs landing pages** de campagne pour la marque.",
      ],
    },
    img: IMG + "sites/rio-projetos-italinea/rio-projetos-italinea-main.jpg",
    live: "https://rioprojetositalinea.com.br/",
    repo: "",
    tech: ["WordPress", "Elementor", "PHP"],
  },
  {
    name: "Mirante do Arvrão",
    cat: "Sites",
    desc: {
      pt: [
        "**Manutenção ativa** do site do hotel Mirante do Arvrão.",
        "**Diversas landing pages** sazonais: réveillon, carnaval e outras datas.",
      ],
      en: [
        "**Active maintenance** of the Mirante do Arvrão hotel site.",
        "**Several seasonal landing pages**: New Year's Eve, Carnival and other dates.",
      ],
      es: [
        "**Mantenimiento activo** del sitio del hotel Mirante do Arvrão.",
        "**Varias landing pages** de temporada: fin de año, carnaval y otras fechas.",
      ],
      fr: [
        "**Maintenance active** du site de l'hôtel Mirante do Arvrão.",
        "**Plusieurs landing pages** saisonnières : Nouvel An, Carnaval et autres dates.",
      ],
    },
    img: IMG + "sites/mirante-do-arvrao/mirante-do-arvrao-main.jpg",
    live: "https://mirantedoarvrao.com.br/wp/",
    repo: "",
    tech: ["WordPress", "Elementor", "PHP"],
  },
  {
    name: "Lançamento — Cidadania Espanhola",
    featured: true,
    cat: "Sites",
    desc: {
      pt: [
        "Blog de lançamento com várias páginas para uma campanha de **cidadania espanhola**.",
        "Envio dinâmico de leads em **round-robin**: cada vendedor ficava com uma fatia igual do volume.",
        "Plugins de **rastreamento** da campanha. Resultado: **R$ 80 mil em 1 semana**.",
      ],
      en: [
        "Multi-page launch blog for a **Spanish citizenship** campaign.",
        "Dynamic lead routing in **round-robin**: each rep got an equal share of the volume.",
        "Campaign **tracking** plugins. Result: **R$ 80k in one week**.",
      ],
      es: [
        "Blog de lanzamiento con varias páginas para una campaña de **ciudadanía española**.",
        "Envío dinámico de leads en **round-robin**: cada vendedor recibía una porción igual del volumen.",
        "Plugins de **rastreo** de la campaña. Resultado: **R$ 80 mil en 1 semana**.",
      ],
      fr: [
        "Blog de lancement multi-pages pour une campagne de **citoyenneté espagnole**.",
        "Routage dynamique des leads en **round-robin** : chaque commercial recevait une part égale du volume.",
        "Plugins de **tracking** de la campagne. Résultat : **80 000 R$ en 1 semaine**.",
      ],
    },
    img: IMG + "sites/lancamento-cidadania/lancamento-cidadania-main.svg",
    // blog de campanha: saiu do ar depois do lançamento
    live: "",
    repo: "",
    tech: ["WordPress", "Elementor", "PHP", "JavaScript"],
  },
  {
    name: "Lançamento — Certificação Esportiva",
    featured: true,
    cat: "Sites",
    desc: {
      pt: [
        "Blog de lançamento com várias páginas para uma campanha de **certificação profissional em força e condicionamento**.",
        "**R$ 100 mil faturados em 1 semana**.",
        "O case rendeu **prêmio ao estrategista** da campanha.",
      ],
      en: [
        "Multi-page launch blog for a **professional strength & conditioning certification** campaign.",
        "**R$ 100k in revenue in one week**.",
        "The case earned an **award for the campaign strategist**.",
      ],
      es: [
        "Blog de lanzamiento con varias páginas para una campaña de **certificación profesional en fuerza y acondicionamiento**.",
        "**R$ 100 mil facturados en 1 semana**.",
        "El case le valió un **premio al estratega** de la campaña.",
      ],
      fr: [
        "Blog de lancement multi-pages pour une campagne de **certification professionnelle en force et conditionnement**.",
        "**100 000 R$ de chiffre d'affaires en 1 semaine**.",
        "Le case a valu un **prix au stratège** de la campagne.",
      ],
    },
    img: IMG + "sites/lancamento-certificacao/lancamento-certificacao-main.svg",
    // blog de campanha: saiu do ar depois do lançamento
    live: "",
    repo: "",
    tech: ["WordPress", "Elementor", "PHP", "JavaScript"],
  },
  {
    name: "Postfast",
    cat: "Sites",
    desc: {
      pt: [
        "Landing page em **Next.js**.",
        "**Deploy em VPS** configurado por mim, com a aplicação rodando sob **PM2**.",
      ],
      en: [
        "Landing page built with **Next.js**.",
        "**VPS deploy** set up by me, with the app running under **PM2**.",
      ],
      es: [
        "Landing page en **Next.js**.",
        "**Deploy en VPS** configurado por mí, con la aplicación corriendo bajo **PM2**.",
      ],
      fr: [
        "Landing page en **Next.js**.",
        "**Déploiement sur VPS** configuré par mes soins, application sous **PM2**.",
      ],
    },
    img: IMG + "sites/postfast/postfast-main.jpg",
    live: "",
    repo: "",
    tech: ["Next.js", "Tailwind", "Node.js", "PM2"],
  },
  {
    name: "Diagonal Ag",
    cat: "Sites",
    desc: {
      pt: [
        "Site onepage para a agência Diagonal.",
        "Ícones desenhados **direto em SVG**, com foco em **performance** de carregamento.",
        "Formulário com **integração de busca de localidades**.",
      ],
      en: [
        "One-page site for the Diagonal agency.",
        "Icons drawn **directly in SVG**, focused on loading **performance**.",
        "Form with a **location lookup integration**.",
      ],
      es: [
        "Sitio onepage para la agencia Diagonal.",
        "Íconos dibujados **directamente en SVG**, con foco en el **rendimiento** de carga.",
        "Formulario con **integración de búsqueda de localidades**.",
      ],
      fr: [
        "Site one-page pour l'agence Diagonal.",
        "Icônes dessinées **directement en SVG**, axées sur la **performance** de chargement.",
        "Formulaire avec **intégration de recherche de localités**.",
      ],
    },
    img: IMG + "sites/diagonal/diagonal-main.jpg",
    // fora do ar: cliente não usa mais — mantido só com o repo
    live: "",
    repo: "", // código de cliente
    tech: ["React", "Tailwind", "PHP"],
  },
  {
    name: "Revista Ibremp",
    cat: "Sites",
    desc: {
      pt: ["Site institucional para apresentação das **revistas Ibremp**."],
      en: ["Institutional site presenting the **Ibremp journals**."],
      es: ["Sitio institucional para presentar las **revistas Ibremp**."],
      fr: ["Site institutionnel présentant les **revues Ibremp**."],
    },
    img: IMG + "sites/ibremp/ibremp-main.jpg",
    // fora do ar: cliente não usa mais — mantido só com o repo
    live: "",
    repo: "", // código de cliente
    tech: ["Next.js", "Tailwind"],
  },
  {
    name: "Corpore",
    cat: "Sites",
    desc: {
      pt: [
        "Site de clínica de fisioterapia — **cliente meu há mais de 3 anos**.",
        "**Next.js**, só front-end, arquitetado para **custo zero de infraestrutura**.",
        "Deploy na **Vercel** com o e-mail do domínio numa **VPS**: DNS com **MX apontado para fora do host** (split-domain).",
      ],
      en: [
        "Physiotherapy clinic site — **a client of mine for over 3 years**.",
        "**Next.js**, front-end only, architected for **zero infrastructure cost**.",
        "Deployed on **Vercel** with domain email on a **VPS**: DNS with **MX pointed away from the host** (split-domain).",
      ],
      es: [
        "Sitio de clínica de fisioterapia — **cliente mío desde hace más de 3 años**.",
        "**Next.js**, solo front-end, diseñado para **costo cero de infraestructura**.",
        "Deploy en **Vercel** con el correo del dominio en una **VPS**: DNS con **MX apuntado fuera del host** (split-domain).",
      ],
      fr: [
        "Site de clinique de kinésithérapie — **mon client depuis plus de 3 ans**.",
        "**Next.js**, front-end uniquement, pensé pour un **coût d'infrastructure nul**.",
        "Déploiement sur **Vercel** et e-mail du domaine sur un **VPS** : DNS avec **MX pointé hors de l'hébergeur** (split-domain).",
      ],
    },
    img: IMG + "sites/corpore/corpore-main.jpg",
    live: "https://www.corporetorre.com.br/",
    repo: "", // código de cliente
    tech: ["Next.js", "React", "Tailwind"],
  },
  {
    name: "Carneiro e Carballido",
    cat: "Sites",
    desc: {
      pt: [
        "Site institucional para escritório de contabilidade, com design reproduzido do **Figma**.",
        "**Coordenei a equipe de devs** do projeto.",
      ],
      en: [
        "Institutional site for an accounting firm, design reproduced from **Figma**.",
        "**Led the project's dev team**.",
      ],
      es: [
        "Sitio institucional para un despacho de contabilidad, diseño reproducido de **Figma**.",
        "**Coordiné al equipo de devs** del proyecto.",
      ],
      fr: [
        "Site institutionnel pour un cabinet comptable, maquette reproduite depuis **Figma**.",
        "**J'ai coordonné l'équipe de devs** du projet.",
      ],
    },
    img: IMG + "sites/carneiro-e-carbalito/carneiro-main.jpg",
    live: "https://cecconsultores.com.br/",
    repo: "", // código de cliente
    tech: ["React", "Tailwind", "PHP"],
  },
  {
    name: "Carlos Psicanalista",
    cat: "Sites",
    desc: {
      pt: ["Landing page para **psicanalista**."],
      en: ["Landing page for a **psychoanalyst**."],
      es: ["Landing page para un **psicoanalista**."],
      fr: ["Landing page pour un **psychanalyste**."],
    },
    img: IMG + "sites/carlos-psicanalista/carlos-psicanalista-main.jpg",
    live: "https://www.carlosalbertopsicanalista.com.br/",
    repo: "", // código de cliente
    tech: ["Next.js", "Tailwind"],
  },
  {
    name: "Thialita Power Boss",
    cat: "Sites",
    desc: {
      pt: ["Landing page com formulários via **EmailJS**."],
      en: ["Landing page with forms powered by **EmailJS**."],
      es: ["Landing page con formularios mediante **EmailJS**."],
      fr: ["Landing page avec formulaires via **EmailJS**."],
    },
    img: IMG + "sites/thialita-power-boss/thialita.jpg",
    // fora do ar: cliente não usa mais
    live: "",
    repo: "",
    tech: ["Next.js", "Tailwind"],
  },
  {
    name: "Seu Treino — 28 dias",
    cat: "Sites",
    desc: {
      pt: [
        "Landing page em **React + Tailwind**, com design vindo do **Figma**.",
        "Foco em **performance** de carregamento, em coordenação direta com o design.",
      ],
      en: [
        "Landing page in **React + Tailwind**, with the design coming from **Figma**.",
        "Focused on loading **performance**, in direct coordination with design.",
      ],
      es: [
        "Landing page en **React + Tailwind**, con el diseño venido de **Figma**.",
        "Foco en el **rendimiento** de carga, en coordinación directa con el diseño.",
      ],
      fr: [
        "Landing page en **React + Tailwind**, maquette issue de **Figma**.",
        "Axée sur la **performance** de chargement, en coordination directe avec le design.",
      ],
    },
    img: IMG + "sites/seu-treino-28-dias/seu-treino-28-dias-main.jpg",
    live: "",
    repo: "", // código de cliente
    tech: ["React", "Tailwind"],
  },
  {
    name: "Pure Detail",
    featured: true,
    cat: "Sites",
    desc: {
      pt: [
        "Site institucional e de orçamento para prestadora automotiva na **Nova Zelândia**.",
        "Design **pixel-perfect**, com cards de recortes diagonais em **SVG customizado**.",
        "**Formulário de orçamento** em etapas: contato, veículo, serviços e upload de fotos.",
      ],
      en: [
        "Institutional and quoting site for an automotive company in **New Zealand**.",
        "**Pixel-perfect** design, including cards with diagonal cutouts in **custom SVG**.",
        "Multi-step **quote form**: contact, vehicle, services and photo upload.",
      ],
      es: [
        "Sitio institucional y de presupuestos para una empresa automotriz en **Nueva Zelanda**.",
        "Diseño **pixel-perfect**, con cards de recortes diagonales en **SVG a medida**.",
        "**Formulario de presupuesto** por etapas: contacto, vehículo, servicios y subida de fotos.",
      ],
      fr: [
        "Site institutionnel et de devis pour une entreprise automobile en **Nouvelle-Zélande**.",
        "Design **au pixel près**, avec des cartes aux découpes diagonales en **SVG sur mesure**.",
        "**Formulaire de devis** par étapes : contact, véhicule, services et envoi de photos.",
      ],
    },
    img: IMG + "sites/pure-detail/pure-detail-main.jpg",
    live: "https://puredetail.co.nz/",
    repo: "",
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  },
];
