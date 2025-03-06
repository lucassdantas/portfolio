import { Technologies } from '@/app/sobre/components/Technologies'
import { Section } from '@/components/Section'
import { Title } from '@/components/Title'
import React from 'react'

export default function About () {
  return (
    <Section limiterClassname='relative flex flex-col justify-between h-full' className='text-base_1-a0 text-center p-12'>
      <div className='h-1/2 '>
        <Title tag='h2' className='font-bold text-2xl'>Lucas Dantas</Title>
        <Title tag='h1' isBigText={true} className='font-extrabold lg:text-inherit text-lg'>Desenvolvedor Web</Title>
        <p className='text-2xl text-base_1-a0 '>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at convallis turpis. Proin sit amet eros a justo malesuada facilisis. Integer auctor, ex a vestibulum hendrerit, felis purus facilisis velit, eu luctus.</p>
      </div>
      <div className='h-1/2'>
        <Title tag='h2' className='text-3xl font-bold '>Técnologias</Title>
        <p className='mb-4'>Lorem ipsum sit amet, consectur</p>
        <Technologies/>
      </div>
    </Section>
  )
}
