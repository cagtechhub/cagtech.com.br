import type { LandingContent } from '@cagtech/shared'
import { defineStore } from 'pinia'

import { LANDING_NAV_ITEMS, landingHref } from '~/constants/landingScreen'
import type {
  LandingDifferentiator,
  LandingFaqItem,
  LandingInitialProject,
  LandingNavItem,
  LandingPackage,
  LandingService,
  LandingSocialLink,
  LandingTestimonial,
} from '~/types/landing'

export const useLandingStore = defineStore('landing', () => {
  const config = useRuntimeConfig()

  const brandName = computed(() => {
    const rawName = String(config.public.siteName || 'CAG Tech').trim()
    return rawName.length > 0 ? rawName : 'CAG Tech'
  })

  const brandMonogram = computed(() =>
    brandName.value
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase()
      .padEnd(2, 'C')
      .slice(0, 2)
  )

  const navItems = computed<LandingNavItem[]>(() =>
    LANDING_NAV_ITEMS.map(({ id, label }) => ({ label, href: landingHref(id) }))
  )

  const audiences = ref(['Startups', 'Times de produto', 'Empresas que investem em software web'])

  const trustedBrands = ref(['Pieta Tech', 'Gm Bovinos', 'S.G Consultora', 'Nexiqo'])

  const heroCopy = ref({
    tagline: 'Software web, SEO e landing pages com gestão de projeto',
    titleMain: 'Desenvolvimento focado em software para sua presença digital',
    titleAccent: 'sites, SEO e páginas de conversão',
  })

  const servicesIntro = ref({
    title: 'Serviços em software para a web',
    body: 'Atuamos na construção e evolução de produtos digitais leves e performáticos: sites, otimização para buscadores e landing pages orientadas a resultado.',
  })

  const services = ref<LandingService[]>([
    {
      title: 'Criação de sites',
      description:
        'Sites institucionais e portais em stack moderna, com código limpo, acessibilidade, performance e base preparada para integrações e evolução contínua.',
      icon: 'M4 5a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5z M8 9h8M8 13h6M8 17h4',
    },
    {
      title: 'Otimização SEO',
      description:
        'SEO técnico e de conteúdo: arquitetura de informação, Core Web Vitals, dados estruturados e rituais de publicação para ganhar relevância orgânica.',
      icon: 'M4 18h16M6 14l3-3 3 2 6-6 M14 6l2 2',
    },
    {
      title: 'Landing page',
      description:
        'Páginas de captura e conversão com experimentação, formulários seguros e integrações (CRM, tagueamento, analytics) pensadas para campanhas e lançamentos.',
      icon: 'M4 4h16v10H4z M8 18h8M8 14h5',
    },
  ])

  const packagesIntro = ref({
    title: 'Pacotes e investimento',
    body: 'Escolha o ponto de partida; todos podem evoluir conforme sua operação cresce. Valores marcados como referência devem ser confirmados na proposta após briefing.',
  })

  const initialProject = ref<LandingInitialProject>({
    title: 'Projeto inicial em parceria',
    lead: 'Para o primeiro ciclo, trabalhamos como extensão do seu time: alinhamos escopo técnico, operamos a infraestrutura mínima e conduzimos a gestão do projeto até a entrega.',
    bullets: [
      'Suporte na definição e registro de domínio',
      'Hospedagem em VPS com mensalidade e monitoração básica',
      'Gestão de projeto: ritos, priorização e transparência de entregas',
      'Documentação e handoff para sua equipe evoluir o software depois do go-live',
    ],
  })

  /** Substitua `R$ X.XXX` pelos valores reais da tabela comercial quando fechados. */
  const projectPackages = ref<LandingPackage[]>([
    {
      name: 'Landing (inicial)',
      subtitle: 'Entrada rápida no ar com foco em conversão',
      priceDisplay: 'à partir de R$ 1.250,00',
      priceFootnote: 'Referência; inclui itens listados após validação de escopo.',
      includes: [
        'Landing page em stack web moderna',
        'Domínio orientado (registro e apontamentos)',
        'VPS gerenciado para publicação estável',
        'Gestor de projeto dedicado no ciclo inicial',
      ],
      featured: false,
    },
    {
      name: 'Institucional',
      subtitle: 'Site institucional com SEO em evolução',
      priceDisplay: 'à partir de R$ 2.500,00',
      priceFootnote: 'Referência; agrega o pacote Landing onde fizer sentido técnico.',
      includes: [
        'Tudo que compõe o pacote Landing (inicial), quando aplicável',
        'Site institucional ampliado (páginas, conteúdo e navegação)',
        'Acompanhamento de SEO técnico e de conteúdo em sprints',
        'Relatórios periódicos de indicadores e backlog priorizado',
      ],
      featured: true,
    },
    {
      name: 'Personalizado',
      subtitle: 'Produto web sob medida',
      priceDisplay: 'Sob proposta',
      priceFootnote: 'Escopo aberto: integrações, áreas logadas, APIs e squads conforme demanda.',
      includes: [
        'Tudo do pacote Institucional como base, quando couber no produto',
        'Funcionalidades e integrações específicas do seu negócio',
        'Arquitetura e governança alinhadas a crescimento e segurança',
        'Pode incluir squads dedicados, SLA e evolução contínua',
      ],
      featured: false,
    },
  ])

  const differentiators = ref<LandingDifferentiator[]>([
    {
      title: 'Foco em software web',
      description:
        'Priorizamos código sustentável, pipelines claros e produtos que podem evoluir: do site institucional à landing com integrações.',
      icon: 'M12 3l3 6 6 .9-4.5 4.4 1 6.2-5.5-2.9L6.5 20l1-6.2L3 9.9 9 9z',
    },
    {
      title: 'SEO e performance',
      description:
        'Métricas de busca e velocidade entram desde o desenho técnico, não como adendo — para seu site carregar rápido e ser encontrado.',
      icon: 'M4 18h16M6 14l3-3 3 2 6-6',
    },
    {
      title: 'Entrega com gestão de projeto',
      description:
        'Transparência de escopo, riscos e entregas; ritos leves que conectam negócio, conteúdo e engenharia de software.',
      icon: 'M5 5h14v14H5z M8 9h8 M8 12h8 M8 15h5',
    },
    {
      title: 'Parceria de longo prazo',
      description:
        'Do projeto inicial (domínio, VPS, acompanhamento) à evolução contínua, permanecemos disponíveis para sustentar seu produto digital.',
      icon: 'M12 3l2.2 4.5L19 8l-3.4 3.3.8 4.7L12 14l-4.4 2 .8-4.7L5 8l4.8-.5z',
    },
  ])

  const testimonials = ref<LandingTestimonial[]>([
    {
      title: 'Projeto fluido do início ao fim.',
      quote:
        'Entenderam nossa visão desde o início, com execução precisa e comunicação clara durante todo o projeto. O website superou nossas expectativas.',
      name: 'Ivo Junior',
      role: 'Co Fundador, GM Bovinos',
    },
    {
      title: 'Fluxo de reservas complexo virou algo simples.',
      quote:
        'O website ficou rápido, confiável e fácil de operar. Consigo atualizar o conteúdo sem dificuldades e sem precisar de ajuda de programadores.',
      name: 'Stefanny Gutierres',
      role: 'Fundadora, S.G Consultora',
    },
  ])

  const faqItems = ref<LandingFaqItem[]>([
    {
      question: `Quais serviços a ${brandName.value} oferece?`,
      answer:
        'Foco em software para web: criação de sites, otimização SEO, landing pages, além de pacotes que combinam domínio, VPS, gestão de projeto e evolução contínua conforme o escopo.',
    },
    {
      question: 'O que é o “projeto inicial” em parceria?',
      answer:
        'É o modelo onde cuidamos juntos da base do seu produto digital: orientação de domínio, hospedagem em VPS com mensalidade, gestão do projeto e entrega de software (site ou landing) com documentação para evolução.',
    },
    {
      question: 'Como vocês ajudam o meu negócio?',
      answer:
        'Colocamos no ar presença digital rápida e mensurável, com SEO e performance em mente, e escalamos para site institucional ou soluções personalizadas quando sua operação exige mais integrações ou times dedicados.',
    },
    {
      question: 'Em quais segmentos vocês atuam?',
      answer:
        'B2B, serviços, varejo, saúde, educação e tecnologia — sempre adaptando stack, conteúdo e SEO ao contexto de cada negócio.',
    },
    {
      question: 'Quanto tempo leva um projeto?',
      answer:
        'Projetos começam com um discovery curto e evoluem em ciclos incrementais. O prazo varia conforme escopo, complexidade e prioridade.',
    },
    {
      question: 'Vocês usam frameworks específicos?',
      answer:
        'Sim: preferimos stacks modernas para web (por exemplo Nuxt, Vue e Node), integrações API-first e boas práticas de qualidade, sempre com foco em manutenção e evolução do software.',
    },
    {
      question: 'Há suporte após a entrega?',
      answer:
        'Sim. Oferecemos planos de sustentação e evolução com monitoramento, performance, segurança e novas funcionalidades.',
    },
    {
      question: 'Qual o meu envolvimento durante o desenvolvimento?',
      answer:
        'Você acompanha checkpoints frequentes, validações de entrega e decisões de roadmap com visibilidade total do andamento.',
    },
    {
      question: 'Fazem manutenção de site ou aplicativo?',
      answer:
        'Sim. Cobrimos backlog evolutivo, correções, monitoramento e governança técnica recorrente para sites, landings e aplicações web.',
    },
    {
      question: 'Os valores “R$ X.XXX” nos pacotes são finais?',
      answer:
        'São referências de comunicação até fecharmos o escopo no briefing. O orçamento final considera volume de páginas, integrações, SEO e prazos acordados.',
    },
  ])

  const faqColumns = computed(() => {
    const items = faqItems.value
    const half = Math.ceil(items.length / 2)
    return [items.slice(0, half), items.slice(half)]
  })

  const contactReasons = ref([
    'Landing / site inicial',
    'Site institucional + SEO',
    'Pacote personalizado',
    'Outro assunto',
  ])

  const socialLinks = computed<LandingSocialLink[]>(() => {
    const items: LandingSocialLink[] = []
    const instagram = String(config.public.instagramUrl || '').trim()
    const facebook = String(config.public.facebookUrl || '').trim()
    const linkedin = String(config.public.linkedinUrl || '').trim()
    if (instagram) items.push({ label: 'IG', href: instagram })
    if (facebook) items.push({ label: 'FB', href: facebook })
    if (linkedin) items.push({ label: 'IN', href: linkedin })
    return items
  })

  const footerEmail = computed(() => {
    const fromSettings = String(config.public.contactEmail || '').trim()
    if (fromSettings) return fromSettings
    const normalized = brandName.value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')
      .trim()
    return normalized ? `contato@${normalized}.com.br` : 'contato@cagtech.com.br'
  })

  const footerPhone = computed(() => {
    const phone = String(config.public.businessPhone || '').trim()
    return phone || '+55 67 99888-0000'
  })

  const footerLocation = computed(() => {
    const locality = String(config.public.seoLocality || '').trim()
    return locality || 'Campo Grande, MS'
  })

  const currentYear = computed(() => new Date().getFullYear())

  const hydrateFromCms = (content: LandingContent) => {
    if (content.settings.packagesIntroTitle) {
      packagesIntro.value = {
        title: content.settings.packagesIntroTitle,
        body: content.settings.packagesIntroBody || packagesIntro.value.body,
      }
    }
    if (content.settings.initialProjectTitle) {
      initialProject.value = {
        title: content.settings.initialProjectTitle,
        lead: content.settings.initialProjectLead || initialProject.value.lead,
        bullets:
          content.settings.initialProjectBullets.length > 0
            ? content.settings.initialProjectBullets
            : initialProject.value.bullets,
      }
    }
    if (content.packages.length > 0) {
      projectPackages.value = content.packages.map((item) => ({
        name: item.name,
        subtitle: item.subtitle,
        priceDisplay: item.priceDisplay,
        priceFootnote: item.priceFootnote || undefined,
        includes: item.includes,
        featured: item.featured,
      }))
    }
    if (content.projects.length > 0) {
      trustedBrands.value = content.projects.map((item) => item.name)
    }
    if (content.testimonials.length > 0) {
      testimonials.value = content.testimonials.map((item) => ({
        title: item.title,
        quote: item.body,
        name: item.project?.clientName || item.project?.name || 'Cliente',
        role: item.project?.name || '',
        siteUrl: item.project?.siteUrl || undefined,
        logoUrl: item.project?.logoUrl || undefined,
      }))
    }
    if (content.faqs.length > 0) {
      faqItems.value = content.faqs.map((item) => ({
        question: item.question,
        answer: item.answer,
      }))
    }
  }

  return {
    brandName,
    brandMonogram,
    navItems,
    audiences,
    trustedBrands,
    heroCopy,
    servicesIntro,
    services,
    packagesIntro,
    initialProject,
    projectPackages,
    differentiators,
    testimonials,
    faqItems,
    faqColumns,
    contactReasons,
    socialLinks,
    footerEmail,
    footerPhone,
    footerLocation,
    currentYear,
    hydrateFromCms,
  }
})
