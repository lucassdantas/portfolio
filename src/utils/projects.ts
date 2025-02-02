import { Category } from "@/types/categoryType";
import { Project } from "@/types/projectType";
import { Technology } from "@/types/technologies";

export const projects:Project[] = [
  {
    name:'projeto 1',
    description:'projeto',
    image:'',
    repositoryUrl:'',
    liveProjectUrl:'',
    category: Category.Wordpress,
    technologies:[Technology.React,]
  }
]