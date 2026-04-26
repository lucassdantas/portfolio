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
    <div className='hidden lg:block bg-white text-black p-4 h-fit w-full max-w-[290px] sticky top-0 z-40 transition-colors duration-300 shadow-sm'>
      <ImageWithSquares/>

      <div className='text-center mt-8 text-black'>
        <h4 className='font-bold text-black text-xl'>Lucas Dantas</h4>
        <p className='text-base_2-c0 font-medium mb-6'>{t('sidebar.role')}</p>

        <SocialNetworks/>
        <div className="text-black border-t border-gray-100 mt-6 pt-2">
          <PersonalInfos/>
        </div>
        <div className='flex justify-center mt-6'>
          <Button/>
        </div>
      </div>
    </div>
  )
}
