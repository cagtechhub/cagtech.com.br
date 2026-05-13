import { useSchemaOrg } from '@unhead/schema-org/vue'

function trimUrl(u: string) {
  return u.trim().replace(/\/$/, '')
}

/** Metadados globais: canônico, robots, Open Graph, Twitter e Schema.org. */
export function useSiteSeoHead() {
  const config = useRuntimeConfig()
  const route = useRoute()
  const consent = useConsentStore()
  const canonicalUrl = useCanonicalUrl()
  const origin = usePublicSiteOrigin()
  const landing = useLandingStore()

  const siteName = computed(() => String(config.public.siteName || 'CAG Tech').trim())
  const locality = computed(() => String(config.public.seoLocality || '').trim())
  const noIndex = computed(() => {
    const v = config.public.noIndex as boolean | string | undefined
    if (v === true || v === 'true' || v === '1') return true
    return false
  })

  const pageTitle = computed(() => {
    const base = 'Software web, sites e SEO'
    const loc = locality.value
    return loc ? `${base} — ${loc}` : base
  })

  /** Título do documento e redes (alinhado ao `siteName` configurável). */
  const documentTitle = computed(() => `${siteName.value} | ${pageTitle.value}`)

  const metaDescription = computed(() => {
    const loc = locality.value
    const name = siteName.value
    const core = `${name}: software para web — criação de sites, landing pages e otimização SEO, com gestão de projeto e pacotes que incluem domínio, VPS e evolução contínua.`
    const local = loc ? ` Atendimento em ${loc}.` : ' '
    const tail = 'Entre em contato para conversar sobre o seu projeto.'
    const full = `${core}${local}${tail}`
    return full.length > 160 ? `${full.slice(0, 157)}…` : full
  })

  const ogImage = computed(() => {
    const o = origin.value
    if (!o) return ''
    const path = String(config.public.defaultOgImagePath || '/og-default.png').trim()
    return `${trimUrl(o)}${path.startsWith('/') ? path : `/${path}`}`
  })

  const ogTitle = documentTitle

  const sameAs = computed(() =>
    [config.public.instagramUrl, config.public.facebookUrl]
      .map((u) => String(u || '').trim())
      .filter((u) => u.length > 0 && /^https?:\/\//i.test(u))
  )

  const seoKeywords = computed(() => {
    const base = [
      'software web',
      'criação de sites',
      'landing page',
      'SEO',
      'desenvolvimento web',
      siteName.value,
    ]
    return base.join(', ')
  })

  useSeoMeta({
    title: documentTitle,
    description: metaDescription,
    applicationName: siteName,
    keywords: seoKeywords,
    ogSiteName: siteName,
    ogType: 'website',
    ogLocale: 'pt_BR',
    ogTitle,
    ogDescription: metaDescription,
    ogImage,
    ogImageWidth: '1200',
    ogImageHeight: '630',
    ogImageType: 'image/png',
    ogImageAlt: `${siteName.value} — identidade visual`,
    ogUrl: canonicalUrl,
    twitterCard: 'summary_large_image',
    twitterTitle: ogTitle,
    twitterDescription: metaDescription,
    twitterImage: ogImage,
    themeColor: '#070B14',
    author: siteName,
  })

  const ga4 = computed(() => String(config.public.ga4MeasurementId || '').trim())
  const pixel = computed(() => String(config.public.metaPixelId || '').trim())

  const preconnects = computed(() => {
    const links: Array<Record<string, string>> = [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    ]
    if (ga4.value && consent.allowsMarketing) {
      links.push({ rel: 'preconnect', href: 'https://www.googletagmanager.com' })
    }
    if (pixel.value && consent.allowsMarketing) {
      links.push({ rel: 'preconnect', href: 'https://connect.facebook.net' })
    }
    return links
  })

  const schemaNodes = computed(() => {
    const url = canonicalUrl.value || (origin.value ? `${trimUrl(origin.value)}/` : '')
    if (!url) return []

    const baseOrigin = trimUrl(origin.value || url.replace(/\/$/, ''))
    const addressLine = String(config.public.businessAddress || '').trim()
    const phoneDigits = String(config.public.businessPhone || '')
      .replace(/\D/g, '')
      .trim()
      ? String(config.public.businessPhone || '').replace(/\D/g, '')
      : String(config.public.whatsappNumber || config.public.whatsappPhone || '').replace(/\D/g, '')
    const tel = phoneDigits ? `+${phoneDigits}` : ''

    const organization: Record<string, unknown> = {
      '@type': 'Organization',
      '@id': `${url}#organization`,
      name: siteName.value,
      url,
      description: metaDescription.value,
    }

    if (baseOrigin) {
      organization.logo = {
        '@type': 'ImageObject',
        url: `${baseOrigin}/img/logo.png`,
      }
    }

    if (sameAs.value.length) {
      organization.sameAs = [...sameAs.value]
    }

    const graph: Array<Record<string, unknown>> = [organization]

    if (tel || addressLine || locality.value) {
      const postal: Record<string, string> = {
        '@type': 'PostalAddress',
        addressCountry: 'BR',
      }
      if (addressLine) postal.streetAddress = addressLine
      if (locality.value) postal.addressLocality = locality.value

      graph.push({
        '@type': 'LocalBusiness',
        '@id': `${url}#localbusiness`,
        name: siteName.value,
        url,
        description: metaDescription.value,
        parentOrganization: { '@id': `${url}#organization` },
        ...(tel ? { telephone: tel } : {}),
        ...(addressLine || locality.value ? { address: postal } : {}),
      })
    }

    graph.push({
      '@type': 'WebSite',
      '@id': `${url}#website`,
      url,
      name: siteName.value,
      description: metaDescription.value,
      inLanguage: 'pt-BR',
      publisher: { '@id': `${url}#organization` },
    })

    const path = route.path || '/'
    if (path === '/' && landing.faqItems.length > 0) {
      graph.push({
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        url,
        mainEntity: landing.faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      })
    }

    return graph
  })

  useSchemaOrg(() => schemaNodes.value)

  useHead(() => {
    const canon = canonicalUrl.value
    const hreflang =
      canon && !noIndex.value
        ? ([
            { rel: 'alternate' as const, hreflang: 'pt-BR', href: canon },
            { rel: 'alternate' as const, hreflang: 'x-default', href: canon },
          ] as const)
        : ([] as const)

    return {
      meta: [
        {
          name: 'robots',
          content: noIndex.value
            ? 'noindex, nofollow'
            : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
        },
        {
          name: 'google-adsense-account',
          content: config.public.googleAdsenseAccount || '',
        },
      ],
      link: [
        ...(canon ? [{ rel: 'canonical' as const, href: canon }] : []),
        ...hreflang,
        ...preconnects.value,
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon.png',
        },
      ],
    }
  })
}
