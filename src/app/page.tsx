import dynamic from "next/dynamic";
import { ParticlesCanvasLoader as ParticlesCanvas } from "@/components/ParticlesCanvasLoader";
import { Navbar } from "@/components/Navbar";
import { SectionRail } from "@/components/SectionRail";
import { Cursor } from "@/components/Cursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { MotionReveal } from "@/components/MotionReveal";
import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { Terminal } from "@/components/Terminal";
import { StackSection } from "@/components/StackSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { CaseSection } from "@/components/CaseSection";
import { SystemsSection } from "@/components/SystemsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { GithubSection } from "@/components/GithubSection";
import { EducationSection } from "@/components/EducationSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { SoundToggle } from "@/components/SoundToggle";

// Seções pesadas fora do topo (shaders, editor, chat): o HTML continua vindo do
// servidor, mas o JavaScript delas é um arquivo à parte — o script principal
// fica leve e o primeiro conteúdo pinta mais cedo (LCP no celular).
const CoreSection = dynamic(() => import("@/components/CoreSection").then((m) => m.CoreSection));
const Playground = dynamic(() => import("@/components/Playground").then((m) => m.Playground));
const OrbitSection = dynamic(() => import("@/components/OrbitSection").then((m) => m.OrbitSection));
const ChatWidget = dynamic(() => import("@/components/ChatWidget").then((m) => m.ChatWidget));

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
          <StackSection />
          <ExperienceSection />
          <CoreSection />
          <CaseSection />
          <SystemsSection />
          <ProjectsSection />
          <GithubSection />
          <Terminal />
          <Playground />
          <EducationSection />
          <OrbitSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
      <ChatWidget />
      <SoundToggle />
    </>
  );
}
