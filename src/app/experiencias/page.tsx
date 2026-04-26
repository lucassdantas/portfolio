'use client'
import { ExperiencesAccordion } from '@/app/experiencias/components/ExperiencesAccordion'
import { Section } from '@/components/Section'
import { Title } from '@/components/Title'
import { useLanguage } from '@/contexts/LanguageContext'
import React from 'react'

export default function Experiences () {
  const { t } = useLanguage()

  return (
    <Section limiterClassname='relative h-full' className='text-base_1-a0'>
      <div className='mb-24'>
        <Title tag='h1' className='font-extrabold mb-4 '>{t('experiences.title')}</Title>
        <p className=''>{t('experiences.description')}</p>
      </div>
      <div>
        <ExperiencesAccordion/>
      </div>
    </Section>
  )
}
