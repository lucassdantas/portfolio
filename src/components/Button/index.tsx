import React, { ReactNode } from 'react'

export const Button = ({children, onClick}:{children:ReactNode, onClick?:()=>any}) => {
  return (
    <button className="mt-4 text-base_1-a0 border border-primary-blue py-2 px-4" onClick={() => onClick}>
      {children}
    </button>
  )
}
