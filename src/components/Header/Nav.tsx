import Link from 'next/link'
import React from 'react'

export const Nav = () => {
  const navMenus = [
    {content:'Sobre', url:'/sobre'},
    {content:'Experiência', url:'/experiencias'},
    {content:'Projetos', url:'/projetos'},
    {content:'Educação', url:'/educacao'},
  ]
  return (
    <nav>
      <ul className='flex gap-4 text-2xl'>
        {navMenus.map((menu, i) => (
          <li key={i}><Link href={menu.url}>{menu.content}</Link></li>
        ))}
        
      </ul>
    </nav>
  )
}
