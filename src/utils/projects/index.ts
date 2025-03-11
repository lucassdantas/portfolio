import { Project } from "@/types/projectType";

import { applications } from "@/utils/projects/applications";
import { sites } from "@/utils/projects/sites";
import { wordpress } from "@/utils/projects/wordpress";

export const projects:Project[] = [

  ...applications,
  ...sites,
  ...wordpress,
 
]