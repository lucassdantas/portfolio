'use client'
import React, { useState } from 'react';
import { experiences } from '@/utils/experiences';
import { AccordionHeader } from '@/app/experiencias/components/ExperiencesAccordion/AccordionHeader';
import { AccordionSquare } from '@/app/experiencias/components/ExperiencesAccordion/AccordionSquare';

export const ExperiencesAccordion = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [showAllDetails, setShowAllDetails] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    if (expandedIndex === index) return setExpandedIndex(null); 
    return setExpandedIndex(index);
  };

  return (
    <div className="relative">
      <div className="absolute left-0 top-0 h-full border-l-2 border-primary-blue"></div>
      
      <div className="flex flex-col gap-6">
        {experiences.map((experience, index) => {
          const isExpanded = expandedIndex === index;
          const isShowingAll = showAllDetails === index;
          const detailsToShow = isShowingAll ? experience.experienceDetails : experience.experienceDetails.slice(0, 4);

          return (
            <div key={'i1'+index} className="flex flex-col pl-10 pr-6 pb-4">
              <div className="flex justify-between items-center">
                <AccordionSquare isExpanded={isExpanded} index={index} toggleAccordion={toggleAccordion}/>
                <AccordionHeader title={experience.title} index={index} period={experience.period} company={experience.company} toggleAccordion={toggleAccordion} isExpanded={isExpanded}/>
              </div>
              <hr className=' border-primary-blue mt-4 mb-1'></hr>
              {isExpanded && (
                <div className='relative flex flex-col items-end'>
                  <div className="pl-8 py-4 pr-4 border border-primary-blue relative overflow-hidden">
                    <ul className="list-disc space-y-2 marker:text-base_1-a7 w-[99%] relative">
                      {detailsToShow.map((detail, i) => (
                        <li key={'i2'+i} className={
                          `text-sm pl-4 
                            ${!isShowingAll && i === 2 ? 'opacity-80' : ''} 
                            ${!isShowingAll && i === 3 ? 'opacity-40' : ''} 
                            ${!isShowingAll && i >   3 ? 'opacity-0'  : ''}
                          `}
                        >
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {!isShowingAll && (
                    <button className="mt-4 text-base_1-a0 border border-primary-blue py-2 px-4" onClick={() => setShowAllDetails(index)}>
                      Ver mais
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
