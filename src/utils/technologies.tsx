import java from '@/assets/technologyImages/back-end/java.png'
import nodeJS from '@/assets/technologyImages/back-end/nodejs.png'
import grayNodeJS from '@/assets/technologyImages/back-end/grayImage/nodeJS-gray.png'
import php from '@/assets/technologyImages/back-end/php.png'

import nextJS from '@/assets/technologyImages/front-end/nextjs.png'
import reactJS from '@/assets/technologyImages/front-end/reactjs.png'
import tailwindcss from '@/assets/technologyImages/front-end/tailwindcss.png'
import typescript from '@/assets/technologyImages/front-end/typescript.png'
import typescriptGray from '@/assets/technologyImages/front-end/grayImages/typescript-gray.png'

import mysql from '@/assets/technologyImages/database/mysql.png'
import supabase from '@/assets/technologyImages/database/supabase.png'

import git from '@/assets/technologyImages/versioning/git.png'
import github from '@/assets/technologyImages/versioning/github.png'
import wordpress from '@/assets/technologyImages/crm/wordpress.png'
import { TechnologyGroup } from '@/types/technologies'

export const technologiesGroups: TechnologyGroup[] = [
  {
    label: "Back-end",
    technologies: [
      { name: "Java", grayImage: java, coloredImage: java },
      { name: "Node.js", grayImage: grayNodeJS, coloredImage: nodeJS },
      { name: "PHP", grayImage: php, coloredImage: php }
    ]
  },
  {
    label: "Front-end",
    technologies: [
      { name: "Next.js", grayImage: nextJS, coloredImage: nextJS },
      { name: "React.js", grayImage: reactJS, coloredImage: reactJS },
      { name: "Tailwind CSS", grayImage: tailwindcss, coloredImage: tailwindcss },
      { name: "TypeScript", grayImage: typescriptGray, coloredImage: typescript }
    ]
  },
  {
    label: "Banco de dados",
    technologies: [
      { name: "MySQL", grayImage: mysql, coloredImage: mysql },
      { name: "Supabase", grayImage: supabase, coloredImage: supabase }
    ]
  },
  {
    label: "Ferramentas",
    technologies: [
      { name: "Git", grayImage: git, coloredImage: git },
      { name: "GitHub", grayImage: github, coloredImage: github },
      { name: "WordPress", grayImage: wordpress, coloredImage: wordpress }
    ]
  }
];
