import { useState } from "react";
import Image from "next/image";
import { Project } from "@/types/projectType";
import { Button } from "@/components/Button";
import { Lightbox } from "@/components/Lightbox";

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
    console.log(currentIndex)
    setCurrentIndex((prevIndex) =>
      prevIndex < project.galleryImages.length ? prevIndex + 1 : prevIndex
    );
  };
  
  const goToPrev = () => {
    console.log(currentIndex)

    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  return (
    <div className="relative w-full lg:w-[47%] max-w-4xl">
      <hr className="border-primary-blue mb-8" />
      <div className="flex absolute -top-7 -left-2 gap-4 p-4 justify-center">
        {project.technologies.map((technology) => (
          <div key={technology.name} className="w-[30px] h-[30px] relative bg-gray-800 p-1 group">
            <Image
              src={technology.coloredImage}
              alt={technology.name}
              className="absolute inset-0 w-full h-full transition-opacity duration-300 p-1"
            />
            <span className="absolute left-1/2 -bottom-8 transform -translate-x-1/2 bg-gray-900 text-base_1-a0 text-xs px-2 py-1 rounded opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {technology.name}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-start gap-4 p-4 bg-base_2-b0">
        <div className="flex">
          <div className="flex-1 w-3/4">
            <Image
              src={project.mainImage}
              alt={project.name}
              width={300}
              height={200}
              onClick={() => handleImageClick(0)} // Clica para abrir a lightbox
              className="cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-2 w-1/4">
            {project.galleryImages.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`${project.name} gallery`}
                width={150}
                height={100}
                onClick={() => handleImageClick(index)} // Clica para abrir a lightbox
                className="cursor-pointer"
              />
            ))}
          </div>
        </div>

        <div className="text-center p-4">
          <h3 className="text-xl font-bold">{project.name}</h3>
          <p className="text-gray-600">{project.description}</p>
        </div>

        <div className="flex justify-center gap-4 pb-4">
          {project.liveProjectUrl && (
            <Button>
              <a href={project.liveProjectUrl} target="_blank">Deploy</a>
            </Button>
          )}
          {project.repositoryUrl && (
            <Button>
              <a href={project.repositoryUrl} target="_blank">GitHub</a>
            </Button>
          )}
        </div>
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
