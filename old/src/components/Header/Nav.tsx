'use client'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'
import React from 'react'

interface NavProps{
  className?:string;
  navClassName?:string;
  setIsMenuOpen?:(isMenuOpen:boolean) => void;
  isMenuOpen?:boolean;
}

export const Nav = ({className='', navClassName='', setIsMenuOpen=() => {''}, isMenuOpen=false}:NavProps) => {
  const { t } = useLanguage()
  const navMenus = [
    {content: t('nav.about'),       url:'/sobre'},
    {content: t('nav.experience'), url:'/experiencias'},
    {content: t('nav.projects'),    url:'/projetos'},
    {content: t('nav.education'),    url:'/educacao'},
  ]
  return (
    <nav className={`${navClassName}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
      <ul className={'flex gap-4 text-2xl text-black dark:text-white '+className}>
        {navMenus.map((menu, i) => (
          <Link
            key={i}
            href={menu.url}
            className='hover:border hover:border-primary-blue p-4 transition-colors duration-300'
          >
            <li>{menu.content}</li>
          </Link>
        ))}
      </ul>
    </nav>
  )
}
