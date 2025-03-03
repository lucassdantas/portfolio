import { useState } from "react";
import { Project } from "@/types/projectType";
import { Lightbox } from "@/components/Lightbox";
import { CardTechnologies } from "@/app/projetos/components/ProjectCard/CardTechnologies";
import { CardImages } from "@/app/projetos/components/ProjectCard/CardImages";
import { CardBody } from "@/app/projetos/components/ProjectCard/CardBody";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Função para abrir a lightbox na imagem clicada
  const handleImageClick = (index: number) => {
    setCurrentIndex(index);
    setIsLightboxOpen(true);
  };

  // Função para fechar a lightbox
  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  // Funções para navegação entre as imagens
  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < project.galleryImages.length ? prevIndex + 1 : prevIndex
    );
  };
  
  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  return (
    <div className="relative w-full lg:w-[47%] max-w-4xl">
      <CardTechnologies project={project}/>

      <div className="flex flex-col items-start gap-4 p-4 bg-base_2-b0">
        <CardImages project={project} handleImageClick={handleImageClick}/>
        <CardBody project={project}/>
      </div>

      {/* Exibe a lightbox se estiver aberta */}
      {isLightboxOpen && (
        <Lightbox
          images={[project.mainImage, ...project.galleryImages]}
          currentIndex={currentIndex}
          onClose={closeLightbox}
          onPrev={goToPrev}
          onNext={goToNext}
        />
      )}
    </div>
  );
};
