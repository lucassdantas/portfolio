import { Title } from '@/components/Title'
import React from 'react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

interface AccordeonHeaderProps{
  period:string;
  title:string;
  company:string;
  index:number;
  toggleAccordion: (index:number) => any;
  isExpanded:boolean;
}
export const AccordionHeader = ({period, title, company, index, toggleAccordion, isExpanded}:AccordeonHeaderProps) => {
  return (
    <>
      <div className="flex flex-col items-start cursor-pointer" onClick={() => toggleAccordion(index)}>
        <span className="text-sm text-base_2-c0">{period}</span>
        <Title tag="h4" className="font-bold">{title}</Title>
      </div>

      <div className="flex flex-col gap-2 justify-center items-end ml-4 cursor-pointer" onClick={() => toggleAccordion(index)}>
        <span className="text-sm text-base_1-a0">{company}</span>
        <button className="cursor-pointer text-primary-blue" onClick={() => toggleAccordion(index)}>
          {isExpanded ? (<FaArrowRight size={12} />) : (<FaArrowLeft size={12} /> )}
        </button>
      </div>
    </>
    
  )
}
