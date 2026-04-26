'use client'

import React from 'react'
import { FaMoon, FaSun } from "react-icons/fa"
import { useTheme } from '@/contexts/ThemeContext'

export const LightAndDarkMode = ({ className = '' }: { className?: string }) => {
  const { theme, toggleTheme } = useTheme()

  return (
    <div
      onClick={toggleTheme}
      role="button"
      aria-label="Toggle theme"
      className={`flex items-center cursor-pointer overflow-hidden rounded-sm border border-black dark:border-white transition-all duration-300 ${className}`}
      style={{ height: '36px' }}
    >
      <div className={`flex items-center justify-center w-10 h-full bg-base_1-a0 dark:bg-base_2-c1 transition-colors duration-300`}>
        {theme === 'dark' ? <FaMoon className="text-primary-blue" /> : <FaSun className="text-yellow-500" />}
      </div>
      <div className={`flex items-center px-4 h-full bg-gradient-to-r from-base_1-a2 to-base_1-a0 dark:from-base_2-c1 dark:to-primary-blue text-xs font-bold uppercase tracking-wider transition-all duration-300`}>
        {theme === 'dark' ? 'Dark' : 'Light'}
      </div>
    </div>
  )
}
