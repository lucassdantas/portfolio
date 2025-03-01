import java from '@/assets/technologyImages/back-end/java.png'
import nodeJS from '@/assets/technologyImages/back-end/nodejs.png'
import php from '@/assets/technologyImages/back-end/php.png'

import grayJava from '@/assets/technologyImages/back-end/grayImages/java-gray.png'
import grayNodeJS from '@/assets/technologyImages/back-end/grayImages/nodeJS-gray.png'
import grayPhp from '@/assets/technologyImages/back-end/grayImages/php-gray.png'



import nextJS from '@/assets/technologyImages/front-end/nextjs.png'
import reactJS from '@/assets/technologyImages/front-end/reactjs.png'
import tailwindcss from '@/assets/technologyImages/front-end/tailwindcss.png'
import typescript from '@/assets/technologyImages/front-end/typescript.png'

import grayNextJS from '@/assets/technologyImages/front-end/grayImages/nextjs-gray.png'
import grayReactJS from '@/assets/technologyImages/front-end/grayImages/reactjs-gray.png'
import grayTailwindcss from '@/assets/technologyImages/front-end/grayImages/tailwindcss-gray.png'
import typescriptGray from '@/assets/technologyImages/front-end/grayImages/typescript-gray.png'

import mysql from '@/assets/technologyImages/database/mysql.png'
import supabase from '@/assets/technologyImages/database/supabase.png'

import grayMysql from '@/assets/technologyImages/database/grayImages/mysql-gray.png'
import graySupabase from '@/assets/technologyImages/database/grayImages/supabase-gray.png'

import git from '@/assets/technologyImages/versioning/git.png'
import github from '@/assets/technologyImages/versioning/github.png'
import wordpress from '@/assets/technologyImages/crm/wordpress.png'

import grayGit from '@/assets/technologyImages/versioning/grayImages/git-gray.png'
import grayGithub from '@/assets/technologyImages/versioning/grayImages/github-gray.png'
import grayWordpress from '@/assets/technologyImages/crm/grayImages/wordpress-gray.png'


import { TechnologyGroup } from '@/types/technologies'

export const technologiesGroups: TechnologyGroup[] = [
  {
    label: "Back-end",
    technologies: [
      { name: "Java", grayImage: grayJava, coloredImage: java },
      { name: "Node.js", grayImage: grayNodeJS, coloredImage: nodeJS },
      { name: "PHP", grayImage: grayPhp, coloredImage: php }
    ]
  },
  {
    label: "Front-end",
    technologies: [
      { name: "Next.js", grayImage: grayNextJS, coloredImage: nextJS },
      { name: "React.js", grayImage: grayReactJS, coloredImage: reactJS },
      { name: "Tailwind CSS", grayImage: grayTailwindcss, coloredImage: tailwindcss },
      { name: "TypeScript", grayImage: typescriptGray, coloredImage: typescript }
    ]
  },
  {
    label: "Banco de dados",
    technologies: [
      { name: "MySQL", grayImage: grayMysql, coloredImage: mysql },
      { name: "Supabase", grayImage: graySupabase, coloredImage: supabase }
    ]
  },
  {
    label: "Ferramentas",
    technologies: [
      { name: "Git", grayImage: grayGit, coloredImage: git },
      { name: "GitHub", grayImage: grayGithub, coloredImage: github },
      { name: "WordPress", grayImage: grayWordpress, coloredImage: wordpress }
    ]
  }
];
