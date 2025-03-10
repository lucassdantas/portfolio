import { Project } from "@/types/projectType";
import { javaTechnology, tailwindTechnology } from "@/utils/technologies";


import eletronicUrn from '@/assets/Projects/urna-eletronica/urna-eletronica.png'

export const projects:Project[] = [

  {
    name:'Urna Eletrônica',
    description:'Urna Eletrônica feita com Javascript focado em orientar a modulos',
    mainImage:eletronicUrn,
    galleryImages:[eletronicUrn,],
    repositoryUrl:'',
    liveProjectUrl:'https://lucassdantas.github.io/softwares/Urna/index.html',
    category:'Sites',
    technologies:[tailwindTechnology,]
  },
 
]