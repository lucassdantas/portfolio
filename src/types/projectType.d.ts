import { Category } from "@/types/categoryType";
import { Technology } from "@/types/technologies";

export interface Project {
  name:string;
  description:string;
  image:string;
  repositoryUrl:string;
  liveProjectUrl?:string;
  category:Category;
  technologies:Technology[];
}