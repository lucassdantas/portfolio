// Camada de conteúdo — stack & competências
import type { StackGroup } from "@/types";

const TECH_IMG = "/assets/technologyImages/";

export const stackGroups: StackGroup[] = [
  {
    label: "Back-end",
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
    label: "Front-end",
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
    label: "Banco de dados",
    items: [
      { name: "PostgreSQL" },
      { name: "SQL Server" },
      { name: "MySQL", img: TECH_IMG + "database/mysql.png" },
      { name: "MongoDB" },
      { name: "Supabase", img: TECH_IMG + "database/supabase.png" },
    ],
  },
  {
    label: "DevOps & Infra",
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
    label: "Automação & IA",
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
    label: "Arquitetura & Práticas",
    items: [
      { name: "System Design" },
      { name: "Clean Architecture" },
      { name: "SOLID" },
      { name: "Design Patterns" },
      { name: "Filas & Mensageria" },
      { name: "Clean Code" },
      { name: "Testes (unit/int/regressão)" },
      { name: "Scrum & Kanban" },
    ],
  },
];
