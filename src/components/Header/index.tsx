import { LanguagesFlags } from '@/components/Header/LanguagesFlags'
import { LightAndDarkMode } from '@/components/Header/LightAndDarkMode'
import { Nav } from '@/components/Header/Nav'
import React from 'react'

export const Header = () => {
  return (
    <header className='flex justify-between w-full'>
      <div className='bg-base_2-c1 flex justfify-between text-white w-2/12 '>
        <LanguagesFlags/>
        <LightAndDarkMode/>
      </div>

      <Nav/>
    </header>
  )
}
