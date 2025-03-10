import Link from 'next/link'
import React from 'react'

export const Footer = () => {
  return (
    <footer className='flex lg:flex-row flex-col items-center justify-between text-xs py-8 px-4'>
      <p>© {new Date().getFullYear()} - Desenvolvido por <Link href='https://www.linkedin.com/in/lucas-de-sousa-dantas/' target='_blank'>Lucas Dantas</Link></p>
      <p>Design por <Link href='https://devmodesto.com.br/' target='_blank'>devModesto</Link></p>
    </footer>
  )
}
