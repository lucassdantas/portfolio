import { Project } from '@/types/projectType'
import Image from 'next/image'
import React from 'react'
import './cardImages.css'

interface CardImagesProps {
  project:Project;
  handleImageClick: (index:number) => any;
  setIsLightboxOpen: (isLightboxOpen:boolean) => any;
}
export const CardImages = ({ project, handleImageClick, setIsLightboxOpen }: CardImagesProps) => {
  return (
    <div className="flex w-full justify-between gap-4">
      <div className="lg:w-[300px] w-full">
        <Image
          src={project.mainImage}
          alt={project.name}
          width={300}
          height={200}
          onClick={() => { handleImageClick(0); setIsLightboxOpen(true) }} // Clica para abrir a lightbox
          className="cursor-pointer lg:w-[300px] w-full h-full lg:h-[200px] object-cover"
        />
      </div>

      <div className="hidden lg:flex flex-col gap-2 h-[170px] overflow-y-scroll scrollbar-visible">
        {project.galleryImages.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt={`${project.name} gallery`}
            width={120}
            height={80}
            onClick={() => { handleImageClick(index + 1); setIsLightboxOpen(true) }} // Clica para abrir a lightbox
            className="cursor-pointer w-full h-[80px] object-cover"
          />
        ))}
      </div>
    </div>
  )
}
