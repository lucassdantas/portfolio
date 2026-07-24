import { ParticlesCanvas } from "@/components/ParticlesCanvas";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Terminal } from "@/components/Terminal";
import { StackSection } from "@/components/StackSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { GithubSection } from "@/components/GithubSection";
import { Playground } from "@/components/Playground";
import { EducationSection } from "@/components/EducationSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <ParticlesCanvas />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Marquee />
        <Terminal />
        <StackSection />
        <ExperienceSection />
        <ProjectsSection />
        <GithubSection />
        <Playground />
        <EducationSection />
        <ContactSection />
        <Footer />
      </div>
    </>
  );
}
