import { ParticlesCanvasLoader as ParticlesCanvas } from "@/components/ParticlesCanvasLoader";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { Terminal } from "@/components/Terminal";
import { StackSection } from "@/components/StackSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { CoreSection } from "@/components/CoreSection";
import { CaseSection } from "@/components/CaseSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { GithubSection } from "@/components/GithubSection";
import { Playground } from "@/components/Playground";
import { EducationSection } from "@/components/EducationSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";

export default function Home() {
  return (
    <>
      <ParticlesCanvas />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Manifesto />
        <StackSection />
        <ExperienceSection />
        <CoreSection />
        <CaseSection />
        <ProjectsSection />
        <GithubSection />
        <Terminal />
        <Playground />
        <EducationSection />
        <ContactSection />
        <Footer />
      </div>
      <ChatWidget />
    </>
  );
}
