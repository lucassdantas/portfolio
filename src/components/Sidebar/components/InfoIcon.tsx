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
    <div className="text-black w-full">
      <li className='flex gap-4 items-center text-black w-full'>
        <Icons icon={icon} bgClassName='bg-base_1-a12' className='text-base_1-a3'/> 
        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
          {url ? (
            <Link href={url} className="text-black hover:text-primary-blue transition-colors">
              {content}
            </Link>
          ) : (
            <span className="text-black">{content}</span>
          )}
        </div>
      </li>
      <Separator className='w-[50px] h-[2px] lg:bg-neutral-100 bg-base_1-a5 mt-2 mb-2'/>
    </div>
  )
}
