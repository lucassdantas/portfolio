import Link from 'next/link'
import React from 'react'
import personalImage from '@/assets/eu-rd-serio.png'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import Image from 'next/image'
import { birthday, currentAge, email, location } from '@/utils/personalData'
import { Button } from '@/components/Sidebar/components/Button'
import { Title } from '@/components/Title'
import { Icons } from '@/components/Icons'

export const Sidebar = () => {
  return (
    <div className='bg-white text-black p-4'>
      <div>
        <div className="bg-base_1-a13 h-[150px] w-[150px] -mb-[90px]"></div>
        <Image src={personalImage} alt='Foto Lucas Desenvolvedor' className='max-w-[200px] object-cover h-[200px] ml-[40px] z-10 -mb-[75px]'/>
        <div className="bg-gradient-to-br from-primary-purple to bg-primary-blue h-[100px] w-[100px] ml-[65%]"></div>
      </div>

      <div className='text-center my-10'>
        <h4 className='font-bold'>Lucas Dantas</h4>
        <p>Desenvolvedor Web</p>

        <ul className='flex justify-center gap-4 mt-4'>
          <li><Link href='https://www.linkedin.com/in/lucas-de-sousa-dantas/' target='_blank'><Icons icon='react'/></Link></li>
          <li><Link href='https://github.com/lucassdantas' target='_blank'><FaGithub/></Link></li>
        </ul>
        <hr className='w-[50px] my-4'></hr>

        <Title tag='h4' className='font-bold'>Informações pessoais</Title>
        <ul className='gap-7 text-left'>
          <li className='flex gap-4'>{currentAge} anos</li>
          <li className='flex gap-4'>{location}</li>
          <li className='flex gap-4'><Link href={`mailto:${email}`}>{email}</Link></li>
        </ul>
        
        <Button/>
      </div>
    </div>
  )
}
