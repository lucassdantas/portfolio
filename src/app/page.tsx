import { ParticlesCanvasLoader as ParticlesCanvas } from "@/components/ParticlesCanvasLoader";
import { Navbar } from "@/components/Navbar";
import { SectionRail } from "@/components/SectionRail";
import { Cursor } from "@/components/Cursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { Terminal } from "@/components/Terminal";
import { StackSection } from "@/components/StackSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { CoreSection } from "@/components/CoreSection";
import { CaseSection } from "@/components/CaseSection";
import { SystemsSection } from "@/components/SystemsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { GithubSection } from "@/components/GithubSection";
import { Playground } from "@/components/Playground";
import { EducationSection } from "@/components/EducationSection";
import { OrbitSection } from "@/components/OrbitSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";

export default function Home() {
  return (
    <>
      <ParticlesCanvas />
      <Cursor />
      <SmoothScroll />
      <SectionRail />
      {/* ≥1100px: respiro à direita do tamanho do SectionRail, para ele não cobrir conteúdo */}
      <div className="relative z-10 min-[1100px]:pr-12">
        <Navbar />
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
        <Footer />
      </div>
      <ChatWidget />
    </>
  );
}
