import { Project } from "@/types/projectType";
import { githubTechnology, gitTechnology,  phpTechnology, wordpressTechnology } from "@/utils/technologies";

import mirante from  '@/projects/wp-plugins/mirante/eventos/plugin-eventos-mirante.jpg'
import mirante2 from '@/projects/wp-plugins/mirante/eventos/plugin-eventos-mirante-mais.jpg'
import mirante3 from '@/projects/wp-plugins/mirante/eventos/plugin-eventos-mirante-responsivo.jpg'

import precnetInvestimentSimulator from '@/projects/applications/precnet-investiment-simulator/simulador-precnet.jpg'
import precnetInvestimentSimulator2 from '@/projects/applications/precnet-investiment-simulator/simulador-precnet-02.jpg'
import precnetInvestimentSimulator3 from '@/projects/applications/precnet-investiment-simulator/simulador-precnet-responsivo.jpg'

import precnetSendLeadToApi from '@/projects/wp-plugins/precnet/investidor/send-lead-to-api/enviar-lead-a-api-precnet.jpg'
import precnetSendLeadToAp2 from '@/projects/wp-plugins/precnet/investidor/send-lead-to-api/enviar-lead-a-api-erro.jpg'
import precnetSendLeadToAp3 from '@/projects/wp-plugins/precnet/investidor/send-lead-to-api/enviar-lead-a-api-responsivo.jpg'

import precnetGetOportunitiesFromApi from '@/projects/wp-plugins/precnet/investidor/get-oportunities-from-api/oportunidades-precnet.jpg'
import precnetGetOportunitiesFromApi2 from '@/projects/wp-plugins/precnet/investidor/get-oportunities-from-api/oportunidades-esgotadas-precnet.jpg'
import precnetGetOportunitiesFromApi3 from '@/projects/wp-plugins/precnet/investidor/get-oportunities-from-api/oportunidades-precnet-responsivo.jpg'

import precnetCredentSendLeadToApi from '@/projects/wp-plugins/precnet/credor/credor-precnet-send-lead-to-api.jpg' 
import precnetCredentSendLeadToApi2 from '@/projects/wp-plugins/precnet/credor/credor-precnet-send-lead-to-api-02.jpg' 
import precnetCredentSendLeadToApi3 from '@/projects/wp-plugins/precnet/credor/credor-precnet-send-lead-to-api-responsivo.jpg' 

import helpBateriasPlugin from '@/projects/wp-plugins/help-baterias/help-baterias-plugin.jpg'
import helpBateriasPlugin2 from '@/projects/wp-plugins/help-baterias/help-baterias-plugin-02.jpg'
import helpBateriasPlugin3 from '@/projects/wp-plugins/help-baterias/help-baterias-plugin-03.jpg'
export const wpPlugins:Project[] = [
  {
    name:'Eventos no Mirante',
    description:'Plugin que gera CPT para adição de eventos e shortcode para exibi-los em cards de 4 colunas no desktop e uma no celular',
    mainImage:mirante,
    galleryImages:[mirante2, mirante3],
    repositoryUrl:'https://github.com/lucassdantas/wp_mirante-events-plugin',
    liveProjectUrl:'https://mirantedoarvrao.com.br/eventos/',
    category:'WpPlugins',
    technologies:[wordpressTechnology, phpTechnology, gitTechnology, githubTechnology]
  },
  {
    name:'Simulador de investimentos',
    description:'Plugin que insere o código (HTML, CSS e JS) do simulador desenvolvido anteriormente através de shortcode',
    mainImage:precnetInvestimentSimulator,
    galleryImages:[precnetInvestimentSimulator2, precnetInvestimentSimulator3],
    repositoryUrl:'',
    liveProjectUrl:'https://investidor.precnet.com.br/#simulador',
    category:'WpPlugins',
    technologies:[wordpressTechnology, phpTechnology, gitTechnology, githubTechnology]
  },
  {
    name:'Formulário integrado com API',
    description:'Formulário customizado integrado com API para envio do Lead. Em caso de envio com sucesso, redireciona o usuário para página de obrigado',
    mainImage:precnetSendLeadToApi,
    galleryImages:[precnetSendLeadToAp2, precnetSendLeadToAp3],
    repositoryUrl:'https://github.com/lucassdantas/wp_precnet-investidor-lead-sender/tree/main',
    liveProjectUrl:'https://investidor.precnet.com.br/#contato',
    category:'WpPlugins',
    technologies:[wordpressTechnology, phpTechnology, gitTechnology, githubTechnology]
  },
  {
    name:'Fetch de oportunidades da API',
    description:'Plugin que pega as oportunidades de uma API. Atualiza automaticamente a cada 30 minutos e também pode ser atualizado manualmente',
    mainImage:precnetGetOportunitiesFromApi,
    galleryImages:[precnetGetOportunitiesFromApi2, precnetGetOportunitiesFromApi3],
    repositoryUrl:'',
    liveProjectUrl:'https://investidor.precnet.com.br/#oportunidades',
    category:'WpPlugins',
    technologies:[wordpressTechnology, phpTechnology, gitTechnology, githubTechnology]
  },
  {
    name:'Diversos Formulários integrados com API',
    description:'Plugin que integra diversos formulários do site com API, enviando payloads diferentes a depender do formulário.',
    mainImage:precnetCredentSendLeadToApi,
    galleryImages:[precnetCredentSendLeadToApi2, precnetCredentSendLeadToApi3],
    repositoryUrl:'',
    liveProjectUrl:'https://credor.precnet.com.br/consulta/?no_proc_pagamento=exemplo&tel_sms=5511999999999&primeiro_nome=Teste&requerido=INSS&tribunal=TRF%206&dt_autuacao=20/10/2024',
    category:'WpPlugins',
    technologies:[wordpressTechnology, phpTechnology, gitTechnology, githubTechnology]
  },
  {
    name:'Opções de entrega customizadas',
    description:'Plugin adiciona opções de entrega customizadas e agendamento de entrega para o woocommerce.',
    mainImage:helpBateriasPlugin,
    galleryImages:[helpBateriasPlugin2, helpBateriasPlugin3],
    repositoryUrl:'',
    liveProjectUrl:'loja.helpbaterias.com.br',
    category:'WpPlugins',
    technologies:[wordpressTechnology, phpTechnology, gitTechnology, githubTechnology]
  },
 
]