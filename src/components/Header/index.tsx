import { LanguagesFlags } from '@/components/Header/LanguagesFlags'
import { LightAndDarkMode } from '@/components/Header/LightAndDarkMode'
import { Nav } from '@/components/Header/Nav'
import React from 'react'

export const Header = () => {
  return (
    <header className='flex justify-between w-full'>
      <div className='bg-base_2-c1 flex justify-between items-center text-white w-2/12 px-4 py-2 '>
        <LanguagesFlags className='w-1/12' />
        <LightAndDarkMode className='w-fit'/>
      </div>

      <Nav/>
    </header>
  )
}
