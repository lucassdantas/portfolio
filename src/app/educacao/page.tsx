import { EducationAccordion } from '@/app/educacao/components/EducationAccordion'
import { Section } from '@/components/Section'
import { Title } from '@/components/Title'
import React from 'react'

export default function Education () {
  return (
    <Section limiterClassname='relative  h-full' className=' text-base_1-a0'>
      <div className='mb-24'>
        <Title tag='h1' className='font-extrabold'>Educação</Title>
        <p className=''>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at convallis turpis. Proin sit amet eros a justo malesuada facilisis. Integer auctor, ex a vestibulum hendrerit, felis purus facilisis velit, eu luctus.</p>
      </div>
      <div>
        <EducationAccordion/>
      </div>
    </Section>
  )
}
