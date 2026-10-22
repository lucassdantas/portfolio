// Camada de conteúdo — stack & competências
// Rótulo de grupo nos 4 idiomas; nome de tecnologia é nome próprio (string),
// exceto as práticas escritas em português, que viram objeto localizado.
import type { StackGroup } from "@/types";

const TECH_IMG = "/assets/technologyImages/";

export const stackGroups: StackGroup[] = [
  {
    label: { pt: "Back-end", en: "Back end", es: "Back-end", fr: "Back-end" },
    items: [
      { name: "PHP", img: TECH_IMG + "back-end/php.png" },
      { name: "Laravel" },
      { name: "CodeIgniter" },
      { name: "Node.js", img: TECH_IMG + "back-end/nodejs.png" },
      { name: "Python" },
      { name: "FastAPI" },
      { name: "Java", img: TECH_IMG + "back-end/java.png" },
      { name: "Spring Boot" },
      { name: "REST APIs" },
    ],
  },
  {
    label: { pt: "Front-end", en: "Front end", es: "Front-end", fr: "Front-end" },
    items: [
      { name: "React", img: TECH_IMG + "front-end/reactjs.png" },
      { name: "Next.js", img: TECH_IMG + "front-end/nextjs.png" },
      { name: "TypeScript", img: TECH_IMG + "front-end/typescript.png" },
      { name: "Tailwind CSS", img: TECH_IMG + "front-end/tailwindcss.png" },
      { name: "Bootstrap" },
      { name: "jQuery" },
    ],
  },
  {
    label: { pt: "Banco de dados", en: "Databases", es: "Bases de datos", fr: "Bases de données" },
    items: [
      { name: "PostgreSQL" },
      { name: "SQL Server" },
      { name: "MySQL", img: TECH_IMG + "database/mysql.png" },
      { name: "MongoDB" },
      { name: "Supabase", img: TECH_IMG + "database/supabase.png" },
    ],
  },
  {
    label: { pt: "DevOps & Infra", en: "DevOps & Infra", es: "DevOps & Infra", fr: "DevOps & Infra" },
    items: [
      { name: "Docker" },
      { name: "Linux" },
      { name: "Nginx" },
      { name: "AWS S3" },
      { name: "Git", img: TECH_IMG + "versioning/git.png" },
      { name: "GitHub", img: TECH_IMG + "versioning/github.png" },
      { name: "CI/CD" },
      { name: "PM2" },
    ],
  },
  {
    label: { pt: "Automação & IA", en: "Automation & AI", es: "Automatización & IA", fr: "Automatisation & IA" },
    items: [
      { name: "n8n" },
      { name: "MCP" },
      { name: "LLM Integrations" },
      { name: "Chatbots" },
      { name: "Gemini API" },
      { name: "WordPress", img: TECH_IMG + "crm/wordpress.png" },
    ],
  },
  {
    label: { pt: "Arquitetura & Práticas", en: "Architecture & Practices", es: "Arquitectura & Prácticas", fr: "Architecture & pratiques" },
    items: [
      { name: "System Design" },
      { name: "Clean Architecture" },
      { name: "SOLID" },
      { name: "Design Patterns" },
      { name: { pt: "Filas & Mensageria", en: "Queues & Messaging", es: "Colas & Mensajería", fr: "Files & messagerie" } },
      { name: "Clean Code" },
      { name: { pt: "Testes (unit/int/regressão)", en: "Testing (unit/int/regression)", es: "Pruebas (unit/int/regresión)", fr: "Tests (unit/int/régression)" } },
      { name: "Scrum & Kanban" },
    ],
  },
];
