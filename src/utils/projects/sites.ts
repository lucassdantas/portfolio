import { Project } from "@/types/projectType";
import { githubTechnology, gitTechnology, javaTechnology, nextJSTechnology, nodeJSTechnology, phpTechnology, reactJSTechnology, tailwindTechnology, typescriptTechnology, wordpressTechnology } from "@/utils/technologies";

import seutreino28dias from '@/assets/Projects/sites/seu-treino-28-dias/seu-treino-28-dias-main.jpg'
import seutreino28dias2 from '@/assets/Projects/sites/seu-treino-28-dias/seu-treino-28-dias-sessao.jpg'
import seutreino28dias3 from '@/assets/Projects/sites/seu-treino-28-dias/seu-treino-28-dias-sobre.jpg'
export const sites:Project[] = [
  
  {
    name:'Postfast',
    description:'Landing page feita com Next e Tailwind. Configurei hospedagem em VPS',
    mainImage:seutreino28dias,
    galleryImages:[seutreino28dias2, seutreino28dias3],
    repositoryUrl:'',
    liveProjectUrl:'https://www.postfast.com.br/',
    category:'Site',
    technologies:[nextJSTechnology, tailwindTechnology, nodeJSTechnology, gitTechnology, githubTechnology]
  },
  {
    name:'Seu Treino - 28 dias para mudar',
    description:'Landing page feita com React e Tailwind',
    mainImage:seutreino28dias,
    galleryImages:[seutreino28dias2, seutreino28dias3],
    repositoryUrl:'https://github.com/lucassdantas/seu-treino-28-dias-lp',
    liveProjectUrl:'https://seutreino.com/28-dias-para-mudar/',
    category:'Site',
    technologies:[reactJSTechnology, tailwindTechnology]
  },
  {
    name:'Thialita',
    description:'Landing page feita com Next e Tailwind, formulários com formJS',
    mainImage:seutreino28dias,
    galleryImages:[seutreino28dias2, seutreino28dias3],
    repositoryUrl:'',
    liveProjectUrl:'https://www.thialitasilva.com.br/',
    category:'Site',
    technologies:[nextJSTechnology, tailwindTechnology]
  },
  {
    name:'Diagonal Ag',
    description:'Site onepage para agência Diagonal',
    mainImage:seutreino28dias,
    galleryImages:[seutreino28dias2, seutreino28dias3],
    repositoryUrl:'https://github.com/lucassdantas/diagonal-ag',
    liveProjectUrl:'https://diagonal.ag/',
    category:'Site',
    technologies:[reactJSTechnology, tailwindTechnology, phpTechnology, gitTechnology, githubTechnology]
  },
  {
    name:'Revista Ibremp',
    description:'Site institucional para apresentação das revistas Ibremp',
    mainImage:seutreino28dias,
    galleryImages:[seutreino28dias2, seutreino28dias3],
    repositoryUrl:'https://github.com/lucassdantas/rbdsre-revista-ibremp',
    liveProjectUrl:'https://rbdsre.ibremp.org.br/',
    category:'Site',
    technologies:[nextJSTechnology, tailwindTechnology, gitTechnology, githubTechnology]
  },
  {
    name:'Corpore',
    description:'Site onepage para a clínica de fisioterapia Corpore',
    mainImage:seutreino28dias,
    galleryImages:[seutreino28dias2, seutreino28dias3],
    repositoryUrl:'https://github.com/lucassdantas/corporetorre',
    liveProjectUrl:'https://www.corporetorre.com.br/',
    category:'Site',
    technologies:[reactJSTechnology, tailwindTechnology, phpTechnology, gitTechnology, githubTechnology]
  },
  {
    name:'Carneiro e Carballido',
    description:'Site instutucional para empresa de contabilidade',
    mainImage:seutreino28dias,
    galleryImages:[seutreino28dias2, seutreino28dias3],
    repositoryUrl:'https://github.com/lucassdantas/Carneiro-e-Carballido',
    liveProjectUrl:'https://cecconsultores.com.br/',
    category:'Site',
    technologies:[reactJSTechnology, tailwindTechnology, phpTechnology, gitTechnology, githubTechnology]
  },
  {
    name:'Carlos Psicanalista',
    description:'LP para psicanalista',
    mainImage:seutreino28dias,
    galleryImages:[seutreino28dias2, seutreino28dias3],
    repositoryUrl:'https://github.com/lucassdantas/carlos-psicanalista-nextjs',
    liveProjectUrl:'https://www.carlosalbertopsicanalista.com.br/',
    category:'Site',
    technologies:[nextJSTechnology, tailwindTechnology, gitTechnology, githubTechnology]
  },
  {
    name:'Cópia de Minha Biblioteca Católica',
    description:'Cópia do site minha biblioteca católica',
    mainImage:seutreino28dias,
    galleryImages:[seutreino28dias2, seutreino28dias3],
    repositoryUrl:'https://github.com/lucassdantas/lucassdantas.github.io/tree/main/sites/catolica',
    liveProjectUrl:'https://lucassdantas.github.io/sites/catolica/',
    category:'Site',
    technologies:[reactJSTechnology, tailwindTechnology]
  },
 
]