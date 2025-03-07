import { Icons } from '@/components/Icons'
import { Separator } from '@/components/Separator'
import Link from 'next/link';
import React from 'react'

type InfoProps={
  icon:string;
  url?:string;
  content:string;
}
export const InfoIcon = ({icon, url='', content}:InfoProps) => {
  return (
    <>
      <li className='flex gap-4 '>
        <Icons icon={icon} bgClassName='bg-base_1-a12' className='text-base_1-a3'/> 
        {url?<Link href={url}>{content}</Link>:<span>{content}</span>}
      </li>
      <Separator className='w-[50px] h-[2px] lg:bg-neutral-100 bg-base_1-a5'/>
    </>
  )
}
