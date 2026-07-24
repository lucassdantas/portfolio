import { ReactNode } from 'react'

export const Limiter = ({children, className=''}:{children:ReactNode, className?:string}) => {
  return (
    <div className='w-full h-full flex justify-center items-center'>
      <div className={`max-w-[1300px] w-full ${className}`}>{children}</div>
    </div>
  )
}
