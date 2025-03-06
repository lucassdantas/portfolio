'use client'
import { LanguagesFlags } from '@/components/Header/LanguagesFlags'
import { LightAndDarkMode } from '@/components/Header/LightAndDarkMode'
import { MobileSideBar } from '@/components/Header/MobileSideBar'
import { Nav } from '@/components/Header/Nav'
import { Button } from '@/components/Sidebar/components/Button'
import React, { useState } from 'react'

export const MobileHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(true)
  return (
    <div className='block lg:hidden w-full py-2 bg-gradient-to-r from-base_1-a13 to-base_1-a7 '>
      <div className='flex justify-between items-center w-full px-4'>
        <p>logo</p>
        <div className='w-[30px] flex flex-col items-end cursor-pointer' onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className='bg-base_1-a0 w-full h-[3px] mb-[4px]'></div>
          <div className='bg-base_1-a0 w-[75%] h-[3px]'></div>
        </div>
      </div>
      <div className='bg-gradient-to-r from-primary-purple to-primary-blue w-full h-[3px]'></div>
      <MobileSideBar isMenuOpen={isMenuOpen}/>
    </div>
  )
}
