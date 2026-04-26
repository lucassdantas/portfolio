'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import pt from '../locales/pt.json'
import en from '../locales/en.json'
import fr from '../locales/fr.json'
import es from '../locales/es.json'

type Language = 'pt' | 'en' | 'fr' | 'es'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => any
}

const translations = { pt, en, fr, es }

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt')

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang && translations[savedLang]) {
      setLanguage(savedLang)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
    document.documentElement.lang = lang
  }

  const t = (key: string) => {
    const keys = key.split('.')
    let value: any = translations[language]
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
