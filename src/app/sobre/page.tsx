import { Title } from '@/components/Title'
import React from 'react'

export default function About () {
  return (
    <>
      <section>
        <Title tag='h2'>Lucas Dantas</Title>
        <Title tag='h1' isBigText={true}>Desenvolvedor Web</Title>
        <p className='text-2xl'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at convallis turpis. Proin sit amet eros a justo malesuada facilisis. Integer auctor, ex a vestibulum hendrerit, felis purus facilisis velit, eu luctus.</p>
      </section>
      <section>
        <Title tag='h2'>Lucas Dantas</Title>
        <p>Lorem ipsum</p>
        
      </section>
    </>
  )
}
