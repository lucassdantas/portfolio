import Image from 'next/image'
import React from 'react'
import personalImage from '@/assets/desenvolvedor-web-lucas-dantas.jpg'

export const ImageWithSquares = () => {
  return (
    <div className='max-w-[250px]'>
      <div className="bg-base_1-a12 h-[150px] w-[150px] -mb-[120px]"></div>
      <Image src={personalImage} alt='Foto Lucas Desenvolvedor' className='max-w-[200px] w-[full] object-cover h-[200px] ml-[40px] z-10 -mb-[75px]'/>
      <div className="bg-gradient-to-br from-primary-purple to bg-primary-blue h-[100px] w-[100px] ml-[65%]"></div>
    </div>
  )
}
