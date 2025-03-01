import { Section } from '@/components/Section'
import { Title } from '@/components/Title'
import { TechnologyGroup } from '@/types/technologies'
import { technologiesGroups } from '@/utils/technologies'
import Image from 'next/image'
import React from 'react'

export default function About () {
  return (
    <Section limiterClassname='relative flex flex-col justify-between h-full' className='h-full'>
      <div className='h-1/2 '>
        <Title tag='h2'>Lucas Dantas</Title>
        <Title tag='h1' isBigText={true}>Desenvolvedor Web</Title>
        <p className='text-2xl'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at convallis turpis. Proin sit amet eros a justo malesuada facilisis. Integer auctor, ex a vestibulum hendrerit, felis purus facilisis velit, eu luctus.</p>
      </div>
      <div>
        <Title tag='h2' className='text-3xl font-bold '>Técnologias</Title>
        <p className='mb-4'>Lorem ipsum sit amet, consectur</p>
        <div className='flex flex-wrap gap-8'>
          {technologiesGroups.map((technologyGroup:TechnologyGroup) => (
            <div key={technologyGroup.label} className='w-[40%]'>
              <Title tag='h3' className='mb-4'>{technologyGroup.label}</Title>
              <div className='flex gap-4'>
                {technologyGroup.technologies.map((technology) => (
                  <div key={technology.name} className='w-[60px] h-[60px] relative bg-gray-800 p-1'>
                    {/* Imagem em preto e branco (padrão) */}
                    <Image 
                      src={technology.grayImage} 
                      alt={technology.name} 
                      className='absolute inset-0 w-full h-full transition-opacity duration-300 '
                    />
                    {/* Imagem colorida (aparece no hover) */}
                    <Image 
                      src={technology.coloredImage} 
                      alt={technology.name} 
                      className='absolute inset-0 w-full h-full opacity-0 transition-opacity duration-300 hover:opacity-100'
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
