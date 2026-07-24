import Link from 'next/link'
import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export const Button = () => {
  const { t } = useLanguage()
  return (
    <Link
      href='https://www.linkedin.com/in/lucas-de-sousa-dantas/'
      target='_blank'
      className='bg-gradient-to-r from-primary-purple to-primary-blue text-white p-4 cursor-pointer font-bold w-full max-w-[240px] text-center rounded-sm transition-transform hover:scale-[1.02]'
    >
        {t('sidebar.contactMe')}
    </Link>
  )
}
