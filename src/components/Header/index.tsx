import { LanguagesFlags } from '@/components/Header/LanguagesFlags'
import { LightAndDarkMode } from '@/components/Header/LightAndDarkMode'
import { Nav } from '@/components/Header/Nav'
import React from 'react'

export const Header = () => {
  return (
    <header className='flex justify-between items-center w-full mb-12 mt-4 '>
      <div className='bg-base_2-c1 flex justify-between items-center text-white w-[35%] px-4 py-2 '>
        <LanguagesFlags currentLanguage='pt-br' className='w-1/12' />
        <LightAndDarkMode className='w-fit'/>
      </div>
      <Nav className=''/>
    </header>
  )
}
