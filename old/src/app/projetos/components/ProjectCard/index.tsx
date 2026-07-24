import { useState } from "react";
import { Project } from "@/types/projectType";
import { Lightbox } from "@/components/Lightbox";
import { CardTechnologies } from "@/app/projetos/components/ProjectCard/CardTechnologies";
import { CardImages } from "@/app/projetos/components/ProjectCard/CardImages";
import { CardBody } from "@/app/projetos/components/ProjectCard/CardBody";

interface ProjectCardProps {
  project: Project;
  cardIndex: number;
  isHovered: boolean;
  setHoveredCardIndex: (index: number ) => void;
}

export const ProjectCard = ({ project, cardIndex, isHovered, setHoveredCardIndex }: ProjectCardProps) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="relative w-full lg:w-[47%] max-w-4xl " onMouseEnter={() => setHoveredCardIndex(cardIndex)} onClick={() => setHoveredCardIndex(cardIndex)}>
      <CardTechnologies project={project} isCardHover={isHovered} />

      <div className="flex flex-col items-start gap-4 p-4 bg-base_2-b0">
        <CardImages project={project} setIsLightboxOpen={setIsLightboxOpen} handleImageClick={setCurrentIndex} />
        <CardBody project={project} />
      </div>

      {isLightboxOpen && (
        <Lightbox
          images={[project.mainImage, ...project.galleryImages]}
          currentIndex={currentIndex}
          onClose={() => setIsLightboxOpen(false)}
          onPrev={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
          onNext={() => setCurrentIndex((prev) => Math.min(prev + 1, project.galleryImages.length))}
        />
      )}
    </div>
  );
};

