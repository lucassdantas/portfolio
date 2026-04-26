'use client'
import { DesktopHeader } from '@/components/Header/DesktopHeader'
import { MobileHeader } from '@/components/Header/mobile/MobileHeader'
import React, { useState, useEffect } from 'react'

export const Header = () => {
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`relative lg:sticky top-0 z-10 flex justify-between items-center w-full lg:mb-6 lg:mt-4 overflow-x-hidden transition-colors duration-300
      ${isSticky ? 'bg-base_1-a3 dark:bg-base_2-b8' : ''}`}
    >
      <DesktopHeader isSticky={isSticky}/>
      <MobileHeader />
    </header>
  )
}
