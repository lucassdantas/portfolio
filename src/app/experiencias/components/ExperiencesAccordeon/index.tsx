'use client'
import React, { useState } from 'react';
import { experiences } from '@/utils/experiences';
import { Title } from '@/components/Title';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

export const ExperiencesAccordion = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    if (expandedIndex === index) {
      setExpandedIndex(null); // Se já estiver aberto, fecha o acordeão
    } else {
      setExpandedIndex(index); // Caso contrário, abre o acordeão
    }
  };

  return (
    <div className="relative">
      {/* Linha Vertical */}
      <div className="absolute left-0 top-0 h-full border-l-2 border-gray-300"></div>
      
      <div className="flex flex-col gap-6">
        {experiences.map((experience, index) => (
          <div
            key={index}
            className="flex flex-col pl-10 pr-6 pb-4"
          >
            {/* Acordeão Principal */}
            <div className="flex justify-between items-center">
              {/* Linha Vertical e Quadrado */}
              <div className="flex items-center">
                {/* Substituindo o círculo por um quadrado centralizado */}
                <div className="w-6 h-6 bg-gray-800 rounded-md relative left-1/2 transform -translate-x-1/2"></div>
              </div>

              {/* Informações de Período, Título e Empresa */}
              <div className="flex flex-col items-start">
                <span className="text-sm text-gray-500">{experience.period}</span>
                <Title tag="h4" className="font-bold">{experience.title}</Title>
              </div>

              {/* Informações da Empresa na Horizontal */}
              <div className="flex items-center ml-4">
                <span className="text-sm text-gray-500">{experience.company}</span>
              </div>

              {/* Setinha para Expandir/Recolher */}
              <div
                className="cursor-pointer"
                onClick={() => toggleAccordion(index)}
              >
                {expandedIndex === index ? (
                  <IoIosArrowUp size={24} />
                ) : (
                  <IoIosArrowDown size={24} />
                )}
              </div>
            </div>

            {/* Acordeão Expandido */}
            {expandedIndex === index && (
              <div className="pl-8">
                <ul className="list-disc space-y-2">
                  {experience.experienceDetails.map((detail, i) => (
                    <li key={i} className="text-sm text-gray-700">
                      {detail}
                    </li>
                  ))}
                </ul>
                {/* Botão Ver Mais */}
                <button className="mt-4 text-blue-500">Ver mais</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
