'use client'
import React, { useState } from 'react';
import { AccordionHeader } from '@/app/educacao/components/EducationAccordion/AccordionHeader';
import { AccordionSquare } from '@/app/educacao/components/EducationAccordion/AccordionSquare';
import { educations } from '@/utils/educations';

export const EducationAccordion = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [currentContent, setCurrentContent] = useState<string[]>(educations[0].descriptionList)
  const toggleAccordion = (index: number) => {
    if (expandedIndex === index) {
      return 
    }
    setCurrentContent(educations[index].descriptionList)
    return setExpandedIndex(index);
  };

  return (
    <div className="relative flex">
      <div className='w-1/3 relative'>
        <div className="flex flex-col gap-6">
          <div className="absolute right-0 top-0 h-full border-l-2 border-primary-blue"></div>
          {educations.map((experience, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div key={'i1'+index} className=" pr-6 ">
                <div className="flex flex-col items-start pr-2 pl-4">
                  <AccordionSquare isExpanded={isExpanded} index={index} toggleAccordion={toggleAccordion}/>
                  <AccordionHeader title={experience.course} index={index} period={experience.period} company={experience.institution} toggleAccordion={toggleAccordion} isExpanded={isExpanded}/>
                </div>
                <hr className='w-full border-base_1-a0  mb-1'></hr>
              </div>
            );
          })}
        </div>
      </div>

      <div className='w-2/3 px-24 flex justify-center'>
        <ul className='border-b-8 border-primary-blue w-full list-disc  '>
          {currentContent.map((content, i) => (<li key={i} className={`${(i+1)%3===0&&i!==0? 'mb-4':''}`}>{content}</li>))}
        </ul>
      </div>
    </div>
  );
};
