import { defineStore } from 'pinia'

import { LANDING_NAV_ITEMS, landingHref } from '~/constants/landingScreen'
import type {
  LandingDifferentiator,
  LandingFaqItem,
  LandingNavItem,
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

  const audiences = ref(['Startups', 'Lideranças em projetos', 'Empresas de tecnologia'])

  const trustedBrands = ref(['Pieta Tech', 'Gm Bovinos', 'S.G Consultora', 'Nexiqo'])

  const services = ref<LandingService[]>([
    {
      title: 'Design',
      description:
        'Interfaces orientadas a resultado, com clareza visual, fluxos enxutos e consistência de marca em todos os pontos de contato digitais.',
      icon: 'M4 4h16v16H4z M8 8h8v8H8z',
    },
    {
      title: 'Engenharia',
      description:
        'Ideias virando produtos robustos, com stack moderna, boas práticas de qualidade e arquitetura preparada para escalar com segurança.',
      icon: 'M12 3v18 M3 12h18 M6 6l12 12 M18 6L6 18',
    },
    {
      title: 'Gestão de projetos',
      description:
        'Entregas com previsibilidade, acompanhamento contínuo e comunicação transparente para manter metas, prazo e escopo alinhados.',
      icon: 'M5 5h14v14H5z M8 9h8 M8 12h8 M8 15h5',
    },
  ])

  const differentiators = ref<LandingDifferentiator[]>([
    {
      title: 'Expertise',
      description:
        'Time multidisciplinar com domínio real de produto, design e desenvolvimento para resolver desafios digitais com profundidade técnica.',
      icon: 'M12 3l3 6 6 .9-4.5 4.4 1 6.2-5.5-2.9L6.5 20l1-6.2L3 9.9 9 9z',
    },
    {
      title: 'Foco no cliente',
      description:
        'Cada decisão parte do contexto de negócio e das necessidades reais, com ciclos curtos de feedback e ajustes colaborativos.',
      icon: 'M7 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20c0-2.8 2.6-5 5.5-5S13 17.2 13 20M11 20c.2-2.5 2.6-4.4 5.5-4.4 2.8 0 5 1.8 5.5 4.4',
    },
    {
      title: 'Soluções orientadas a resultado',
      description:
        'Priorizamos impacto mensurável, ligando cada funcionalidade a indicadores concretos de crescimento e eficiência operacional.',
      icon: 'M4 18h16M6 14l3-3 3 2 6-6',
    },
    {
      title: 'Parceria colaborativa',
      description:
        'Atuamos como extensão do seu time, com proximidade estratégica e suporte contínuo para evoluir o produto após o lançamento.',
      icon: 'M12 3l2.2 4.5L19 8l-3.4 3.3.8 4.7L12 14l-4.4 2 .8-4.7L5 8l4.8-.5z',
    },
  ])

  const testimonials = ref<LandingTestimonial[]>([
    {
      title: 'Nossa presença digital ganhou outro patamar.',
      quote:
        'A equipe entregou uma plataforma moderna, intuitiva e focada em conversão. Nossos resultados comerciais cresceram de forma consistente após o lançamento.',
      name: 'João Silva',
      role: 'CEO, Boutique Chic',
    },
    {
      title: 'Projeto fluido do início ao fim.',
      quote:
        'Entenderam nossa visão desde o início, com execução precisa e comunicação clara durante todo o projeto. O aplicativo superou nossas expectativas.',
      name: 'Sara Oliveira',
      role: 'Fundadora, Hungry Bites',
    },
    {
      title: 'Fluxo de reservas complexo virou algo simples.',
      quote:
        'O sistema de reservas ficou rápido, confiável e fácil de operar. A automação reduziu gargalos e melhorou a experiência do nosso cliente final.',
      name: 'Marcos Thompson',
      role: 'CEO, EventMasters',
    },
    {
      title: 'Automação que gerou salto real de produtividade.',
      quote:
        'Processos manuais foram eliminados e a equipe passou a focar no que gera valor. O ganho operacional ficou evidente nas primeiras semanas.',
      name: 'Laura Almeida',
      role: 'COO, ProTech Solutions',
    },
  ])

  const faqItems = computed<LandingFaqItem[]>(() => [
    {
      question: `Quais serviços a ${brandName.value} oferece?`,
      answer:
        'Design de produto, engenharia full-stack, squads dedicados, discovery, evolução de sistemas legados e suporte contínuo.',
    },
    {
      question: 'Como vocês ajudam o meu negócio?',
      answer:
        'Mapeamos oportunidades, aceleramos time-to-market e construímos experiências digitais com impacto em receita e eficiência.',
    },
    {
      question: 'Em quais segmentos vocês atuam?',
      answer:
        'B2B, varejo, saúde, educação e serviços, adaptando a estratégia ao contexto de cada operação.',
    },
    {
      question: 'Quanto tempo leva um projeto?',
      answer:
        'Projetos começam com um discovery curto e evoluem em ciclos incrementais. O prazo varia conforme escopo, complexidade e prioridade.',
    },
    {
      question: 'Vocês usam frameworks específicos?',
      answer:
        'Trabalhamos com stacks modernas como Nuxt, Vue, Node e integrações API-first, sempre priorizando manutenção e evolução.',
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
        'Sim. Cobrimos backlog evolutivo, correções, monitoramento e governança técnica recorrente.',
    },
  ])

  const faqColumns = computed(() => {
    const items = faqItems.value
    const half = Math.ceil(items.length / 2)
    return [items.slice(0, half), items.slice(half)]
  })

  const contactReasons = ref([
    'Site ou institucional',
    'Parceria / consultoria',
    'App mobile',
    'Outro assunto',
  ])

  const socialLinks = ref<LandingSocialLink[]>([
    // { label: 'Facebook', href: 'https://facebook.com' },
    // { label: 'X', href: 'https://x.com' },
    // { label: 'LinkedIn', href: 'https://linkedin.com' },
  ])

  const footerEmail = computed(() => {
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

  return {
    brandName,
    brandMonogram,
    navItems,
    audiences,
    trustedBrands,
    services,
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
  }
})
