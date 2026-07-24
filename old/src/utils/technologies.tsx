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

import { Technology, TechnologyGroup } from '@/types/technologies'

export const javaTechnology:Technology       = { name: 'Java',         coloredImage: java };
export const nodeJSTechnology:Technology     = { name: 'Node.js',      coloredImage: nodeJS };
export const phpTechnology:Technology        = { name: 'PHP',          coloredImage: php };
export const nextJSTechnology:Technology     = { name: 'Next.js',      coloredImage: nextJS };
export const reactJSTechnology:Technology    = { name: 'React.js',     coloredImage: reactJS };
export const tailwindTechnology:Technology   = { name: 'Tailwind CSS', coloredImage: tailwindcss };
export const typescriptTechnology:Technology = { name: 'TypeScript',   coloredImage: typescript };
export const mysqlTechnology:Technology      = { name: 'MySQL',        coloredImage: mysql };
export const supabaseTechnology:Technology   = { name: 'Supabase',     coloredImage: supabase };
export const gitTechnology:Technology        = { name: 'Git',          coloredImage: git };
export const githubTechnology:Technology     = { name: 'GitHub',       coloredImage: github };
export const wordpressTechnology:Technology  = { name: 'WordPress',    coloredImage: wordpress };

export const technologiesGroups: TechnologyGroup[] = [
  {
    label: "Back-end",
    technologies: [
      { name: javaTechnology.name, grayImage: grayJava, coloredImage: javaTechnology.coloredImage },
      { name: nodeJSTechnology.name, grayImage: grayNodeJS, coloredImage: nodeJSTechnology.coloredImage },
      { name: phpTechnology.name, grayImage: grayPhp, coloredImage: phpTechnology.coloredImage }
    ]
  },
  {
    label: "Front-end",
    technologies: [
      { name: nextJSTechnology.name, grayImage: grayNextJS, coloredImage: nextJSTechnology.coloredImage },
      { name: reactJSTechnology.name, grayImage: grayReactJS, coloredImage: reactJSTechnology.coloredImage },
      { name: tailwindTechnology.name, grayImage: grayTailwindcss, coloredImage: tailwindTechnology.coloredImage },
      { name: typescriptTechnology.name, grayImage: typescriptGray, coloredImage: typescriptTechnology.coloredImage }
    ]
  },
  {
    label: "Banco de dados",
    technologies: [
      { name: mysqlTechnology.name, grayImage: grayMysql, coloredImage: mysqlTechnology.coloredImage },
      { name: supabaseTechnology.name, grayImage: graySupabase, coloredImage: supabaseTechnology.coloredImage }
    ]
  },
  {
    label: "Ferramentas",
    technologies: [
      { name: gitTechnology.name, grayImage: grayGit, coloredImage: gitTechnology.coloredImage },
      { name: githubTechnology.name, grayImage: grayGithub, coloredImage: githubTechnology.coloredImage },
      { name: wordpressTechnology.name, grayImage: grayWordpress, coloredImage: wordpressTechnology.coloredImage }
    ]
  }
];
