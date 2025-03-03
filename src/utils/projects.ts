import { Project } from "@/types/projectType";
import { javaTechnology, tailwindTechnology } from "@/utils/technologies";

import portfolio from '@/assets/Projects/portfolio.png'
export const projects:Project[] = [
  {
    name:'projeto 1',
    description:'projeto',
    mainImage:portfolio,
    galleryImages:[portfolio,portfolio],
    repositoryUrl:'',
    liveProjectUrl:'aaaaaaaaaaaaaaaaaaaaaa',
    category:'Wordpress',
    technologies:[javaTechnology,]
  },
  {
    name:'projeto 2',
    description:'projeto 2',
    mainImage:portfolio,
    galleryImages:[portfolio,portfolio],
    repositoryUrl:'aaaaaaaaaa',
    liveProjectUrl:'',
    category:'Wordpress',
    technologies:[tailwindTechnology,]
  },
]