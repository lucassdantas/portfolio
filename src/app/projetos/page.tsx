'use client'
import { Section } from '@/components/Section';
import { Title } from '@/components/Title';
import { useState } from 'react';
import { projects } from '@/utils/projects';
import { Button } from '@/components/Button';
import { ProjectCard } from '@/app/projetos/components/ProjectCard';

const categories = [
  { label: 'Todos', value: 'all' },
  { label: 'Sites', value: 'Sites' },
  { label: 'Sistemas', value: 'Sistemas' },
  { label: 'Deploy', value: 'Deploy' },
  { label: 'Wordpress', value: 'Wordpress' },
];

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number>(0); // Começa no index 0

  // Filtra os projetos com base na categoria selecionada
  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(project => project.category === selectedCategory);

  return (
    <Section limiterClassname='relative h-full' className='text-base_1-a0'>
      <div className='mb-24'>
        <Title tag='h1' className='font-extrabold'>Projetos</Title>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
      </div>

      {/* Abas de filtro */}
      <div className='flex gap-4 mb-12'>
        {categories.map(category => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={selectedCategory === category.value ? 'text-base_1-a1 border-b border-primary-blue ' : ' text-base_2-c0 hover:border-b hover:border-primary-blue hover:text-base_1-a1'} 
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Exibição dos cards filtrados */}
      <div className='flex flex-wrap gap-8 justify-start gap-y-16'>
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <ProjectCard 
              key={index} 
              project={project} 
              cardIndex={index} 
              isHovered={hoveredCardIndex === index} 
              setHoveredCardIndex={setHoveredCardIndex}
            />
          ))
        ) : (<p className='text-center text-gray-500'>Nenhum projeto encontrado.</p>)
        }
      </div>
    </Section>
  );
}
