'use client'

import React from 'react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import brasilFlag from '@/assets/bandeira-do-brasil.jpg'
import euaFlag from '@/assets/bandeira-dos-eua.jpg'

// Placeholder for missing flags - in a real scenario these would be assets
const franceFlag = "https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg"
const spainFlag = "https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg"

const languageConfig = [
  { code: 'pt', img: brasilFlag, alt: 'Português' },
  { code: 'en', img: euaFlag, alt: 'English' },
  { code: 'fr', img: franceFlag, alt: 'Français' },
  { code: 'es', img: spainFlag, alt: 'Español' },
]

export const LanguagesFlags = ({ className = '' }: { className?: string }) => {
  const { language, setLanguage } = useLanguage()

  // Put current language first
  const sortedLanguages = [
    languageConfig.find(l => l.code === language)!,
    ...languageConfig.filter(l => l.code !== language)
  ]

  return (
    <div className={`relative flex items-center h-10 ${className}`}>
      {sortedLanguages.map((lang, index) => (
        <div
          key={lang.code}
          onClick={() => setLanguage(lang.code as any)}
          className="absolute transition-all duration-300 cursor-pointer hover:scale-110"
          style={{
            zIndex: 40 - index,
            left: `${index * 12}px`,
            top: `-${index * 8}px`,
            width: '32px',
            height: '22px',
          }}
        >
          <img
            src={typeof lang.img === 'string' ? lang.img : lang.img.src}
            alt={lang.alt}
            className="w-full h-full object-cover border border-gray-300 shadow-sm rounded-sm"
          />
        </div>
      ))}
    </div>
  )
}
