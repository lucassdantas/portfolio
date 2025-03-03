'use client'
import { Section } from '@/components/Section';
import { Title } from '@/components/Title';
import { useState } from 'react';
import { projects } from '@/utils/projects';
import { Button } from '@/components/Button';
import {ProjectCard} from '@/app/projetos/components/ProjectCard';

const categories = [
  { label: 'Todos', value: 'all' },
  { label: 'Sites', value: 'Sites' },
  { label: 'Sistemas', value: 'Sistemas' },
  { label: 'Deploy', value: 'Deploy' },
  { label: 'Wordpress', value: 'Wordpress' },
];

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(project => project.category === selectedCategory);

  return (
    <Section limiterClassname='relative h-full' className='text-base_1-a0'>
      <div className='mb-24'>
        <Title tag='h1' className='font-extrabold'>Projetos</Title>
        <p className=''>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at convallis turpis. Proin sit amet eros a justo malesuada facilisis. Integer auctor, ex a vestibulum hendrerit, felis purus facilisis velit, eu luctus.</p>
      </div>

      {/* Abas de filtro */}
      <div className='flex gap-4 mb-8'>
        {categories.map(category => (
          <Button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Exibição dos cards filtrados */}
      <div className='flex flex-wrap gap-8 justify-center'>
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => <ProjectCard key={index} project={project} />)
        ) : (
          <p className='text-center text-gray-500'>Nenhum projeto encontrado.</p>
        )}
      </div>
    </Section>
  );
}
