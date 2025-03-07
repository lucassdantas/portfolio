import React, { ReactNode } from 'react'

type TitleProps = {
  tag:string;
  children:ReactNode,
  isBigText?:boolean,
  className?:string
}
export const Title = ({children, tag='h1', isBigText=false, className=''}:TitleProps) => {

  if (tag === 'h1') return <h1 className={`title ${isBigText? 'lg:text-6xl text-4xl':'text-3xl'} ${className} `}>{children}</h1>
  if (tag === 'h2') return <h2 className={`title ${className} `}>{children}</h2>
  if (tag === 'h3') return <h3 className={`title ${className} `}>{children}</h3>
  if (tag === 'h4') return <h4 className={`title ${className} `}>{children}</h4>
  if (tag === 'h5') return <h5 className={`title ${className} `}>{children}</h5>
  if (tag === 'h6') return <h6 className={`title ${className} `}>{children}</h6>

  return <h2 className={` ${className} `}>{children}</h2>
}
