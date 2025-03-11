import { Project } from "@/types/projectType";

import { applications } from "@/utils/projects/applications";
import { sites } from "@/utils/projects/sites";

export const projects:Project[] = [

  ...applications,
  ...sites,
  
 
]