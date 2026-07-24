import React, { ReactNode } from 'react'
import { BiSolidUser } from 'react-icons/bi';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';

interface IconsProps{
  icon:string;
  className?:string;
  bgClassName?:string;
}

export const Icons = ({icon, className='', bgClassName=''}:IconsProps) => {
  if(icon === 'linkedin') return <IconBackground className={`${bgClassName} `}> <FaLinkedinIn className={`${className} `} /> </IconBackground>
  if(icon === 'github')   return <IconBackground className={`${bgClassName} `}> <FaGithub     className={`${className} `} /> </IconBackground>
  if(icon === 'user')     return <IconBackground className={`${bgClassName} `}> <BiSolidUser  className={`${className} `} /> </IconBackground>
  if(icon === 'map')      return <IconBackground className={`${bgClassName} `}> <FaLocationDot className={`${className} `} /> </IconBackground>
  if(icon === 'email')    return <IconBackground className={`${bgClassName} `}> <MdEmail      className={`${className} `} /> </IconBackground>
}


const IconBackground = ({children, className=''}:{children:ReactNode, className?:string}) => {
  return <div className={`bg-base_1-a1 text-base_1-a5 p-1 ${className} `}>{children}</div>
}
