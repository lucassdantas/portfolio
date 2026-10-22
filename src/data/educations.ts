// Camada de conteúdo — formação acadêmica (nos 4 idiomas; instituição é nome próprio)
import type { Education } from "@/types";

export const educations: Education[] = [
  {
    period: { start: "2024-01", end: "2028-01" },
    course: {
      pt: "Bacharelado em Engenharia de Software",
      en: "Bachelor's in Software Engineering",
      es: "Licenciatura en Ingeniería de Software",
      fr: "Licence en génie logiciel",
    },
    institution: "Faculdade Descomplica",
    grade: {
      pt: "CR 9.8",
      en: "GPA 9.8/10",
      es: "promedio 9,8",
      fr: "moyenne 9,8/10",
    },
    desc: {
      pt: "Engenharia de software, AWS, DevOps, computação em nuvem, desenvolvimento ágil e apps com Flutter.",
      en: "Software engineering, AWS, DevOps, cloud computing, agile development and Flutter apps.",
      es: "Ingeniería de software, AWS, DevOps, computación en la nube, desarrollo ágil y apps con Flutter.",
      fr: "Génie logiciel, AWS, DevOps, cloud computing, développement agile et applications Flutter.",
    },
  },
  {
    period: { start: "2022-08", end: "2024-01" },
    course: {
      pt: "Técnico em Informática",
      en: "IT Technician",
      es: "Técnico en Informática",
      fr: "Technicien en informatique",
    },
    institution: "Senac RJ",
    grade: {
      pt: "nota 10",
      en: "grade 10/10",
      es: "nota 10",
      fr: "note 10/10",
    },
    desc: {
      pt: "Liderei o desenvolvimento de sistema de estoque em Java e de app em React Native; infraestrutura de redes, Node.js, Git/GitHub.",
      en: "Led the development of an inventory system in Java and an app in React Native; network infrastructure, Node.js, Git/GitHub.",
      es: "Lideré el desarrollo de un sistema de inventario en Java y de una app en React Native; infraestructura de redes, Node.js, Git/GitHub.",
      fr: "J'ai mené le développement d'un système de stock en Java et d'une application React Native ; infrastructure réseau, Node.js, Git/GitHub.",
    },
  },
];
