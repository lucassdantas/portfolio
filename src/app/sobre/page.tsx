import { Section } from '@/components/Section'
import { Title } from '@/components/Title'
import { technologies } from '@/utils/technologies'
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
            {technologies.map((technology, i) => (
              <div key={technology.label} className='w-[40%]'>
                <Title tag='h3' className='mb-4'>{technology.label}</Title>
                <div className='flex gap-4'>
                  {technology.images.map((image, i2) => (
                    <Image key={i} src={image} alt='imagem' className='w-[60px] bg-gray-800 saturate-0'/>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
        </div>


    </Section>
  )
}
