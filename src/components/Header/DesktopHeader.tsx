import { LanguagesFlags } from '@/components/Header/LanguagesFlags'
import { LightAndDarkMode } from '@/components/Header/LightAndDarkMode'
import { Nav } from '@/components/Header/Nav'
import React from 'react'

export const DesktopHeader = ({isSticky=false}:{isSticky:boolean}) => {
  return (
    <div className='flex flex-nowrap justify-end w-full'>
      {/* <div className='bg-base_2-c1 hidden lg:flex justify-between items-center text-white w-[19%] px-4 py-2 '>
        <p>Em desenvolvimento</p>
        { <LanguagesFlags currentLanguage='pt-br' className='w-1/12' />
        <LightAndDarkMode className='w-fit'/> }
      </div> */}
      <Nav  navClassName='hidden lg:block ' className={`${isSticky? 'text-sm':''}`}/>
    </div>
  )
}
