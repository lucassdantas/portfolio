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
    <div className="flex flex-col cursor-pointer pb-4" onClick={() => toggleAccordion(index)}>
      <span className="text-sm text-base_2-c0 mb-2">{period}</span>
      <Title tag="h4" className="font-bold">{title}</Title>
      <span className="text-sm text-base_2-c0">{company}</span>
    </div>
  
  )
}
