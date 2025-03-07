import React from 'react'
import { Button } from '@/components/Sidebar/components/Button'
import { ImageWithSquares } from '@/components/Sidebar/components/ImageWithSquares'
import { SocialNetworks } from '@/components/Sidebar/components/SocialNetworks'
import { PersonalInfos } from '@/components/Sidebar/components/PersonalInfos'

export const Sidebar = () => {


  return (
    <div className='hidden lg:block bg-white text-black p-4 max-h-[770px] max-w-[290px]'>
      <ImageWithSquares/>

      <div className='text-center mt-8'>
        <h4 className='font-bold'>Lucas Dantas</h4>
        <p className='text-base_1-a4'>Desenvolvedor Web</p>

        <SocialNetworks/>
        <PersonalInfos/>
        <div className='flex justify-center'>
          <Button/>
        </div>
      </div>
    </div>
  )
}
