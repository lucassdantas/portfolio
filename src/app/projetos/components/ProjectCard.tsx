import Image from 'next/image';
import { Button } from '@/components/Button';
import { Project } from '@/types/projectType';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div className="relative w-full lg:w-[47%] max-w-4xl">
      <hr className=" border-primary-blue mb-8" />
      {/* Tecnologias */}
      <div className="flex absolute -top-7 -left-2 gap-4 p-4 justify-center">
        {project.technologies.map((technology, techIndex) => (
          <div key={technology.name} className='w-[30px] h-[30px] relative bg-gray-800 p-1 group'>
            <Image 
              src={technology.coloredImage} 
              alt={technology.name} 
              className='absolute inset-0 w-full h-full transition-opacity duration-300 p-1'
            />
            <span className="absolute left-1/2 -bottom-8 transform -translate-x-1/2 bg-gray-900 text-base_1-a0 text-xs px-2 py-1 rounded opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {technology.name}
            </span>
          </div>
        ))}
      </div>

      {/* Card Principal */}
      <div className="flex flex-col items-start gap-4 p-4 bg-base_2-b0">
        <div className="flex">
          {/* Imagem Principal */}
          <div className="flex-1 w-3/4">
            <Image src={project.mainImage} alt={project.name} className="" width={300} height={200} />
          </div>
          
          {/* Imagens da Galeria */}
          <div className="flex flex-col gap-2 w-1/4">
            {project.galleryImages.map((image, imgIndex) => (
              <Image key={imgIndex} src={image} alt={`${project.name} gallery`} className="" width={150} height={100} />
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

    </div>
  );
}