'use client'

import React from 'react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import brasilFlag from '@/assets/bandeira-do-brasil.jpg'
import euaFlag from '@/assets/bandeira-dos-eua.jpg'

// Placeholder for missing flags - in a real scenario these would be assets
const franceFlag = "https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg"
const spainFlag = "https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg"

import { FaChevronDown } from 'react-icons/fa'

const languageConfig = [
  { code: 'pt', img: brasilFlag, alt: 'Português BR' },
  { code: 'en', img: euaFlag, alt: 'Inglês (US)' },
  { code: 'fr', img: franceFlag, alt: 'Français' },
  { code: 'es', img: spainFlag, alt: 'Español' },
]

export const LanguagesFlags = ({ className = '' }: { className?: string }) => {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = React.useState(false)

  // Current language first
  const currentLang = languageConfig.find(l => l.code === language)!
  const otherLanguages = languageConfig.filter(l => l.code !== language)

  // Show at most 3 flags (current + 2 others)
  const visibleLanguages = [currentLang, ...otherLanguages.slice(0, 2)]

  return (
    <div
      className={`relative flex flex-col items-center group pt-6 ${className}`}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="relative h-14 w-24">
        {visibleLanguages.map((lang, index) => (
          <div
            key={lang.code}
            onClick={() => setLanguage(lang.code as any)}
            className="absolute transition-all duration-300 cursor-pointer hover:scale-110"
            style={{
              zIndex: 40 - index,
              left: `${index * 12}px`,
              top: `${20 - (index * 8)}px`,
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

      <div
        className="flex flex-col items-center mt-2 cursor-pointer p-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaChevronDown size={12} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary-blue' : 'text-gray-400'}`} />

        {isOpen && (
          <div className="absolute top-full mt-2 bg-white dark:bg-base_2-b8 border border-gray-200 dark:border-base_1-a7 shadow-xl rounded-md p-2 z-50 min-w-[160px] right-[-40px] lg:right-auto">
            {languageConfig.map((lang) => (
              <div
                key={lang.code}
                onClick={(e) => {
                  e.stopPropagation();
                  setLanguage(lang.code as any);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-base_1-10 cursor-pointer rounded-sm ${language === lang.code ? 'bg-blue-50 dark:bg-primary-darkBlue' : ''}`}
              >
                <img
                  src={typeof lang.img === 'string' ? lang.img : lang.img.src}
                  alt={lang.alt}
                  className="w-6 h-4 object-cover border border-gray-200"
                />
                <span className="text-xs font-medium text-black dark:text-white whitespace-nowrap">{lang.alt}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
