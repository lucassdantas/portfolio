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

import blogBreno from '@/projects/systems/blog-breno/blog-breno-silva.jpg'
import blogBreno2 from '@/projects/systems/blog-breno/blog-breno-silva-2.jpg'
import blogBreno3 from '@/projects/systems/blog-breno/feed-breno-silva.jpg'

import stockChef from '@/projects/systems/stock-chef/stock-chef-java.jpg'
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
  {
    name:'Fórum Breno Silva',
    description:'Fórum para interação entre usuários. É possível fazer CRUD em amigos, editar os próprios dados e possui uma área ADM para gerenciar os demais usuários e posts. É possível realizar CRUD em postagens próprias, incluindo a adição/remoção de fotos',
    mainImage:blogBreno,
    galleryImages:[blogBreno2, blogBreno3],
    repositoryUrl:'',
    liveProjectUrl:'https://forum.seutreino.com/',
    category:'Sistemas',
    technologies:[reactJSTechnology, typescriptTechnology, phpTechnology, mysqlTechnology, gitTechnology, githubTechnology]
  },
  {
    name:'Sistema de estoque de produtos',
    description:'Como projeto integrador, liderei equipe para desenvolvermos o sistema utilizando Java Swing. Design foi feito por Gabriel Modesto',
    mainImage:stockChef,
    galleryImages:[],
    repositoryUrl:'',
    liveProjectUrl:'https://github.com/lucassdantas/ProjetoIntegrador',
    category:'Sistemas',
    technologies:[javaTechnology, gitTechnology, githubTechnology]
  },
 
]