import { Project } from "@/types/projectType";
import { javaTechnology, tailwindTechnology } from "@/utils/technologies";


import eletronicUrn from '@/assets/Projects/urna-eletronica/urna-eletronica.png'
import portfolio from '@/assets/Projects/portfolio.png'
import education from '@/assets/Projects/educacao.png'

export const projects:Project[] = [
  {
    name:'Portfólio 1',
    description:'Meu portfólio',
    mainImage:eletronicUrn,
    galleryImages:[eletronicUrn],
    repositoryUrl:'https://github.com/lucassdantas/portfolio',
    liveProjectUrl:'https://devdantas.com.br/',
    category:'Sites',
    technologies:[javaTechnology,]
  },
  {
    name:'Urna Eletrônica',
    description:'Urna Eletrônica feita com Javascript focado em orientar a modulos',
    mainImage:education,
    galleryImages:[portfolio,education],
    repositoryUrl:'aaaaaaaaaa',
    liveProjectUrl:'https://lucassdantas.github.io/softwares/Urna/index.html',
    category:'Sites',
    technologies:[tailwindTechnology,]
  },
  {
    name:'projeto 2',
    description:'projeto 2',
    mainImage:education,
    galleryImages:[portfolio,education],
    repositoryUrl:'aaaaaaaaaa',
    liveProjectUrl:'',
    category:'Sites',
    technologies:[tailwindTechnology, javaTechnology]
  },
]