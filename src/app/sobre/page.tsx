import { Technologies } from '@/app/sobre/components/Technologies'
import { Section } from '@/components/Section'
import { ImageWithSquares } from '@/components/Sidebar/components/ImageWithSquares'
import { PersonalInfos } from '@/components/Sidebar/components/PersonalInfos'
import { SocialNetworks } from '@/components/Sidebar/components/SocialNetworks'
import { Title } from '@/components/Title'
import React from 'react'

export default function About () {
  return (
    <Section limiterClassname='relative flex flex-col justify-between h-full ' className='text-base_1-a0 text-center lg:text-left lg:py-12 lg:px-12 py-12 px-4 h-full min-h-fit'>
      <div className='h-1/2 '>
        <Title tag='h2' className='font-bold text-2xl'>Lucas Dantas</Title>
        <Title tag='h1' isBigText={true} className='font-extrabold text-2xl'>Desenvolvedor Web</Title>
        <p className='lg:text-2xl text-base text-base_1-a0 '>A tecnologia sempre foi minha paixão, e transformá-la em soluções reais me motiva diariamente. Como desenvolvedor web, foco em performance, usabilidade e inovação para criar experiências digitais impactantes com código limpo e boas práticas.</p>
      </div>
      <div className='lg:hidden flex flex-col items-center pt-12 mb-12 w-full'>
        <ImageWithSquares/>
        <SocialNetworks/>
        <PersonalInfos/>
      </div>
      <div className='h-1/2 text-left mb-6'>
        <Title tag='h2' className='text-3xl font-bold '>Técnologias</Title>
        <p className='mb-4'> tecnologia certa faz toda a diferença. Trabalho com um stack moderno e eficiente, combinando linguagens e frameworks poderosos para entregar soluções de alta qualidade.</p>
        <Technologies/>
      </div>
    </Section>
  )
}
