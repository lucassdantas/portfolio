// ============================================================
// portfolio-data.js — "banco de dados" do portfólio
// Edite AQUI textos, experiências, projetos, certificados etc.
// Nenhuma alteração no componente é necessária.
// Estrutura: coleções de documentos (estilo NoSQL).
// ============================================================

const pt = {
  navAbout:'Início', navStack:'Stack', navExp:'Experiência', navProj:'Projetos', navEdu:'Educação', navContact:'Contato',
  role:'// desenvolvedor full stack', tagline:'4+ anos construindo aplicações web, APIs, automações e sistemas críticos — de chatbots com IA a sistemas da área da saúde. Arquitetura limpa, custo sob controle e código que dura.',
  cta1:'Ver projetos', cta2:'Fale comigo', statYears:'anos de experiência', statProj:'projetos entregues', statLangs:'idiomas', badge:'disponível para novos desafios',
  termTitle:'terminal interativo', termDesc:'Explore meu perfil por linha de comando — como um dev faria.',
  stackTitle:'stack & competências', stackDesc:'Ferramentas que uso em produção, do back ao front, da infra à IA.',
  engTitle:'como eu trabalho', expTitle:'experiência', expDesc:'Clique em cada cargo para expandir os detalhes.',
  projTitle:'projetos', projDesc:'Uma seleção de sistemas, sites e aplicações entregues em produção.',
  featured:'case em destaque', featDesc:'Migração da arquitetura de chatbots corporativos de fluxos probabilísticos (n8n) para fluxos determinísticos em Python com FastAPI, SQLAlchemy e Pytest — mais previsibilidade, menos custo e integração com a base de conhecimento da empresa via MCP.',
  featM1:'tokens de IA por fluxo completo', featM2:'arquitetura determinística', featM3:'consulta inteligente com controle de acesso',
  ghTitle:'github em tempo real', ghDesc:'Dados carregados ao vivo da API do GitHub.', ghRepos:'repositórios', ghFollowers:'seguidores', ghStars:'estrelas', ghLangs:'linguagens mais usadas nos repositórios',
  playTitle:'playground de código', playDesc:'Um mini editor JavaScript rodando aqui mesmo, na sua aba.', run:'RUN ▶',
  eduTitle:'educação', certTitle:'certificados', langTitle:'idiomas', booksTitle:'livros que moldaram meu código',
  contactTitle:'contato', contactHead:'Vamos construir algo juntos?', contactDesc:'Aberto a oportunidades como desenvolvedor full stack pleno/sênior. Home office e times com processos bem definidos são o meu habitat.',
  remote:'remoto', footer:'feito com Next-level HTML, café e arquitetura limpa',
  langs:[['Português','Nativo',100],['Inglês','C1',85],['Espanhol','B1',55],['Francês','A1',25]], all:'Todos'
};

const en = { ...pt,
  navAbout:'Home', navExp:'Experience', navProj:'Projects', navEdu:'Education', navContact:'Contact',
  role:'// full stack developer', tagline:'4+ years building web apps, APIs, automations and mission-critical systems — from AI chatbots to healthcare software. Clean architecture, cost awareness and code that lasts.',
  cta1:'View projects', cta2:'Get in touch', statYears:'years of experience', statProj:'projects shipped', statLangs:'languages', badge:'open to new challenges',
  termTitle:'interactive terminal', termDesc:'Explore my profile from the command line — like a dev would.',
  stackTitle:'stack & skills', stackDesc:'Tools I use in production, from back to front, infra to AI.',
  engTitle:'how I work', expTitle:'experience', expDesc:'Click each role to expand the details.',
  projTitle:'projects', projDesc:'A selection of systems, sites and applications shipped to production.',
  featured:'featured case', featDesc:'Migrated corporate chatbot architecture from probabilistic flows (n8n) to deterministic Python flows with FastAPI, SQLAlchemy and Pytest — more predictability, less cost, plus MCP-powered knowledge base access.',
  featM1:'AI tokens per full flow', featM2:'deterministic architecture', featM3:'smart retrieval with access control',
  ghTitle:'live github stats', ghDesc:'Data loaded live from the GitHub API.', ghRepos:'repositories', ghFollowers:'followers', ghStars:'stars', ghLangs:'most used languages across repos',
  playTitle:'code playground', playDesc:'A mini JavaScript editor running right here in your tab.',
  eduTitle:'education', certTitle:'certificates', langTitle:'languages', booksTitle:'books that shaped my code',
  contactTitle:'contact', contactHead:'Shall we build something together?', contactDesc:'Open to mid/senior full stack roles. Remote work and well-defined processes are my natural habitat.',
  remote:'remote', footer:'built with next-level HTML, coffee and clean architecture',
  langs:[['Portuguese','Native',100],['English','C1',85],['Spanish','B1',55],['French','A1',25]], all:'All'
};

const es = { ...pt,
  navAbout:'Inicio', navExp:'Experiencia', navProj:'Proyectos', navEdu:'Educación', navContact:'Contacto',
  role:'// desarrollador full stack', tagline:'Más de 4 años construyendo aplicaciones web, APIs, automatizaciones y sistemas críticos — de chatbots con IA a software de salud. Arquitectura limpia, costos bajo control y código que perdura.',
  cta1:'Ver proyectos', cta2:'Hablemos', statYears:'años de experiencia', statProj:'proyectos entregados', statLangs:'idiomas', badge:'abierto a nuevos retos',
  termTitle:'terminal interactiva', termDesc:'Explora mi perfil desde la línea de comandos.',
  stackTitle:'stack y competencias', stackDesc:'Herramientas que uso en producción, del back al front, de la infra a la IA.',
  engTitle:'cómo trabajo', expTitle:'experiencia', expDesc:'Haz clic en cada cargo para ver los detalles.',
  projTitle:'proyectos', projDesc:'Una selección de sistemas, sitios y aplicaciones en producción.',
  featured:'caso destacado', featDesc:'Migración de la arquitectura de chatbots corporativos de flujos probabilísticos (n8n) a flujos deterministas en Python con FastAPI, SQLAlchemy y Pytest — más previsibilidad, menos costo y acceso a la base de conocimiento vía MCP.',
  featM1:'tokens de IA por flujo completo', featM2:'arquitectura determinista', featM3:'consulta inteligente con control de acceso',
  ghTitle:'github en vivo', ghDesc:'Datos cargados en vivo desde la API de GitHub.', ghRepos:'repositorios', ghFollowers:'seguidores', ghStars:'estrellas', ghLangs:'lenguajes más usados',
  playTitle:'playground de código', playDesc:'Un mini editor de JavaScript ejecutándose aquí mismo.',
  eduTitle:'educación', certTitle:'certificados', langTitle:'idiomas', booksTitle:'libros que moldearon mi código',
  contactTitle:'contacto', contactHead:'¿Construimos algo juntos?', contactDesc:'Abierto a puestos full stack semi-senior/senior. Trabajo remoto y procesos bien definidos son mi hábitat.',
  remote:'remoto', footer:'hecho con HTML de otro nivel, café y arquitectura limpia',
  langs:[['Portugués','Nativo',100],['Inglés','C1',85],['Español','B1',55],['Francés','A1',25]], all:'Todos'
};

const fr = { ...pt,
  navAbout:'Accueil', navExp:'Expérience', navProj:'Projets', navEdu:'Formation', navContact:'Contact',
  role:'// développeur full stack', tagline:"4+ ans à construire des applications web, APIs, automatisations et systèmes critiques — des chatbots IA aux logiciels de santé. Architecture propre, coûts maîtrisés et code durable.",
  cta1:'Voir les projets', cta2:'Me contacter', statYears:"années d'expérience", statProj:'projets livrés', statLangs:'langues', badge:'ouvert à de nouveaux défis',
  termTitle:'terminal interactif', termDesc:'Explorez mon profil en ligne de commande.',
  stackTitle:'stack & compétences', stackDesc:"Outils que j'utilise en production, du back au front, de l'infra à l'IA.",
  engTitle:'ma façon de travailler', expTitle:'expérience', expDesc:'Cliquez sur chaque poste pour voir les détails.',
  projTitle:'projets', projDesc:'Une sélection de systèmes, sites et applications en production.',
  featured:'projet phare', featDesc:"Migration de l'architecture des chatbots d'entreprise de flux probabilistes (n8n) vers des flux déterministes en Python avec FastAPI, SQLAlchemy et Pytest — plus de prévisibilité, moins de coûts, avec accès à la base de connaissances via MCP.",
  featM1:'tokens IA par flux complet', featM2:'architecture déterministe', featM3:"recherche intelligente avec contrôle d'accès",
  ghTitle:'github en direct', ghDesc:"Données chargées en direct depuis l'API GitHub.", ghRepos:'dépôts', ghFollowers:'abonnés', ghStars:'étoiles', ghLangs:'langages les plus utilisés',
  playTitle:'playground de code', playDesc:'Un mini éditeur JavaScript qui tourne ici même.',
  eduTitle:'formation', certTitle:'certificats', langTitle:'langues', booksTitle:'livres qui ont façonné mon code',
  contactTitle:'contact', contactHead:'On construit quelque chose ensemble ?', contactDesc:'Ouvert aux postes full stack confirmé/senior. Télétravail et processus bien définis sont mon habitat naturel.',
  remote:'à distance', footer:'fait avec du HTML de haut niveau, du café et une architecture propre',
  langs:[['Portugais','Natif',100],['Anglais','C1',85],['Espagnol','B1',55],['Français','A1',25]], all:'Tous'
};

const experiences = [
  { title:'Desenvolvedor Full Stack', company:'CMEXX', period:'dez/2025 — atual', mode:'Rio de Janeiro · Sistemas de saúde (CME)',
    bullets:[
      'Atuo em sistemas críticos da área da saúde (gestão e rastreabilidade de CME), garantindo estabilidade, disponibilidade e confiabilidade em produção',
      'Lidero a migração da arquitetura de chatbots corporativos de fluxos probabilísticos (n8n) para fluxos determinísticos em Python, com FastAPI, SQLAlchemy e Pytest',
      'Reduzi o consumo de tokens de IA de ~10 mil por request para 2–4 mil no fluxo completo, cortando drasticamente o custo mensal da operação',
      'Re-arquitetei a aplicação de monitoramento de conversas dos chatbots: refatoração completa, migração para TypeScript, middlewares de segurança e autenticação OAuth2 (client credentials)',
      'Otimizei queries SQL críticas, melhorando o desempenho das aplicações',
      'Participo da modernização do sistema legado: de jQuery + Bootstrap + PHP para Next.js + TypeScript, com documentação Swagger e testes unitários e de integração',
      'Implementei MCPs para consulta à base de conhecimento da empresa via IA, com restrição de acesso por perfil',
      'Automatizo tarefas dos setores (RH, financeiro) em contato direto com gestores; implanto e monitoro aplicações em Linux com Docker e Nginx',
      'Participo de dailies e rituais ágeis, análises técnicas e planejamento de soluções',
    ],
    tech:['Python','FastAPI','Laravel','CodeIgniter','React','TypeScript','SQL Server','PostgreSQL','Docker','Linux','Nginx','n8n'] },
  { title:'Desenvolvedor Full Stack', company:'Freelancer', period:'jun/2024 — atual', mode:'Remoto · clientes nacionais e internacionais',
    bullets:[
      'Entreguei sistemas, landing pages e MVPs para clientes nacionais e internacionais — incluindo cliente da Nova Zelândia (puredetail.co.nz) — com 100% das entregas dentro do prazo',
      'Desenvolvo e mantenho mais de 10 sites com responsividade, segurança e otimização',
      'Landing pages otimizadas entregues em 2 dias, permitindo ao cliente antecipar campanhas',
      'Orientei contratação e configurei hospedagens (VPS, CloudPanel, PM2, Nginx), reduzindo custos e maximizando eficiência',
      'Reestruturei e recuperei sites comprometidos por malware, restaurando a operação dos clientes',
      'Liderei equipes de desenvolvimento, planejando projetos e cumprindo prazos estimados',
    ],
    tech:['Next.js','React','TypeScript','PHP','Node.js','Tailwind CSS','PM2','Linux'] },
  { title:'Desenvolvedor WordPress Pleno', company:'RD Exclusive', period:'jul/2022 — jan/2026', mode:'Rio de Janeiro · Híbrido',
    bullets:[
      'Otimizei mais de 30 projetos, reduzindo o tempo de carregamento entre 50% e 90%',
      'Participei de projetos que faturaram mais de R$ 100 mil em uma semana, contribuindo com desenvolvimento, correções e melhorias',
      'Realizei cerca de 150 tarefas por mês, garantindo entregas no prazo e alta satisfação dos clientes',
      'Criei plugins WordPress personalizados, garantindo recursos exclusivos e reduzindo custos com ferramentas de terceiros',
      'Desenvolvi integrações com APIs customizadas para metrificação de leads em CRMs',
      'Removi vírus de hospedagens e sites, com análises e melhorias de segurança; configurei DNS e AWS S3',
      'Desenvolvi sistemas sob medida sem WordPress quando necessário, com deploy otimizado',
    ],
    tech:['WordPress','PHP','JavaScript','MySQL','AWS S3','DNS','Elementor'] },
];

const IMG = 'src/assets/Projects/';
const projects = [
  { name:'Parceiros Rubraz', cat:'Sistemas', desc:'Cálculo de frete por distância (Google Maps API) e dimensões de produtos, com cadastro e painel.', img:IMG+'systems/rubraz-parceiros/versao-final/rubraz-parceiros-versao-final-tela.jpg', live:'https://rubrazlajes.com/parceiros', repo:'https://github.com/lucassdantas/calculo_de_frete_rubraz/tree/main', tech:['React','TypeScript','PHP','MySQL'] },
  { name:'Área do Arquiteto — Trançarte', cat:'Sistemas', desc:'Ranking de pontuação de arquitetos por pedidos, com upload/download de arquivos.', img:IMG+'systems/trancarte-system/area-do-arquiteto-inicio.jpg', live:'https://trancarte.com.br/novosistemaarquitetos/index.php', repo:'', tech:['PHP','MySQL'] },
  { name:'Fórum Breno Silva', cat:'Sistemas', desc:'Fórum com CRUD de posts e amigos, upload de fotos e área administrativa.', img:IMG+'systems/blog-breno/blog-breno-silva.jpg', live:'', repo:'', tech:['React','TypeScript','PHP','MySQL'] },
  { name:'Postfast', cat:'Sites', desc:'Landing page com Next e Tailwind; hospedagem configurada em VPS.', img:IMG+'sites/postfast/postfast-main.jpg', live:'', repo:'', tech:['Next.js','Tailwind','Node.js'] },
  { name:'Diagonal Ag', cat:'Sites', desc:'Site onepage para a agência Diagonal.', img:IMG+'sites/diagonal/diagonal-main.jpg', live:'https://diagonal.ag/', repo:'https://github.com/lucassdantas/diagonal-ag', tech:['React','Tailwind','PHP'] },
  { name:'Revista Ibremp', cat:'Sites', desc:'Site institucional para apresentação das revistas Ibremp.', img:IMG+'sites/ibremp/ibremp-main.jpg', live:'https://rbdsre.ibremp.org.br/', repo:'https://github.com/lucassdantas/rbdsre-revista-ibremp', tech:['Next.js','Tailwind'] },
  { name:'Corpore', cat:'Sites', desc:'Site onepage para clínica de fisioterapia.', img:IMG+'sites/corpore/corpore-main.jpg', live:'https://www.corporetorre.com.br/', repo:'https://github.com/lucassdantas/corporetorre', tech:['React','Tailwind','PHP'] },
  { name:'Carneiro e Carballido', cat:'Sites', desc:'Site institucional para empresa de contabilidade.', img:IMG+'sites/carneiro-e-carbalito/carneiro-main.jpg', live:'https://cecconsultores.com.br/', repo:'https://github.com/lucassdantas/Carneiro-e-Carballido', tech:['React','Tailwind','PHP'] },
  { name:'Carlos Psicanalista', cat:'Sites', desc:'Landing page para psicanalista.', img:IMG+'sites/carlos-psicanalista/carlos-psicanalista-main.jpg', live:'https://www.carlosalbertopsicanalista.com.br/', repo:'https://github.com/lucassdantas/carlos-psicanalista-nextjs', tech:['Next.js','Tailwind'] },
  { name:'Thialita Power Boss', cat:'Sites', desc:'Landing page com formulários via EmailJS.', img:IMG+'sites/thialita-power-boss/thialita.jpg', live:'https://www.thialitasilva.com.br/power-boss', repo:'', tech:['Next.js','Tailwind'] },
  { name:'Seu Treino — 28 dias', cat:'Sites', desc:'Landing page com React e Tailwind.', img:IMG+'sites/seu-treino-28-dias/seu-treino-28-dias-main.jpg', live:'', repo:'https://github.com/lucassdantas/seu-treino-28-dias-lp', tech:['React','Tailwind'] },
  { name:'Minha Biblioteca Católica', cat:'Sites', desc:'Recriação de e-commerce como estudo de front-end.', img:IMG+'sites/minha-biblioteca/minha-biblioteca-main.jpg', live:'https://lucassdantas.github.io/sites/catolica/', repo:'https://github.com/lucassdantas/lucassdantas.github.io/tree/main/sites/catolica', tech:['React','Tailwind'] },
];

const certifications = [
  { period:'set/2024', title:'Object-Oriented Developer', institution:'Descomplica', hours:240, url:'https://certificados.descomplica.com.br/graduacao/4679a852d145377b1d81df7f12882cdb7956bab0ca3c2618ad05951d0ae06136' },
  { period:'jan/2024', title:'User Experience', institution:'Descomplica', hours:240, url:'https://certificados.descomplica.com.br/graduacao/9ddbca5144b70543d480b40bb8dc247e4f712f0c2fde6707ba7b0814bfdfdabd' },
  { period:'jan/2024', title:'Técnico em Informática', institution:'Senac', hours:1200, url:'' },
  { period:'fev/2024', title:'NLW Expert — Node.js', institution:'Rocketseat', hours:5, url:'https://app.rocketseat.com.br/certificates/fdd146b5-ef15-4f77-87ec-748427b4285d' },
  { period:'fev/2024', title:'NLW Expert — React', institution:'Rocketseat', hours:5, url:'https://app.rocketseat.com.br/certificates/c1637717-a9af-42db-90d0-3522bb7c6e36' },
  { period:'out/2023', title:'Java Spring Boot', institution:'Rocketseat', hours:4, url:'https://app.rocketseat.com.br/certificates/75264450-d413-4710-8590-919b661a185b' },
  { period:'ago/2023', title:'Fundamentos p/ Desenvolvimento de Software', institution:'Microsoft & LinkedIn', hours:8, url:'https://www.linkedin.com/learning/certificates/2c4cc730e3f9a8d5b77242794a271e6a19ab83c46e52257ad14f1282fa9e4106' },
  { period:'mar/2023', title:'Cybersecurity Essentials', institution:'Cisco', hours:70, url:'' },
  { period:'nov/2022', title:'NDG Linux UNHACT', institution:'Network Development Group', hours:5, url:'' },
  { period:'set/2022', title:'Introdução à Cibersegurança', institution:'Cisco', hours:5, url:'' },
  { period:'mai/2022', title:'SEO — Do Básico ao Avançado', institution:'Udemy Brasil', hours:5, url:'https://www.udemy.com/certificate/UC-ef310b0d-d68c-4643-bbf2-3e4615a3b85f/' },
];

const educations = [
  { period:'jan/2024 — jan/2028', course:'Bacharelado em Engenharia de Software', institution:'Faculdade Descomplica', grade:'CR 9.8', desc:'Engenharia de software, AWS, DevOps, computação em nuvem, desenvolvimento ágil e apps com Flutter.' },
  { period:'ago/2022 — jan/2024', course:'Técnico em Informática', institution:'Senac RJ', grade:'nota 10', desc:'Liderei o desenvolvimento de sistema de estoque em Java e de app em React Native; infraestrutura de redes, Node.js, Git/GitHub.' },
];

const TECH_IMG = 'src/assets/technologyImages/';
const stackGroups = [
  { label:'Back-end', items:[{name:'PHP',img:TECH_IMG+'back-end/php.png'},{name:'Laravel'},{name:'CodeIgniter'},{name:'Node.js',img:TECH_IMG+'back-end/nodejs.png'},{name:'Python'},{name:'FastAPI'},{name:'Java',img:TECH_IMG+'back-end/java.png'},{name:'Spring Boot'},{name:'REST APIs'}] },
  { label:'Front-end', items:[{name:'React',img:TECH_IMG+'front-end/reactjs.png'},{name:'Next.js',img:TECH_IMG+'front-end/nextjs.png'},{name:'TypeScript',img:TECH_IMG+'front-end/typescript.png'},{name:'Tailwind CSS',img:TECH_IMG+'front-end/tailwindcss.png'},{name:'Bootstrap'},{name:'jQuery'}] },
  { label:'Banco de dados', items:[{name:'PostgreSQL'},{name:'SQL Server'},{name:'MySQL',img:TECH_IMG+'database/mysql.png'},{name:'MongoDB'},{name:'Supabase',img:TECH_IMG+'database/supabase.png'}] },
  { label:'DevOps & Infra', items:[{name:'Docker'},{name:'Linux'},{name:'Nginx'},{name:'AWS S3'},{name:'Git',img:TECH_IMG+'versioning/git.png'},{name:'GitHub',img:TECH_IMG+'versioning/github.png'},{name:'CI/CD'},{name:'PM2'}] },
  { label:'Automação & IA', items:[{name:'n8n'},{name:'MCP'},{name:'LLM Integrations'},{name:'Chatbots'},{name:'Gemini API'},{name:'WordPress',img:TECH_IMG+'crm/wordpress.png'}] },
  { label:'Arquitetura & Práticas', items:[{name:'System Design'},{name:'Clean Architecture'},{name:'SOLID'},{name:'Design Patterns'},{name:'Filas & Mensageria'},{name:'Clean Code'},{name:'Testes (unit/int/regressão)'},{name:'Scrum & Kanban'}] },
];

const principles = [
  { icon:'📐', title:'Arquitetura consciente', desc:'System design, clean architecture, SOLID e padrões de projeto aplicados no dia a dia — decisões técnicas pensadas para durar, não para apagar incêndio.' },
  { icon:'💰', title:'Custo sob controle', desc:'Otimização que aparece na fatura: de queries SQL a consumo de tokens de IA reduzido em mais de 70% num fluxo de chatbot.' },
  { icon:'⚙️', title:'Automação de processos', desc:'Se é repetitivo, vira automação: n8n, filas e mensageria, integrações e IA a serviço dos setores da empresa.' },
  { icon:'🎯', title:'Processo bem definido', desc:'Rituais ágeis, prazos coerentes, testes unitários/integração/regressão e CI/CD — previsibilidade da ideia ao deploy.' },
];

const books = [
  { initials:'CA', title:'Clean Architecture', author:'Robert C. Martin' },
  { initials:'CC', title:'Clean Code', author:'Robert C. Martin' },
  { initials:'PP', title:'The Pragmatic Programmer', author:'Hunt & Thomas' },
  { initials:'LS', title:'The Lean Startup', author:'Eric Ries' },
];

const marquee = ['Next.js','React','TypeScript','Python','FastAPI','Laravel','Node.js','PostgreSQL','SQL Server','Docker','Nginx','n8n','MCP','Clean Architecture','SOLID','CI/CD'];

export const db = { translations: { pt, en, es, fr }, experiences, projects, certifications, educations, stackGroups, principles, books, marquee };
