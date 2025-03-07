import React from 'react'
import { InfoIcon } from '@/components/Sidebar/components/InfoIcon'
import { currentAge, email, location } from '@/utils/personalData'

export const PersonalInfos = () => {
   const infoList = [
      {icon:'user',  content:currentAge + ' anos', url:''},
      {icon:'map',   content:location, url:''},
      {icon:'email', content:email,    url:'mailto:'+ email},
    ]
  
  return (
    <>
      <h4 className='font-bold mt-4'>Informações pessoais</h4>
      <ul className='flex flex-col gap-2 text-left my-5 w-full'>
        {infoList.map((info, i) => (<InfoIcon key={i} icon={info.icon} content={info.content} url={info.url}/>))}
      </ul>
    </>
  )
}
