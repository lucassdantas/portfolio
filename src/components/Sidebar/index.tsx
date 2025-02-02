import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { currentAge, email, location } from '@/utils/personalData'
import { Button } from '@/components/Sidebar/components/Button'
import { Title } from '@/components/Title'
import { Icons } from '@/components/Icons'
import personalImage from '@/assets/eu-rd-serio.png'
import { Separator } from '@/components/Separator'
import { InfoIcon } from '@/components/Sidebar/components/InfoIcon'

export const Sidebar = () => {
  const infoList = [
    {icon:'user',  content:currentAge + ' anos', url:''},
    {icon:'map',   content:location, url:''},
    {icon:'email', content:email,    url:'mailto:'+ email},
  ]

  return (
    <div className='bg-white text-black p-4'>
      <div>
        <div className="bg-base_1-a13 h-[150px] w-[150px] -mb-[90px]"></div>
        <Image src={personalImage} alt='Foto Lucas Desenvolvedor' className='max-w-[200px] object-cover h-[200px] ml-[40px] z-10 -mb-[75px]'/>
        <div className="bg-gradient-to-br from-primary-purple to bg-primary-blue h-[100px] w-[100px] ml-[65%]"></div>
      </div>

      <div className='text-center my-10'>
        <h4 className='font-bold'>Lucas Dantas</h4>
        <p className='text-base_1-a4'>Desenvolvedor Web</p>

        <div className='text-center flex justify-center items-center flex-col'>
          <ul className='flex justify-center gap-4 mt-4'>
            <li><Link href='https://www.linkedin.com/in/lucas-de-sousa-dantas/' target='_blank'><Icons icon='linkedin' className='text-2xl'/></Link></li>
            <li><Link href='https://github.com/lucassdantas' target='_blank'><Icons icon='github'  className='text-2xl'/></Link></li>
          </ul>
          <Separator className='w-2/4'/>
        </div>

        <Title tag='h4' className='font-bold'>Informações pessoais</Title>
        <ul className='flex flex-col gap-4 text-left my-5'>
          {infoList.map((info, i) => (<InfoIcon key={i} icon={info.icon} content={info.content} url={info.url}/>))}
        </ul>
        <div className='flex justify-center'>
          <Button/>
        </div>
      </div>
    </div>
  )
}
