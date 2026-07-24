import { Project } from "@/types/projectType";
import { githubTechnology, gitTechnology, javaTechnology, nextJSTechnology, nodeJSTechnology, phpTechnology, reactJSTechnology, tailwindTechnology, typescriptTechnology, wordpressTechnology } from "@/utils/technologies";

import seutreino28dias from '@/assets/Projects/sites/seu-treino-28-dias/seu-treino-28-dias-main.jpg'
import seutreino28dias2 from '@/assets/Projects/sites/seu-treino-28-dias/seu-treino-28-dias-sessao.jpg'
import seutreino28dias3 from '@/assets/Projects/sites/seu-treino-28-dias/seu-treino-28-dias-sobre.jpg'

import postfast from '@/assets/Projects/sites/postfast/postfast-main.jpg'
import postfast2 from '@/assets/Projects/sites/postfast/postfast-conectando.jpg'
import postfast3 from '@/assets/Projects/sites/postfast/postfast-banner.jpg'

import carlosPsi from '@/assets/Projects/sites/carlos-psicanalista/carlos-psicanalista-main.jpg'
import carlosPsi2 from '@/assets/Projects/sites/carlos-psicanalista/carlos-psicanalista-cards.jpg'
import carlosPsi3 from '@/assets/Projects/sites/carlos-psicanalista/carlos-psicanalista-vantagens.jpg'

import carneiro from '@/assets/Projects/sites/carneiro-e-carbalito/carneiro-main.jpg'
import carneiro2 from '@/assets/Projects/sites/carneiro-e-carbalito/carneiro-form.jpg'
import carneiro3 from '@/assets/Projects/sites/carneiro-e-carbalito/carneiro-banner.jpg'

import corpore from '@/assets/Projects/sites/corpore/corpore-main.jpg'
import corpore2 from '@/assets/Projects/sites/corpore/corpore-banner.jpg'
import corpore3 from '@/assets/Projects/sites/corpore/corpore-cards.jpg'

import thialita from '@/assets/Projects/sites/thialita-power-boss/thialita.jpg'
import thialita2 from '@/assets/Projects/sites/thialita-power-boss/thialita-rodape.jpg'
import thialita3 from '@/assets/Projects/sites/thialita-power-boss/thialita-cronometro.jpg'

import diagonal from'@/assets/Projects/sites/diagonal/diagonal-main.jpg'
import diagonal2 from'@/assets/Projects/sites/diagonal/diagonal-form.jpg'
import diagonal3 from'@/assets/Projects/sites/diagonal/diagonal-partners.jpg'

import minhaBiblioteca from '@/assets/Projects/sites/minha-biblioteca/minha-biblioteca-main.jpg'
import minhaBiblioteca2 from '@/assets/Projects/sites/minha-biblioteca/minha-biblioteca-cards.jpg'
import minhaBiblioteca3 from '@/assets/Projects/sites/minha-biblioteca/minha-biblioteca-video.jpg'

import ibremp from '@/assets/Projects/sites/ibremp/ibremp-main.jpg'
import ibremp2 from '@/assets/Projects/sites/ibremp/ibremp-contato.jpg'
import ibremp3 from '@/assets/Projects/sites/ibremp/ibremp-regulamento.jpg'


export const sites:Project[] = [
  
  {
    name:'Postfast',
    description:'Landing page feita com Next e Tailwind. Configurei hospedagem em VPS',
    mainImage:postfast,
    galleryImages:[postfast2, postfast3],
    repositoryUrl:'',
    category:'Sites',
    technologies:[nextJSTechnology, tailwindTechnology, nodeJSTechnology, gitTechnology, githubTechnology]
  },
  {
    name:'Seu Treino - 28 dias para mudar',
    description:'Landing page feita com React e Tailwind',
    mainImage:seutreino28dias,
    galleryImages:[seutreino28dias2, seutreino28dias3],
    repositoryUrl:'https://github.com/lucassdantas/seu-treino-28-dias-lp',
    category:'Sites',
    technologies:[reactJSTechnology, tailwindTechnology]
  },
  {
    name:'Thialita',
    description:'Landing page feita com Next e Tailwind, formulários com EmailJS',
    mainImage:thialita,
    galleryImages:[thialita2, thialita3],
    repositoryUrl:'',
    liveProjectUrl:'https://www.thialitasilva.com.br/power-boss',
    category:'Sites',
    technologies:[nextJSTechnology, tailwindTechnology]
  },
  {
    name:'Diagonal Ag',
    description:'Site onepage para agência Diagonal',
    mainImage:diagonal,
    galleryImages:[diagonal2, diagonal3],
    repositoryUrl:'https://github.com/lucassdantas/diagonal-ag',
    liveProjectUrl:'https://diagonal.ag/',
    category:'Sites',
    technologies:[reactJSTechnology, tailwindTechnology, phpTechnology, gitTechnology, githubTechnology]
  },
  {
    name:'Revista Ibremp',
    description:'Site institucional para apresentação das revistas Ibremp',
    mainImage:ibremp,
    galleryImages:[ibremp2, ibremp3],
    repositoryUrl:'https://github.com/lucassdantas/rbdsre-revista-ibremp',
    liveProjectUrl:'https://rbdsre.ibremp.org.br/',
    category:'Sites',
    technologies:[nextJSTechnology, tailwindTechnology, gitTechnology, githubTechnology]
  },
  {
    name:'Corpore',
    description:'Site onepage para a clínica de fisioterapia Corpore',
    mainImage:corpore,
    galleryImages:[corpore2, corpore3],
    repositoryUrl:'https://github.com/lucassdantas/corporetorre',
    liveProjectUrl:'https://www.corporetorre.com.br/',
    category:'Sites',
    technologies:[reactJSTechnology, tailwindTechnology, phpTechnology, gitTechnology, githubTechnology]
  },
  {
    name:'Carneiro e Carballido',
    description:'Site instutucional para empresa de contabilidade',
    mainImage:carneiro,
    galleryImages:[carneiro2, carneiro3],
    repositoryUrl:'https://github.com/lucassdantas/Carneiro-e-Carballido',
    liveProjectUrl:'https://cecconsultores.com.br/',
    category:'Sites',
    technologies:[reactJSTechnology, tailwindTechnology, phpTechnology, gitTechnology, githubTechnology]
  },
  {
    name:'Carlos Psicanalista',
    description:'LP para psicanalista',
    mainImage:carlosPsi,
    galleryImages:[carlosPsi2, carlosPsi3],
    repositoryUrl:'https://github.com/lucassdantas/carlos-psicanalista-nextjs',
    liveProjectUrl:'https://www.carlosalbertopsicanalista.com.br/',
    category:'Sites',
    technologies:[nextJSTechnology, tailwindTechnology, gitTechnology, githubTechnology]
  },
  {
    name:'Cópia de Minha Biblioteca Católica',
    description:'Cópia do site minha biblioteca católica',
    mainImage:minhaBiblioteca,
    galleryImages:[minhaBiblioteca2, minhaBiblioteca3],
    repositoryUrl:'https://github.com/lucassdantas/lucassdantas.github.io/tree/main/sites/catolica',
    liveProjectUrl:'https://lucassdantas.github.io/sites/catolica/',
    category:'Sites',
    technologies:[reactJSTechnology, tailwindTechnology]
  },
 
]