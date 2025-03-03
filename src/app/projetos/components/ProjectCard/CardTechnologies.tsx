import { Project } from '@/types/projectType';
import Image from 'next/image';
import React from 'react'

interface ProjectTechnologiesProps {
  project: Project;
  isCardHover:boolean;
}
export const CardTechnologies = ({project, isCardHover=false}:ProjectTechnologiesProps) => {
  return (
    <>
      <hr
        className={`h-[2px] mb-7 w-full border-none bg-gradient-to-r from-base_2-c1 to-primary-blue transition-opacity duration-500 ease-in-out ${isCardHover ? 'opacity-100' : 'opacity-0'}`}
      />
      <div className="flex absolute -top-8 -left-2 gap-4 p-4 justify-center">
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
    </>
  )
}
