import React from 'react'
import { IoCloseSharp } from 'react-icons/io5'

export const MobileToggleButton = ({isMenuOpen, setIsMenuOpen}:{isMenuOpen:boolean, setIsMenuOpen:(isMenuOpen:boolean) => void}) => {
  return (
    <button className='w-[30px] flex flex-col items-end cursor-pointer' onClick={() => setIsMenuOpen(!isMenuOpen)}>
      {!isMenuOpen &&
        <>
          <div className={`bg-base_1-a0 w-full h-[3px] mb-[4px]`}></div>
          <div className={`bg-base_1-a0 w-[75%] h-[3px]`}></div>
        </>
      }
      {isMenuOpen && <IoCloseSharp/> }
    </button>
  )
}
