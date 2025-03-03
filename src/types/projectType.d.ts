import { Category } from "@/types/categoryType";
import { Technology } from "@/types/technologies";
import { StaticImageData } from "next/image";

export interface Project {
  name:string;
  description:string;
  mainImage:StaticImageData;
  galleryImages:StaticImageData[];
  repositoryUrl:string;
  liveProjectUrl?:string;
  category:string;
  technologies:Technology[];
}