import React from 'react'
import { InfoIcon } from '@/components/Sidebar/components/InfoIcon'
import { currentAge, email, location } from '@/utils/personalData'
import { useLanguage } from '@/contexts/LanguageContext'

export const PersonalInfos = ({bgColor = 'white'}:{bgColor?:string}) => {
  const { t, language } = useLanguage()
   const infoList = [
      {icon:'user',  content:currentAge + (language === 'pt' ? ' anos' : language === 'fr' ? ' ans' : language === 'es' ? ' años' : ' years old'), url:''},
      {icon:'map',   content:location, url:''},
      {icon:'email', content:email,    url:'mailto:'+ email},
    ]
  
  return (
    <div className="text-black dark:lg:text-black dark:text-white">
      <h4 className='font-bold mt-4 text-black dark:lg:text-black dark:text-white'>{t('sidebar.personalInfo')}</h4>
      <ul className='flex flex-col gap-2 text-left my-5 w-full '>
        {infoList.map((info, i) => (<InfoIcon key={i} icon={info.icon} content={info.content} url={info.url} bgColor={bgColor} />))}
      </ul>
    </div>
  )
}
