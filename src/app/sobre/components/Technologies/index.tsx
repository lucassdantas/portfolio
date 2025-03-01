import { Title } from '@/components/Title'
import { TechnologyGroup } from '@/types/technologies'
import { technologiesGroups } from '@/utils/technologies'
import Image from 'next/image'
import React from 'react'

export const Technologies = () => {
  return (
    <div className='flex flex-col lg:flex-row flex-wrap gap-8 w-full'>
      {technologiesGroups.map((technologyGroup: TechnologyGroup) => (
        <div key={technologyGroup.label} className='lg:w-[40%] w-full'>
          <Title tag='h3' className='mb-4'>{technologyGroup.label}</Title>
          <div className='flex gap-4'>
            {technologyGroup.technologies.map((technology) => (
              <div key={technology.name} className='w-[60px] h-[60px] relative bg-gray-800 p-1 group'>
                {/* Imagem em preto e branco (desaparece no hover) */}
                <Image 
                  src={technology.grayImage} 
                  alt={technology.name} 
                  className='absolute inset-0 w-full h-full transition-opacity duration-300 group-hover:opacity-0 p-1'
                />
                {/* Imagem colorida (aparece no hover) */}
                <Image 
                  src={technology.coloredImage} 
                  alt={technology.name} 
                  className='absolute inset-0 w-full h-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 p-1'
                />
                {/* Tooltip (Nome da tecnologia) */}
                <span className="absolute left-1/2 -bottom-8 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {technology.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
