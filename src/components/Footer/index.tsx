import Link from 'next/link'
import React from 'react'

export const Footer = () => {
  return (
    <footer className='flex items-center justify-between'>
      <p>© {new Date().getFullYear()} - Desenvolvido por <Link href='https://www.linkedin.com/in/lucas-de-sousa-dantas/' target='_blank'>Lucas Dantas</Link></p>
      <p>Design por <Link href='' target='_blank'>Gabriel Modesto</Link></p>
    </footer>
  )
}
