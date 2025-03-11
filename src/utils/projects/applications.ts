import { Project } from "@/types/projectType";
import { githubTechnology, gitTechnology, javaTechnology, reactJSTechnology, tailwindTechnology, typescriptTechnology, wordpressTechnology } from "@/utils/technologies";


import eletronicUrn from '@/assets/Projects/applications/urna-eletronica/urna-eletronica-main.jpg'
import eletronicUrn2 from '@/assets/Projects/applications/urna-eletronica/candidatos-urna.jpg'
import eletronicUrn3 from '@/assets/Projects/applications/urna-eletronica/resultado-urna.jpg'

import devFinance from '@/assets/Projects/applications/dev-finance/dev-finance-main.jpg'
import devFinance2 from '@/assets/Projects/applications/dev-finance/dev-finance-popup.jpg'
import devFinance3 from '@/assets/Projects/applications/dev-finance/dev-finance-transacao.jpg'

import breathingApp from '@/assets/Projects/applications/breathing-app/breathing-app-main.jpg'
import breathingApp2 from '@/assets/Projects/applications/breathing-app/breathing-app-running.jpg'
import breathingApp3 from '@/assets/Projects/applications/breathing-app/breathing-app-select-opened.jpg'

import instaPostReminder from '@/assets/Projects/applications/insta-post-reminder/insta-post-reminder-main.jpg' 
import instaPostReminder2 from '@/assets/Projects/applications/insta-post-reminder/insta-post-reminder-notificacoes.jpg' 
import instaPostReminder3 from '@/assets/Projects/applications/insta-post-reminder/insta-post-reminder.jpg' 

export const applications:Project[] = [
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
    name:'Insta post reminder',
    description:'Notificações',
    mainImage:instaPostReminder,
    galleryImages:[instaPostReminder2, instaPostReminder3],
    repositoryUrl:'https://github.com/lucassdantas/lucassdantas.github.io/tree/main/softwares/PostReminder',
    liveProjectUrl:'https://lucassdantas.github.io/softwares/PostReminder/',
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