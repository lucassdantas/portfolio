import { LanguagesFlags } from '@/components/Header/LanguagesFlags'
import { LightAndDarkMode } from '@/components/Header/LightAndDarkMode'
import { Nav } from '@/components/Header/Nav'
import React from 'react'

export const DesktopHeader = ({isSticky=false}:{isSticky:boolean}) => {
  return (
    <div className='flex flex-nowrap justify-between items-center w-full pr-8'>
      <div className='hidden lg:flex items-center justify-between w-[290px] px-4 min-h-[40px]'>
        <LanguagesFlags />
        <LightAndDarkMode />
      </div>
      <Nav  navClassName='hidden lg:block ' className={`${isSticky? 'text-sm':''}`}/>
    </div>
  )
}
