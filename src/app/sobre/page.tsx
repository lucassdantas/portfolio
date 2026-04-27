'use client'
import { Technologies } from '@/app/sobre/components/Technologies'
import { Section } from '@/components/Section'
import { ImageWithSquares } from '@/components/Sidebar/components/ImageWithSquares'
import { PersonalInfos } from '@/components/Sidebar/components/PersonalInfos'
import { SocialNetworks } from '@/components/Sidebar/components/SocialNetworks'
import { Title } from '@/components/Title'
import { useLanguage } from '@/contexts/LanguageContext'
import React from 'react'

export default function About () {
  const { t } = useLanguage()

  return (
    <Section limiterClassname='relative flex flex-col justify-between h-full ' className='text-black dark:text-base_1-a0 text-center lg:text-left lg:py-12 lg:px-12 py-12 px-4 h-full min-h-fit'>
      <div className='h-1/2 '>
        <Title tag='h2' className='font-bold text-2xl'>{t('about.name')}</Title>
        <Title tag='h1' isBigText={true} className='font-extrabold text-2xl'>{t('about.role')}</Title>
        <p className='lg:text-2xl text-base text-black dark:text-base_1-a0 '>{t('about.description')}</p>
      </div>
      <div className='lg:hidden flex flex-col items-center pt-12 mb-12 w-full'>
        <ImageWithSquares/>
        <SocialNetworks/>
        <PersonalInfos bgColor='dark'/>
      </div>
      <div className='h-1/2 text-left mb-6'>
        <Title tag='h2' className='text-3xl font-bold '>{t('about.technologiesTitle')}</Title>
        <p className='mb-4'>{t('about.technologiesDescription')}</p>
        <Technologies/>
      </div>
    </Section>
  )
}
