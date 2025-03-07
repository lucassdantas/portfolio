import { Icons } from '@/components/Icons'
import { Separator } from '@/components/Separator'
import Link from 'next/link'
import React from 'react'

export const SocialNetworks = () => {
  return (
    <div className='text-center flex justify-center items-center flex-col lg:w-full w-[250px]'>
      <ul className='flex justify-center gap-4 mt-4'>
        <li><Link href='https://www.linkedin.com/in/lucas-de-sousa-dantas/' target='_blank'><Icons icon='linkedin' className='text-2xl lg:text-inherit text-base_1-a12'/></Link></li>
        <li><Link href='https://github.com/lucassdantas' target='_blank'><Icons icon='github'  className='text-2xl lg:text-inherit text-base_1-a12'/></Link></li>
      </ul>
      <Separator className='h-[3px] lg:my-4 my-12 bg-base_1-a1 lg:w-2/4 w-full'/>
    </div>
  )
}
