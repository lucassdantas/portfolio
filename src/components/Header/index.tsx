import { DesktopHeader } from '@/components/Header/DesktopHeader'
import { MobileHeader } from '@/components/Header/mobile/MobileHeader'
import React from 'react'

export const Header = () => {
  return (
    <header className='relative flex justify-between items-center w-full lg:mb-12 lg:mt-4 overflow-x-hidden'>
      <DesktopHeader/>
      <MobileHeader/>
    </header>
  )
}
