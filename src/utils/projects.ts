import { Project } from "@/types/projectType";
import { githubTechnology, gitTechnology, javaTechnology, reactJSTechnology, tailwindTechnology, typescriptTechnology } from "@/utils/technologies";


import eletronicUrn from '@/assets/Projects/urna-eletronica/urna-eletronica-main.jpg'
import eletronicUrn2 from '@/assets/Projects/urna-eletronica/candidatos-urna.jpg'
import eletronicUrn3 from '@/assets/Projects/urna-eletronica/resultado-urna.jpg'

import devFinance from '@/assets/Projects/dev-finance/dev-finance-main.jpg'
import devFinance2 from '@/assets/Projects/dev-finance/dev-finance-popup.jpg'
import devFinance3 from '@/assets/Projects/dev-finance/dev-finance-transacao.jpg'

import breathingApp from '@/assets/Projects/breathing-app/breathing-app-main.jpg'
import breathingApp2 from '@/assets/Projects/breathing-app/breathing-app-running.jpg'
import breathingApp3 from '@/assets/Projects/breathing-app/breathing-app-select-opened.jpg'

export const projects:Project[] = [

  {
    name:'Urna Eletrônica',
    description:'Urna Eletrônica feita com Javascript focado orientação a modulos',
    mainImage:eletronicUrn,
    galleryImages:[eletronicUrn2,eletronicUrn3],
    repositoryUrl:'https://github.com/lucassdantas/lucassdantas.github.io/tree/main/softwares/Urna',
    liveProjectUrl:'https://lucassdantas.github.io/softwares/Urna/index.html',
    category:'Aplicações',
    technologies:[typescriptTechnology, gitTechnology, githubTechnology]
  },
  {
    name:'Breathing App',
    description:'Cronômetro para exercício respiratório',
    mainImage:breathingApp,
    galleryImages:[breathingApp2, breathingApp3],
    repositoryUrl:'https://github.com/lucassdantas/lucassdantas.github.io/tree/main/softwares/2024/breathing-app',
    liveProjectUrl:'https://lucassdantas.github.io/softwares/2024/breathing-app/',
    category:'Aplicações',
    technologies:[reactJSTechnology, typescriptTechnology, gitTechnology, githubTechnology]
  },
 
  {
    name:'Dev Finance',
    description:'Simulador transações bancárias salvando as informaçõs no localstorage',
    mainImage:devFinance,
    galleryImages:[devFinance2, devFinance3],
    repositoryUrl:'https://github.com/lucassdantas/lucassdantas.github.io/tree/main/softwares/Sistemabancario',
    liveProjectUrl:'https://lucassdantas.github.io/softwares/Sistemabancario/index.html',
    category:'Aplicações',
    technologies:[typescriptTechnology, gitTechnology, githubTechnology]
  },
 
]