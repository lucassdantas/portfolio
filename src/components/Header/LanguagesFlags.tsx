import Image from 'next/image'
import React from 'react'
import brasilFlag from '@/assets/bandeira-do-brasil.jpg'
import euaFlag from '@/assets/bandeira-dos-eua.jpg'

type LanguageProps = {
  className?:string;
  currentLanguage:string;
}
export const LanguagesFlags = ({className='', currentLanguage='pt-br'}:LanguageProps) => {
  return (
    <div className={className}>
      {currentLanguage === 'pt-br' && (
        <>
          <Image src={brasilFlag} alt='bandeira-do-brasil' className={`relative cursor-pointer -mb-6 z-10`}/>
          <Image src={euaFlag}    alt='bandeira-dos-eua' className={`relative cursor-pointer ml-1 z-0 `}/>
        </>
      )}
    </div>
  )
}
