import React from 'react'
import { FaMoon } from "react-icons/fa";

export const LightAndDarkMode = ({className=''}:{className:string}) => {
  return (
    <div className={'p-2 flex items-center justify-between bg-base_2-c1 ' + className}>
      <div className='relative w-[50%]'>
        <FaMoon/>
      </div>
      <span className='relative w-[50%] p-4 bg-gradient-to-r from-base_2-c1 to-primary-blue border-b border-l border-black'>Dark</span>
    </div>
  )
}
