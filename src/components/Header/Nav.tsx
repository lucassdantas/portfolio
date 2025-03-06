import Link from 'next/link'
import React from 'react'

export const Nav = ({className='', navClassName=''}:{className?:string, navClassName?:string}) => {
  const navMenus = [
    {content:'Sobre',       url:'/sobre'},
    {content:'Experiência', url:'/experiencias'},
    {content:'Projetos',    url:'/projetos'},
    {content:'Educação',    url:'/educacao'},
  ]
  return (
    <nav className={`${navClassName}`}>
      <ul className={'flex gap-4 text-2xl'+className}>
        {navMenus.map((menu, i) => <Link key={i} href={menu.url} className='hover:border hover:border-primary-blue p-4'><li>{menu.content}</li></Link>)}
      </ul>
    </nav>
  )
}
