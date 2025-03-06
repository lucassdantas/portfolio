import { LanguagesFlags } from '@/components/Header/LanguagesFlags'
import { LightAndDarkMode } from '@/components/Header/LightAndDarkMode'
import { Nav } from '@/components/Header/Nav'
import { Button } from '@/components/Sidebar/components/Button'
import React from 'react'

export const MobileSideBar = ({isMenuOpen}:{isMenuOpen:boolean}) => {
  if(isMenuOpen) return (
    <div className='fixed text-right p-8 top-5 left-0 w-screen h-screen bg-base_2-b8 z-10'>
        <div className='flex justify-between items-center mb-12'>
          <LanguagesFlags/>
          <LightAndDarkMode/>
        </div>
        <Nav className='text-base_1-a0 flex-col items-end text-3xl'/>
        <div className='w-full flex justify-end mt-12'>
          <Button/>
        </div>
    </div>
  )
}
