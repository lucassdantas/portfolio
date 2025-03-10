import Link from 'next/link'
import React from 'react'

export const Button = () => {
  return (
    <Link href='https://www.linkedin.com/in/lucas-de-sousa-dantas/' target='_blank' className='bg-gradient-to-r from-primary-purple to-primary-blue text-white p-4 cursor-pointer font-bold w-fit' >
        Fale comigo agora
    </Link>
  )
}
