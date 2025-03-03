import { CertificateCard } from '@/app/educacao/components/CertificateCard'
import { EducationAccordion } from '@/app/educacao/components/EducationAccordion'
import { Section } from '@/components/Section'
import { Title } from '@/components/Title'
import { certifications } from '@/utils/certifications'
import React from 'react'

export default function Education () {
  return (
    <Section limiterClassname='h-full' className=' text-base_1-a0'>
      <div className='mb-24'>
        <Title tag='h1' className='font-extrabold'>Educação</Title>
        <p className=''>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at convallis turpis. Proin sit amet eros a justo malesuada facilisis. Integer auctor, ex a vestibulum hendrerit, felis purus facilisis velit, eu luctus.</p>
      </div>
      <div className='mb-12'>
        <EducationAccordion/>
      </div>
      <div>
        <Title tag={'h2'} className='text-3xl font-bold mb-8'>Certificados</Title>
        <div className="flex gap-x-8 gap-y-12 flex-wrap">
          {certifications.map((certificate, i) => (
            <CertificateCard certificate={certificate} key={i}/>
          ))}
        </div>
      </div>
    </Section>
  )
}
