import { LanguagesFlags } from '@/components/Header/LanguagesFlags'
import { LightAndDarkMode } from '@/components/Header/LightAndDarkMode'
import { Nav } from '@/components/Header/Nav'
import { Button } from '@/components/Sidebar/components/Button'
import React from 'react'

export const MobileSideBar = ({isMenuOpen, setIsMenuOpen}:{isMenuOpen:boolean, setIsMenuOpen:(isMenuOpen:boolean) => void}) => {
  if(isMenuOpen) return (
    <div className='fixed text-right p-8 top-10 left-0 w-screen h-screen bg-base_1-a3 dark:bg-base_2-b8 z-10 transition-colors duration-300'>
        <div className='flex justify-between items-center mb-12'>
          <LanguagesFlags className="w-20" />
          <LightAndDarkMode className="w-fit" />
        </div>
        <Nav className='flex-col items-end text-3xl' setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen}/>
        <div className='w-full flex justify-end mt-12'>
          <Button/>
        </div>
    </div>
  )
}
