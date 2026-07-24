import { Project } from "@/types/projectType";
import { githubTechnology, gitTechnology, javaTechnology, reactJSTechnology, supabaseTechnology, tailwindTechnology, typescriptTechnology, wordpressTechnology } from "@/utils/technologies";

import linkUp from "@/projects/apps/link-up/linkup.jpg"
import linkUp2 from "@/projects/apps/link-up/prints-projeto.jpg"
import linkUp3 from "@/projects/apps/link-up/prints-login-e-cadastro.jpg"
import linkUp4 from "@/projects/apps/link-up/linkup-team.jpg"
export const apps:Project[] = [
  {
    name:'Link Up',
    description:'App de rede social feito para projeto integrador. Fiz em equipe, orientando no desenvolvimento backend. Design por Gabriel Modesto',
    mainImage:linkUp,
    galleryImages:[linkUp2,linkUp3, /*linkup4*/],
    repositoryUrl:'https://github.com/lucassdantas/LinkUP',
    liveProjectUrl:'',
    category:'Apps',
    technologies:[reactJSTechnology, typescriptTechnology, supabaseTechnology, gitTechnology, githubTechnology]
  },

]