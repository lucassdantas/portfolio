import { ExperiencesAccordion } from '@/app/experiencias/components/ExperiencesAccordion'
import { Section } from '@/components/Section'
import { Title } from '@/components/Title'
import React from 'react'

export default function Experiences () {
  return (
    <Section limiterClassname='relative h-full' className='text-base_1-a0'>
      <div className='mb-24'>
        <Title tag='h1' className='font-extrabold mb-4 '>Experiências</Title>
        <p className=''>Ao longo da minha carreira como desenvolvedor web, trabalhei em diversas empresas e projetos, desenvolvendo aplicações modernas e escaláveis. Atuei no front-end e back-end, contribuindo com novas funcionalidades, otimização de sistemas, refatoração de código e integrações com APIs, sempre seguindo boas práticas de desenvolvimento para garantir código limpo, eficiente e de fácil manutenção.</p>
      </div>
      <div>
        <ExperiencesAccordion/>
      </div>
    </Section>
  )
}
