import React from 'react'

export const AccordionSquare = ({isExpanded, index, toggleAccordion}:{isExpanded:boolean, index:number, toggleAccordion: (index:number) => any}) => {
  return (
    <button className="flex items-center absolute -left-3 cursor-pointer" onClick={() => toggleAccordion(index)}>
      <div className={`w-6 h-6 ${isExpanded ? 'bg-primary-blue' : 'bg-base_1-a0'} relative left-1/2 transform -translate-x-1/2`}></div>
    </button>
  )
}
