import { Project } from '@/types/projectType'
import Image from 'next/image'
import React from 'react'

interface CardImagesProps {
  project:Project;
  handleImageClick: (index:number) => any
}
export const CardImages = ({project, handleImageClick}:CardImagesProps) => {
  return (
    <div className="flex">
      <div className="flex-1 w-3/4">
        <Image
          src={project.mainImage}
          alt={project.name}
          width={300}
          height={200}
          onClick={() => handleImageClick(0)} // Clica para abrir a lightbox
          className="cursor-pointer w-[300px] h-[200px]  object-cover"
        />
      </div>

      <div className="flex flex-col gap-2 w-1/4">
        {project.galleryImages.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt={`${project.name} gallery`}
            width={120}
            height={80}
            onClick={() => handleImageClick(index+1)} // Clica para abrir a lightbox
            className="cursor-pointer w-[120px] h-[80px]"
          />
        ))}
      </div>
    </div>
  )
}
