'use client'
import { MobileSideBar } from '@/components/Header/mobile/MobileSideBar'
import { MobileToggleButton } from '@/components/Header/mobile/MobileToggleButton'
import React, { useState } from 'react'

export const MobileHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  return (
<div className='fixed top-0 lg:hidden w-full h-fit pt-4 bg-gradient-to-r from-base_1-a13 to-base_1-a7 z-10'>
<div className='flex justify-between items-center w-full px-4'>
        <p>logo</p>
        <MobileToggleButton isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>
      </div>
      <div className='bg-gradient-to-r from-primary-purple to-primary-blue w-full h-[3px] mt-4'></div>
      <MobileSideBar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>
    </div>
  )
}
