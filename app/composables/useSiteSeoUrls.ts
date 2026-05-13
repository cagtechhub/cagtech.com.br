/**
 * Origem absoluta do site (ex.: `https://www.cagtech.com.br`).
 * Ordem: `NUXT_PUBLIC_SITE_URL` → URL da requisição (SSR) → `window.location.origin` (cliente).
 */
export function usePublicSiteOrigin() {
  const config = useRuntimeConfig()

  return computed(() => {
    const fromEnv = String(config.public.siteUrl || '')
      .trim()
      .replace(/\/$/, '')
    if (fromEnv) return fromEnv
    if (import.meta.server) {
      try {
        return useRequestURL().origin
      } catch {
        return ''
      }
    }
    if (import.meta.client && typeof window !== 'undefined') {
      return window.location.origin
    }
    return ''
  })
}

/** URL canônica da rota atual (path + origem pública). */
export function useCanonicalUrl() {
  const route = useRoute()
  const origin = usePublicSiteOrigin()

  return computed(() => {
    const o = origin.value
    if (!o) return ''
    const path = route.path || '/'
    return `${o}${path.startsWith('/') ? path : `/${path}`}`
  })
}
