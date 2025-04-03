import { Project } from "@/types/projectType";

import { applications } from "@/utils/projects/applications";
import { apps } from "@/utils/projects/apps";
import { sites } from "@/utils/projects/sites";
import { systems } from "@/utils/projects/systems";
import { wordpress } from "@/utils/projects/wordpress";

export const projects:Project[] = [

  ...apps,
  ...systems,
  ...applications,
  ...sites,
  ...wordpress,
 
]