import { useSchemaOrg } from '@unhead/schema-org/vue'

function trimUrl(u: string) {
  return u.trim().replace(/\/$/, '')
}

function limitSeoText(value: string, max: number) {
  const trimmed = value.trim()
  if (trimmed.length <= max) return trimmed
  return `${trimmed.slice(0, max - 1).trimEnd()}…`
}

/** Metadados globais: canônico, robots, Open Graph, Twitter e Schema.org. */
export function useSiteSeoHead() {
  const config = useRuntimeConfig()
  const route = useRoute()
  const consent = useConsentStore()
  const canonicalUrl = useCanonicalUrl()
  const origin = usePublicSiteOrigin()
  const landing = useLandingStore()

  const isAdmin = computed(() => (route.path || '').startsWith('/admin'))
  const siteName = computed(() => String(config.public.siteName || 'CAG Tech').trim() || 'CAG Tech')
  const locality = computed(() => String(config.public.seoLocality || '').trim())
  const noIndex = computed(() => {
    if (isAdmin.value) return true
    const v = config.public.noIndex as boolean | string | undefined
    return v === true || v === 'true' || v === '1'
  })

  const pageTitle = computed(() => {
    const base = 'Software web, sites e SEO'
    const loc = locality.value
    return loc ? `${base} — ${loc}` : base
  })

  const documentTitle = computed(() =>
    limitSeoText(`${siteName.value} | ${pageTitle.value}`, 65),
  )

  const metaDescription = computed(() => {
    const loc = locality.value
    const name = siteName.value
    const core = `${name}: software para web — criação de sites, landing pages e otimização SEO, com gestão de projeto e pacotes que incluem domínio, VPS e evolução contínua.`
    const local = loc ? ` Atendimento em ${loc}.` : ' '
    const tail = 'Entre em contato para conversar sobre o seu projeto.'
    return limitSeoText(`${core}${local}${tail}`, 160)
  })

  const ogImage = computed(() => {
    const explicit = String(config.public.defaultOgImageUrl || '').trim()
    if (/^https?:\/\//i.test(explicit)) return explicit
    const o = origin.value
    if (!o) return ''
    const path = (explicit.startsWith('/') ? explicit : String(config.public.defaultOgImagePath || '/og-default.png').trim()) ||
      '/og-default.png'
    return `${trimUrl(o)}${path.startsWith('/') ? path : `/${path}`}`
  })

  const sameAs = computed(() =>
    [config.public.instagramUrl, config.public.facebookUrl, config.public.linkedinUrl]
      .map((u) => String(u || '').trim())
      .filter((u) => u.length > 0 && /^https?:\/\//i.test(u)),
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
    if (locality.value) base.push(locality.value)
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
    ogTitle: documentTitle,
    ogDescription: metaDescription,
    ogImage,
    ogImageWidth: '1200',
    ogImageHeight: '630',
    ogImageType: 'image/png',
    ogImageAlt: `${siteName.value} — identidade visual`,
    ogUrl: canonicalUrl,
    twitterCard: 'summary_large_image',
    twitterTitle: documentTitle,
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
    if (ga4.value && consent.allowsMarketing && !isAdmin.value) {
      links.push({ rel: 'preconnect', href: 'https://www.googletagmanager.com' })
    }
    if (pixel.value && consent.allowsMarketing && !isAdmin.value) {
      links.push({ rel: 'preconnect', href: 'https://connect.facebook.net' })
    }
    return links
  })

  const schemaNodes = computed(() => {
    if (isAdmin.value) return []

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
    const contactEmail = String(config.public.contactEmail || '').trim()
    const lat = Number(String(config.public.geoLatitude || '').trim())
    const lng = Number(String(config.public.geoLongitude || '').trim())
    const hasGeo = Number.isFinite(lat) && Number.isFinite(lng) && String(config.public.geoLatitude || '').trim() !== ''

    const contactPoint: Record<string, unknown> = {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      areaServed: 'BR',
      availableLanguage: 'Portuguese',
    }
    if (contactEmail) contactPoint.email = contactEmail
    if (tel) contactPoint.telephone = tel
    const hasContactPoint = Boolean(contactEmail || tel)

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

    if (hasContactPoint) organization.contactPoint = contactPoint
    if (sameAs.value.length) organization.sameAs = [...sameAs.value]

    const graph: Array<Record<string, unknown>> = [organization]

    if (tel || addressLine || locality.value || hasGeo) {
      const postal: Record<string, string> = {
        '@type': 'PostalAddress',
        addressCountry: 'BR',
      }
      if (addressLine) postal.streetAddress = addressLine
      if (locality.value) postal.addressLocality = locality.value

      graph.push({
        '@type': 'ProfessionalService',
        '@id': `${url}#localbusiness`,
        name: siteName.value,
        url,
        description: metaDescription.value,
        parentOrganization: { '@id': `${url}#organization` },
        ...(tel ? { telephone: tel } : {}),
        ...(contactEmail ? { email: contactEmail } : {}),
        ...(addressLine || locality.value ? { address: postal } : {}),
        ...(hasGeo
          ? { geo: { '@type': 'GeoCoordinates', latitude: lat, longitude: lng } }
          : {}),
        ...(sameAs.value.length ? { sameAs: [...sameAs.value] } : {}),
        ...(ogImage.value ? { image: ogImage.value } : {}),
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

    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Início',
          item: url,
        },
      ],
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
        ...(canon && !isAdmin.value ? [{ rel: 'canonical' as const, href: canon }] : []),
        ...hreflang,
        ...preconnects.value,
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon.png',
        },
        {
          rel: 'apple-touch-icon',
          href: '/favicon.png',
        },
      ],
    }
  })
}
