import { Category } from "@/types/categoryType";

export interface Project {
  name:string;
  description:string;
  image:string;
  repositoryUrl:string;
  liveProjectUrl?:string;
  category:Category;
}