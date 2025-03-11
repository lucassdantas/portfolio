import { Project } from "@/types/projectType";
import { githubTechnology, gitTechnology, javaTechnology, reactJSTechnology, tailwindTechnology, typescriptTechnology, wordpressTechnology } from "@/utils/technologies";

import autovistoria from '@/assets/Projects/sites/wordpress/autovistoria-predial-focon/autovistoria-predial-focon-main.jpg'
import autovistoria2 from '@/assets/Projects/sites/wordpress/autovistoria-predial-focon/autovistoria-predial-focon-form.jpg'
import autovistoria3 from '@/assets/Projects/sites/wordpress/autovistoria-predial-focon/autovistoria-predial-focon-itens.jpg'

import seutreino from '@/assets/Projects/sites/wordpress/seu-treino/seu-treino-main.jpg'
import seutreino2 from '@/assets/Projects/sites/wordpress/seu-treino/seu-treino-sobre.jpg'
import seutreino3 from '@/assets/Projects/sites/wordpress/seu-treino/seu-treino-calculadora.jpg'
export const wordpress:Project[] = [
  
  {
    name:'Seu Treino',
    description:'Site de personal trainer feito com WP, Elementor, WooCommerce e Jet Engine',
    mainImage:seutreino,
    galleryImages:[seutreino2, seutreino3],
    repositoryUrl:'',
    liveProjectUrl:'https://seutreino.com/',
    category:'Wordpress',
    technologies:[wordpressTechnology]
  },
  {
    name:'Autovistoria Predial',
    description:'Site de autovistoria do qual participei do desenvolvimento - feito com WP e Elementor',
    mainImage:autovistoria,
    galleryImages:[autovistoria2, autovistoria3],
    repositoryUrl:'',
    liveProjectUrl:'https://autovistoriapredial.eng.br/',
    category:'Wordpress',
    technologies:[wordpressTechnology]
  },
 
]