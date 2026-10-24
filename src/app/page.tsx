import dynamic from "next/dynamic";
import { Suspense } from "react";
import { ParticlesCanvasLoader as ParticlesCanvas } from "@/components/ParticlesCanvasLoader";
import { Navbar } from "@/components/Navbar";
import { SectionRail } from "@/components/SectionRail";
import { Cursor } from "@/components/Cursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { MotionReveal } from "@/components/MotionReveal";
import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { Footer } from "@/components/Footer";
import { SoundToggle } from "@/components/SoundToggle";

// Abaixo da dobra, cada seção é um módulo à parte dentro de um <Suspense>: o
// HTML vem pronto do servidor e o React hidrata cada bloco NO LUGAR quando o
// código dele chega (hidratação seletiva, fatiada em pedaços curtos). O script
// inicial fica só com o essencial, e nenhum bloco é recriado durante a rolagem
// — recriar era a travada que se sentia ao se aproximar de cada seção.
const StackSection = dynamic(() => import("@/components/StackSection").then((m) => m.StackSection));
const ExperienceSection = dynamic(() => import("@/components/ExperienceSection").then((m) => m.ExperienceSection));
const CoreSection = dynamic(() => import("@/components/CoreSection").then((m) => m.CoreSection));
const CaseSection = dynamic(() => import("@/components/CaseSection").then((m) => m.CaseSection));
const SystemsSection = dynamic(() => import("@/components/SystemsSection").then((m) => m.SystemsSection));
const ProjectsSection = dynamic(() => import("@/components/ProjectsSection").then((m) => m.ProjectsSection));
const GithubSection = dynamic(() => import("@/components/GithubSection").then((m) => m.GithubSection));
const Terminal = dynamic(() => import("@/components/Terminal").then((m) => m.Terminal));
const Playground = dynamic(() => import("@/components/Playground").then((m) => m.Playground));
const EducationSection = dynamic(() => import("@/components/EducationSection").then((m) => m.EducationSection));
const OrbitSection = dynamic(() => import("@/components/OrbitSection").then((m) => m.OrbitSection));
const ContactSection = dynamic(() => import("@/components/ContactSection").then((m) => m.ContactSection));
const ChatWidget = dynamic(() => import("@/components/ChatWidget").then((m) => m.ChatWidget));

const sections = [
  StackSection,
  ExperienceSection,
  CoreSection,
  CaseSection,
  SystemsSection,
  ProjectsSection,
  GithubSection,
  Terminal,
  Playground,
  EducationSection,
  OrbitSection,
  ContactSection,
];

export default function Home() {
  return (
    <>
      <ParticlesCanvas />
      <Cursor />
      <SmoothScroll />
      <MotionReveal />
      <SectionRail />
      {/* ≥1100px: respiro à direita do tamanho do SectionRail, para ele não cobrir conteúdo */}
      <div className="relative z-10 min-[1100px]:pr-12">
        <Navbar />
        <main>
          <Hero />
          <Manifesto />
          {sections.map((Section, i) => (
            <Suspense key={i} fallback={null}>
              <Section />
            </Suspense>
          ))}
        </main>
        <Footer />
      </div>
      <ChatWidget />
      <SoundToggle />
    </>
  );
}
