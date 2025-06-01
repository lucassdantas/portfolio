import { Project } from "@/types/projectType";
import { githubTechnology, gitTechnology, javaTechnology, nextJSTechnology, phpTechnology, reactJSTechnology, tailwindTechnology, typescriptTechnology, wordpressTechnology } from "@/utils/technologies";


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

import precnetInvestimentSimulator from '@/projects/applications/precnet-investiment-simulator/simulador-precnet.jpg'
import precnetInvestimentSimulator2 from '@/projects/applications/precnet-investiment-simulator/simulador-precnet-02.jpg'
import precnetInvestimentSimulator3 from '@/projects/applications/precnet-investiment-simulator/simulador-precnet-responsivo.jpg'

import acadCalculator from '@/projects/applications/calculadora-acad/calculadora-acad (1).jpg'
import acadCalculator2 from '@/projects/applications/calculadora-acad/calculadora-acad (2).jpg'
import acadCalculator3 from '@/projects/applications/calculadora-acad/calculadora-acad (3).jpg'
import acadCalculator4 from '@/projects/applications/calculadora-acad/calculadora-acad (4).jpg'
export const applications:Project[] = [
  {
    name:'Simulador de investimento (Precatório, CDB, LCI/LCA)',
    description:'Simulador de investimento que compara a rentabilidade do precatório da precnet com outros tipos de investimentos',
    mainImage:precnetInvestimentSimulator,
    galleryImages:[precnetInvestimentSimulator2,precnetInvestimentSimulator3],
    repositoryUrl:'https://github.com/lucassdantas/precatory_rentability_simulator',
    liveProjectUrl:'https://investidor.precnet.com.br/#simulatorSectionPrecnet',
    category:'Aplicações',
    technologies:[gitTechnology, githubTechnology]
  },
  {
    name:'Calculadora de economia',
    description:'Formulário em etapas com design personalizado e calculo de economia. Possui envio de e-mail. Será utilizada em evento e feito em torno de 4 dias',
    mainImage:acadCalculator2,
    galleryImages:[acadCalculator3,acadCalculator4],
    repositoryUrl:'https://github.com/lucassdantas/acad-economy-calculator',
    liveProjectUrl:'https://acad.diagonal.ag/',
    category:'Aplicações',
    technologies:[nextJSTechnology,typescriptTechnology, phpTechnology, gitTechnology, githubTechnology]
  },
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