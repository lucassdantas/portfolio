import { Project } from "@/types/projectType";
import { javaTechnology, tailwindTechnology } from "@/utils/technologies";

import portfolio from '@/assets/Projects/portfolio.png'
import education from '@/assets/Projects/educacao.png'

export const projects:Project[] = [
  {
    name:'projeto 1',
    description:'projeto',
    mainImage:portfolio,
    galleryImages:[education,portfolio],
    repositoryUrl:'',
    liveProjectUrl:'aaaaaaaaaaaaaaaaaaaaaa',
    category:'Wordpress',
    technologies:[javaTechnology,]
  },
  {
    name:'projeto 2',
    description:'projeto 2',
    mainImage:education,
    galleryImages:[portfolio,education],
    repositoryUrl:'aaaaaaaaaa',
    liveProjectUrl:'',
    category:'Sites',
    technologies:[tailwindTechnology,]
  },
  {
    name:'projeto 2',
    description:'projeto 2',
    mainImage:education,
    galleryImages:[portfolio,education],
    repositoryUrl:'aaaaaaaaaa',
    liveProjectUrl:'',
    category:'Sites',
    technologies:[tailwindTechnology, javaTechnology]
  },
]