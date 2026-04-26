import { LanguagesFlags } from '@/components/Header/LanguagesFlags'
import { LightAndDarkMode } from '@/components/Header/LightAndDarkMode'
import { Nav } from '@/components/Header/Nav'
import React from 'react'

export const DesktopHeader = ({isSticky=false}:{isSticky:boolean}) => {
  return (
    <div className='flex flex-nowrap justify-end items-center gap-8 w-full pr-8'>
      <div className='hidden lg:flex items-center gap-12'>
        <LanguagesFlags className='w-20' />
        <LightAndDarkMode className='w-fit'/>
      </div>
      <Nav  navClassName='hidden lg:block ' className={`${isSticky? 'text-sm':''}`}/>
    </div>
  )
}
