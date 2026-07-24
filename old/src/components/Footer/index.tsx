'use client'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'
import React from 'react'

export const Footer = () => {
  const { t } = useLanguage()
  return (
    <footer className='flex lg:flex-row flex-col items-center justify-between text-xs py-8 px-4'>
      <p>© {new Date().getFullYear()} - {t('footer.developedBy')} <Link href='https://www.linkedin.com/in/lucas-de-sousa-dantas/' target='_blank'>Lucas Dantas</Link></p>
      <p>{t('footer.designBy')} <Link href='https://devmodesto.com.br/' target='_blank'>devModesto</Link></p>
    </footer>
  )
}
