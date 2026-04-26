import React from 'react'
import { IoCloseSharp } from 'react-icons/io5'

export const MobileToggleButton = ({isMenuOpen, setIsMenuOpen}:{isMenuOpen:boolean, setIsMenuOpen:(isMenuOpen:boolean) => void}) => {
  return (
    <button className='w-[30px] flex flex-col items-end cursor-pointer' onClick={() => setIsMenuOpen(!isMenuOpen)}>
      {!isMenuOpen &&
        <>
          <div className={`bg-black dark:bg-white w-full h-[3px] mb-[4px] transition-colors duration-300`}></div>
          <div className={`bg-black dark:bg-white w-[75%] h-[3px] transition-colors duration-300`}></div>
        </>
      }
      {isMenuOpen && <IoCloseSharp className="text-black dark:text-white transition-colors duration-300" size={30} /> }
    </button>
  )
}
