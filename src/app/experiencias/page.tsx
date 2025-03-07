import { ExperiencesAccordion } from '@/app/experiencias/components/ExperiencesAccordion'
import { Section } from '@/components/Section'
import { Title } from '@/components/Title'
import React from 'react'

export default function Experiences () {
  return (
    <Section limiterClassname='relative  h-full' className=' text-base_1-a0'>
      <div className='mb-24'>
        <Title tag='h1' className='font-extrabold mb-4 '>Experiências</Title>
        <p className=''>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at convallis turpis. Proin sit amet eros a justo malesuada facilisis. Integer auctor, ex a vestibulum hendrerit, felis purus facilisis velit, eu luctus.</p>
      </div>
      <div>
        <ExperiencesAccordion/>
      </div>
    </Section>
  )
}
