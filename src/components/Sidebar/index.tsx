import Link from 'next/link'
import React from 'react'
import personalImage from '@/assets/eu-rd-serio.png'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import Image from 'next/image'
import { birthday, currentAge } from '@/utils/personalData'
import { Button } from '@/components/Sidebar/components/Button'

export const Sidebar = () => {
  return (
    <div className='bg-white text-black p-4'>
      <div>
        <div className="bg-base_1-a13]"></div>
        <Image src={personalImage} alt='Foto Lucas Desenvolvedor' className='max-w-[200px] object-cover h-[200px]'/>
        <div className="bg-gradient-to-br from-primary-purple to bg-primary-blue"></div>
      </div>

      <div className='text-center'>
        <h4>Lucas Dantas</h4>
        <p>Desenvolvedor Web</p>

        <ul className='flex gap-4 mt-4'>
          <li><Link href='https://www.linkedin.com/in/lucas-de-sousa-dantas/' target='_blank'><FaLinkedin /></Link></li>
          <li><Link href='https://github.com/lucassdantas' target='_blank'><FaGithub/></Link></li>
        </ul>
        <hr className='w-[50px] my-4'></hr>

        <h4>Informações pessoais</h4>
        <ul>
          <li>{currentAge} anos</li>
          <li></li>
          <li><Link href='' target='_blank'></Link></li>
          <li></li>
        </ul>
        
        <Button/>
      </div>
    </div>
  )
}
