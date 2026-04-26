'use client'
import React from 'react'
import { Button } from '@/components/Sidebar/components/Button'
import { ImageWithSquares } from '@/components/Sidebar/components/ImageWithSquares'
import { SocialNetworks } from '@/components/Sidebar/components/SocialNetworks'
import { PersonalInfos } from '@/components/Sidebar/components/PersonalInfos'
import { useLanguage } from '@/contexts/LanguageContext'

export const Sidebar = () => {
  const { t } = useLanguage()

  return (
    <div className='hidden lg:block bg-white dark:bg-base_1-13 text-black dark:text-white p-4 max-h-[770px] w-full max-w-[290px] sticky top-0 z-40 transition-colors duration-300'>
      <ImageWithSquares/>

      <div className='text-center mt-8'>
        <h4 className='font-bold'>Lucas Dantas</h4>
        <p className='text-base_1-a4'>{t('sidebar.role')}</p>

        <SocialNetworks/>
        <PersonalInfos/>
        <div className='flex justify-center'>
          <Button/>
        </div>
      </div>
    </div>
  )
}
