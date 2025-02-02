import React from 'react'
import { FaLinkedin } from 'react-icons/fa';

interface IconsProps{
  icon:string;
  className?:string;
}
export const Icons = ({icon, className=''}:IconsProps) => {
  if(icon === 'react') return <FaLinkedin className='text-neutral-600 ' />
  return (
    <div>Icons</div>
  )
}
