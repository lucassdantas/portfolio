import { Project } from "@/types/projectType";
import { githubTechnology, gitTechnology, javaTechnology, reactJSTechnology, tailwindTechnology, typescriptTechnology, wordpressTechnology } from "@/utils/technologies";

import autovistoria from '@/assets/Projects/sites/wordpress/autovistoria-predial-focon/autovistoria-predial-focon-main.jpg'
import autovistoria2 from '@/assets/Projects/sites/wordpress/autovistoria-predial-focon/autovistoria-predial-focon-form.jpg'
import autovistoria3 from '@/assets/Projects/sites/wordpress/autovistoria-predial-focon/autovistoria-predial-focon-itens.jpg'

export const sites:Project[] = [
  
  {
    name:'Autovistoria Predial',
    description:'Site de autovistoria feito com WP e Elementor',
    mainImage:autovistoria,
    galleryImages:[autovistoria2, autovistoria3],
    repositoryUrl:'',
    liveProjectUrl:'https://autovistoriapredial.eng.br/',
    category:'Wordpress',
    technologies:[wordpressTechnology]
  },
 
]