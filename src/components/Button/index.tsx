import React, { ReactNode } from 'react'

export const Button = ({children, onClick, className=''}:{children:ReactNode, onClick?:()=>any, className?:string}) => {
  return (
    <button className={`mt-4 text-base_1-a0 border border-primary-blue py-2 px-4 ${className}`} onClick={() => onClick}>
      {children}
    </button>
  )
}
