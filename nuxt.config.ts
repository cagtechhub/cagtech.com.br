// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  /** Estrutura padrão do Nuxt 4: código em `app/`. */
  srcDir: 'app/',
  compatibilityDate: '2026-04-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxt/eslint', 'nuxt-security'],
  runtimeConfig: {
    public: {
      /** URL canônica do site (ex.: https://www.cagtech.com.br). Recomendado em produção. */
      siteUrl: '',
      siteName: 'CAG Tech',
      /** `true` em preview/staging: meta robots noindex + robots.txt Disallow. */
      noIndex: false,
      /** Local para título, descrição e schema (ex.: São Paulo, SP). */
      seoLocality: '',
      /** Endereço postal visível e em LocalBusiness (uma linha). */
      businessAddress: '',
      /** Telefone em formato internacional para `tel:` e schema (ex.: +5511999999999). */
      businessPhone: '',
      /** Caminho da imagem Open Graph (absoluto = siteUrl + path). */
      defaultOgImagePath: '/og-default.png',
      /** DDI + DDD + número, só dígitos (ex.: 5511999999999). Preferência sobre whatsappPhone. */
      whatsappNumber: '',
      /** @deprecated Use whatsappNumber; mantido para compatibilidade com env antigo. */
      whatsappPhone: '',
      whatsappMessage: 'Olá! Gostaria de falar com a CAG Tech.',
      instagramUrl: '',
      facebookUrl: '',
      ga4MeasurementId: '',
      metaPixelId: '',
      googleAdsenseAccount: '',
    },
    private: {
      supabaseUrl: '',
      supabaseKey: '',
      supabaseSchema: '',
    },
  },
  pinia: {
    /** Relativo a `srcDir` (app/). */
    storesDirs: ['./stores'],
  },
  app: {
    head: {
      /** Título completo vem de `useSiteSeoHead` (usa `siteName` do runtime). */
      titleTemplate: '%s',
      htmlAttrs: { lang: 'pt-BR' },
    },
  },
  tailwindcss: {
    /** Um único entry: o módulo injeta este arquivo (evita duplicar em `css: []`). */
    cssPath: '~/assets/css/tailwind.css',
    exposeConfig: true,
    editorSupport: true,
  },
  /** Dev server atrás de túnel (ngrok): evita “Blocked request … host is not allowed”. */
  vite: {
    server: {
      allowedHosts: ['localhost', '.ngrok-free.app', '.ngrok.app', '.ngrok.io'],
    },
  },
  security: {
    enabled: true,
    /**
     * Chaves em camelCase (OptionKey), como no nuxt-security — nomes HTTP fazem
     * `getNameFromKey` retornar undefined e quebram o SSR com setHeader inválido.
     */
    headers: {
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'script-src': [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          'https://www.googletagmanager.com',
          'https://connect.facebook.net',
        ],
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'img-src': ["'self'", 'data:', 'https://*.google-analytics.com', 'https://*.facebook.net'],
        /** GA4 (`/g/collect`), GTM e Meta Pixel (beacons / fetch). */
        'connect-src': [
          "'self'",
          'https://www.google-analytics.com',
          'https://*.google-analytics.com',
          'https://analytics.google.com',
          'https://www.googletagmanager.com',
          'https://*.googletagmanager.com',
          'https://stats.g.doubleclick.net',
          'https://*.doubleclick.net',
          'https://*.facebook.com',
          'https://*.facebook.net',
        ],
        'frame-src': ["'self'", 'https://www.facebook.com'],
        'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com'],
        'object-src': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"],
        'frame-ancestors': ["'none'"],
        'report-uri': '/csp-report',
      },
      xFrameOptions: 'DENY',
      xContentTypeOptions: 'nosniff',
      xXSSProtection: '1; mode=block',
      referrerPolicy: 'no-referrer',
      permissionsPolicy: {
        camera: [],
        microphone: [],
        geolocation: [],
      },
      strictTransportSecurity: {
        maxAge: 31536000,
        includeSubdomains: true,
        preload: true,
      },
      xPermittedCrossDomainPolicies: 'none',
      xDownloadOptions: 'noopen',
    },
    corsHandler: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      exposeHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    },
  },
})
