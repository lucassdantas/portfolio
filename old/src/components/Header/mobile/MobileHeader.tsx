'use client'
import { MobileSideBar } from '@/components/Header/mobile/MobileSideBar'
import { MobileToggleButton } from '@/components/Header/mobile/MobileToggleButton'
import React, { useState } from 'react'

export const MobileHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  return (
<div className='fixed top-0 lg:hidden w-full h-fit pt-4 bg-base_1-a3 dark:bg-base_1-a13 z-10 transition-colors duration-300 border-b border-gray-200 dark:border-base_1-a10'>
<div className='flex justify-between items-center w-full px-4'>
        <p className="text-black dark:text-white font-bold uppercase tracking-widest transition-colors duration-300">DEV.DANTAS</p>
        <MobileToggleButton isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>
      </div>
      <div className='bg-gradient-to-r from-primary-purple to-primary-blue w-full h-[3px] mt-4'></div>
      <MobileSideBar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>
    </div>
  )
}
