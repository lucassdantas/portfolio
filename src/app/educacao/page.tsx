'use client'
import { CertificateCard } from '@/app/educacao/components/CertificateCard'
import { EducationAccordion } from '@/app/educacao/components/EducationAccordion'
import { Section } from '@/components/Section'
import { Title } from '@/components/Title'
import { certifications } from '@/utils/certifications'
import { useLanguage } from '@/contexts/LanguageContext'
import React from 'react'

export default function Education () {
  const { t } = useLanguage()

  return (
    <Section limiterClassname='h-full' className='text-black dark:text-base_1-a0 lg:overflow-y-hidden'>
      <div className='mb-24'>
        <Title tag='h1' className='font-extrabold mb-4'>{t('education.title')}</Title>
        <p className=''>{t('education.description')}</p>
      </div>
      <div className='mb-12'>
        <EducationAccordion/>
      </div>
      <div>
        <Title tag={'h2'} className='text-3xl font-bold mb-8'>{t('education.certificatesTitle')}</Title>
        <div className="flex justify-between gap-x-8 gap-y-12 flex-wrap w-full h-fit pb-4 pr-4 overflow-visible">
          {certifications.map((certificate, i) => (
            <CertificateCard certificate={certificate} key={i}/>
          ))}
        </div>
      </div>
    </Section>
  )
}
