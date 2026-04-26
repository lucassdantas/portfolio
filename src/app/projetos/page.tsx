'use client'
import { Section } from '@/components/Section';
import { Title } from '@/components/Title';
import { useState } from 'react';
import { projects } from '@/utils/projects';
import { ProjectCard } from '@/app/projetos/components/ProjectCard';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Projects() {
  const { t } = useLanguage();
  const categories = [
    { label: t('projects.all') || 'Todos', value: 'all' },
    { label: t('projects.apps') || 'Apps', value: 'Apps' },
    { label: t('projects.applications') || 'Aplicações', value: 'Aplicações' },
    { label: t('projects.sites') || 'Sites', value: 'Sites' },
    { label: t('projects.systems') || 'Sistemas', value: 'Sistemas' },
    { label: t('projects.wpPlugins') || 'Plugins Wordpress', value: 'WpPlugins' },
    { label: t('projects.deploy') || 'Deploy', value: 'Deploy' },
    { label: t('projects.wordpress') || 'Wordpress', value: 'Wordpress' },
  ];
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number>(0); // Começa no index 0

  // Filtra os projetos com base na categoria selecionada
  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(project => project.category === selectedCategory);

  return (
    <Section limiterClassname='relative h-full' className='text-base_1-a0'>
      <div className='mb-24'>
        <Title tag='h1' className='font-extrabold mb-4'>{t('projects.title')}</Title>
        <p>{t('projects.description')}</p>
      </div>

      {/* Abas de filtro */}
      <div className='flex gap-4 mb-12 overflow-x-scroll lg:overflow-x-hidden w-full scrollbar-hidden py-4'>
        {categories.map(category => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`text-xl min-w-max ${selectedCategory === category.value ? 'text-base_1-a1 border-b border-primary-blue ' : ' text-base_2-c0 hover:border-b hover:border-primary-blue hover:text-base_1-a1'}`} 
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
        ) : (<p className='text-center text-gray-500'>{t('projects.noProjects')}</p>)
        }
      </div>
    </Section>
  );
}
