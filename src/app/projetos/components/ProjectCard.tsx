import Image from 'next/image';
import { Button } from '@/components/Button';
import { Project } from '@/types/projectType';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div className="relative bg-white shadow-lg rounded-2xl p-4 w-full max-w-4xl">
      {/* Barra Azul */}
      <div className="absolute top-0 left-0 w-full h-2 bg-blue-500 rounded-t-2xl" />
      
      {/* Tecnologias */}
      <div className="flex gap-4 p-4 justify-center">
        {project.technologies.map((tech, techIndex) => (
          <div key={techIndex} className="flex items-center gap-2">
            <Image src={tech.coloredImage} alt={tech.name} width={40} height={40} />
            <span className="text-lg font-semibold">{tech.name}</span>
          </div>
        ))}
      </div>

      {/* Card Principal */}
      <div className="flex gap-4 p-4">
        {/* Imagem Principal */}
        <div className="flex-1">
          <Image src={project.mainImage} alt={project.name} className="rounded-xl" width={300} height={200} />
        </div>
        
        {/* Imagens da Galeria */}
        <div className="flex flex-col gap-2">
          {project.galleryImages.map((image, imgIndex) => (
            <Image key={imgIndex} src={image} alt={`${project.name} gallery`} className="rounded-xl" width={150} height={100} />
          ))}
        </div>
      </div>

      {/* Nome e Descrição */}
      <div className="text-center p-4">
        <h3 className="text-xl font-bold">{project.name}</h3>
        <p className="text-gray-600">{project.description}</p>
      </div>

      {/* Botões */}
      <div className="flex justify-center gap-4 pb-4">
        {project.liveProjectUrl && (
          <Button>
            <a href={project.liveProjectUrl} target="_blank" rel="noopener noreferrer">Deploy</a>
          </Button>
        )}
        {project.repositoryUrl && (
          <Button>
            <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer">GitHub</a>
          </Button>
        )}
      </div>
    </div>
  );
}