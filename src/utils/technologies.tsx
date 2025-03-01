import java from '@/assets/technologyImages/back-end/java.png'
import nodeJS from '@/assets/technologyImages/back-end/nodejs.png'
import php from '@/assets/technologyImages/back-end/php.png'
import nextJS from '@/assets/technologyImages/front-end/nextjs.png'
import reactJS from '@/assets/technologyImages/front-end/reactjs.png'
import tailwindcss from '@/assets/technologyImages/front-end/tailwindcss.png'
import typescript from '@/assets/technologyImages/front-end/typescript.png'
import mysql from '@/assets/technologyImages/database/mysql.png'
import supabase from '@/assets/technologyImages/database/supabase.png'
import git from '@/assets/technologyImages/versioning/git.png'
import github from '@/assets/technologyImages/versioning/github.png'
import wordpress from '@/assets/technologyImages/crm/wordpress.png'
import { TechnologyGroup } from '@/types/technologies'

export const technologies:TechnologyGroup[] = [
  {
    label:"Back-end",
    images:[
      java,
      nodeJS,
      php
    ]
  },
  {
    label:"Front-end",
    images:[
      nextJS,
      reactJS,
      tailwindcss,
      typescript
    ]
  },
  {
    label:'Banco de dados',
    images:[
      mysql,
      supabase
    ]
  },
  {
    label:"Ferramentas",
    images:[
      git,
      github,
      wordpress
    ]
  }
]