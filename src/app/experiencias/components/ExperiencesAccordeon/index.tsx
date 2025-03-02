'use client'
import React, { useState } from 'react';
import { experiences } from '@/utils/experiences';
import { Title } from '@/components/Title';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

export const ExperiencesAccordion = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    if (expandedIndex === index) {
      setExpandedIndex(null); // Se já estiver aberto, fecha o acordeão
    } else {
      setExpandedIndex(index); // Caso contrário, abre o acordeão
    }
  };

  return (
    <div className="relative">
      <div className="absolute left-0 top-0 h-full border-l-2 border-primary-blue"></div>
      
      <div className="flex flex-col gap-6">
        {experiences.map((experience, index) => (
          <div key={index} className="flex flex-col pl-10 pr-6 pb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center absolute -left-3">
                {expandedIndex === index ? 
                  <div className={`w-6 h-6 bg-primary-blue relative left-1/2 transform -translate-x-1/2`}></div>:
                  <div className={`w-6 h-6 bg-base_1-a0 relative left-1/2 transform -translate-x-1/2`}></div>
                }
              </div>

              {/* Informações de Período, Título e Empresa */}
              <div className="flex flex-col items-start">
                <span className="text-sm text-base_2-c0">{experience.period}</span>
                <Title tag="h4" className="font-bold">{experience.title}</Title>
              </div>

              {/* Informações da Empresa na Horizontal */}
              <div className="flex flex-col gap-2 justify-center items-end ml-4">
                <span className="text-sm text-base_1-a0">{experience.company}</span>
                <button className="cursor-pointer text-primary-blue" onClick={() => toggleAccordion(index)}>
                  {expandedIndex === index ? (<FaArrowRight size={12} />) : (<FaArrowLeft size={12} /> )}
                </button>
              </div>

              
            </div>
            <hr className=' border-primary-blue mt-4 mb-1'></hr>
            {/* Acordeão Expandido */}
            {expandedIndex === index && (
              <div className="pl-8 py-4 pr-4 border border-primary-blue  ">
                <ul className="list-disc space-y-2 marker:text-base_1-a7 w-[99%] ">
                  {experience.experienceDetails.map((detail, i) => (<li key={i} className="text-sm pl-4 ">{detail}</li>))}
                </ul>
                <button className="mt-4 text-primary-blue">Ver mais</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
