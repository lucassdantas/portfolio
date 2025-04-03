import { Project } from "@/types/projectType";
import { githubTechnology, gitTechnology, javaTechnology, mysqlTechnology, nextJSTechnology, nodeJSTechnology, phpTechnology, reactJSTechnology, tailwindTechnology, typescriptTechnology, wordpressTechnology } from "@/utils/technologies";

import rubrazPartners from '@/projects/systems/rubraz-parceiros/rubraz-parceiros.jpg'
import rubrazPartners2 from '@/projects/systems/rubraz-parceiros/rubraz-parceiros-calc-result.jpg'
import rubrazPartners3 from '@/projects/systems/rubraz-parceiros/rubraz-parceiros-responsividade.jpg'

import finalRubrazPartners from '@/projects/systems/rubraz-parceiros/versao-final/rubraz-parceiros-versao-final-tela.jpg'
import finalRubrazPartners2 from '@/projects/systems/rubraz-parceiros/versao-final/rubraz-parceiros-versao-final-cadastro.jpg'
import finalRubrazPartners3 from '@/projects/systems/rubraz-parceiros/versao-final/rubraz-parceiros-versao-final-tela.jpg'
import finalRubrazPartners4 from '@/projects/systems/rubraz-parceiros/versao-final/rubraz-parceiros-versao-final-segundo-calculo.jpg'

import trancarteSystem from '@/projects/systems/trancarte-system/area-do-arquiteto-inicio.jpg'
import trancarteSystem2 from '@/projects/systems/trancarte-system/area-do-arquiteto-trancarte.jpg'
export const systems:Project[] = [
  
  {
    name:'Parceiros rubraz',
    description:'Sistema que usa a API do google maps para verificar a distância entre dois pontos. Utilizei hooks como useContext',
    mainImage:rubrazPartners,
    galleryImages:[rubrazPartners2, rubrazPartners3],
    repositoryUrl:'https://github.com/lucassdantas/calculo_de_frete_rubraz/tree/main',
    liveProjectUrl:'https://rubrazlajes.com/parceiros',
    category:'Sistemas',
    technologies:[reactJSTechnology, typescriptTechnology, tailwindTechnology]
  },
  {
    name:'Parceiros rubraz - fase 2',
    description:'Sistema que realiza o cálculo de frete com base nas dimensões de produtos ou quantidade e tamanho de vigotas, somando este valor com o frete calculado pela distância até o endereço do cliente',
    mainImage:finalRubrazPartners,
    galleryImages:[finalRubrazPartners2, finalRubrazPartners3, /*finalRubrazPartners4*/],
    repositoryUrl:'https://github.com/lucassdantas/calculo_de_frete_rubraz/tree/main',
    liveProjectUrl:'https://rubrazlajes.com/parceiros/teste',
    category:'Sistemas',
    technologies:[reactJSTechnology, phpTechnology, mysqlTechnology, typescriptTechnology, tailwindTechnology]
  },
  {
    name:'Área do arquiteto',
    description:'Sistema feito para somar e rankear pontuações de arquitetos com base em pedidos adicionados, estes que são associados a vendedores. Também possui upload e download de arquivos',
    mainImage:trancarteSystem,
    galleryImages:[trancarteSystem2],
    repositoryUrl:'',
    liveProjectUrl:'https://trancarte.com.br/novosistemaarquitetos/index.php',
    category:'Sistemas',
    technologies:[phpTechnology, mysqlTechnology, gitTechnology, githubTechnology]
  },
 
]