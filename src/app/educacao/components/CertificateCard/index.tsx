'use client'
import { Title } from '@/components/Title'
import { Certificate } from '@/types/certificatesType'
import Link from 'next/link'
import React, { useState } from 'react'
import { FaArrowUp } from 'react-icons/fa'
import { MdArrowOutward } from 'react-icons/md'

interface CertificateCardProps{
  certificate:Certificate
}
export const CertificateCard = ({certificate}:CertificateCardProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false)
  return (
    <div className='relative bg-base_1-a0 text-black p-3 lg:w-[30%] sm:w-[45%] w-full' onMouseOver={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className={`absolute bg-base_2-c1 w-full h-full -z-10 -bottom-4 -right-4 transition-colors duration-150 ease-in-out ${isHovered? 'border border-primary-blue':''}`} ></div>
      <div className='flex justify-between'>
        <span className='text-sm'>{certificate.period}</span>
        {certificate.url&&
          <Link href={certificate.url} target='_blank' className={`bg-base_2-c1 w-[28px] h-[28px] p-[2px] transitoin-all duration-300 ease-in-out ${isHovered? 'w-[22px] h-[24px]':''}`}>
            <FaArrowUp  className={`text-primary-blue  text-2xl transitoin-all duration-300 ease-in-out rotate-45 ${isHovered? '-mt-4 -mr-12':''}`}/>
          </Link>
        }
      </div>
      <Title tag={'h3'} className='font-bold text-xl -mb-2'>{certificate.title}</Title>
      <p className='-mb-2 text-sm'>{certificate.institution}</p>
      <p className='text-right w-full text-2xl'>{certificate.hours}h</p>
    </div>
  )
}
