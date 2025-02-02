import React from 'react'

export const Separator = ({className=''}:{className?:string}) => {
  return (
    <div className={`relative w-[50px] h-[3px] my-4 bg-base_1-a1 ${className} `}></div>
  )
}
