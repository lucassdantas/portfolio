import { StaticImageData } from "next/image";

export enum Technology{
  React,
  NextJS,
  TailwindCSS,
  Wordpress,
  Typescript,
  Javascript,
  HTML,
  CSS,
  PHP,
  NodeJS,
  MySQL,
  Supabase,
  Java,
}

export interface TechnologyGroup{
  label:string;
  technologies:{
    name:string;
    grayImage:StaticImageData;
    coloredImage:StaticImageData;
  }[]
}