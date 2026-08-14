import type { SiteSettings } from '@cagtech/shared'

function mergePublicSettings(settings: SiteSettings) {
  const config = useRuntimeConfig()
  const publicConfig = config.public as Record<string, unknown>

  const merge = (key: string, value: unknown) => {
    if (value === undefined || value === null) return
    if (typeof value === 'string' && value.trim() === '') return
    publicConfig[key] = value
  }

  merge('siteUrl', settings.siteUrl)
  merge('siteName', settings.siteName)
  merge('seoLocality', settings.seoLocality)
  if (typeof settings.noIndex === 'boolean') publicConfig.noIndex = settings.noIndex
  merge('businessAddress', settings.businessAddress)
  merge('businessPhone', settings.businessPhone)
  merge('contactEmail', settings.contactEmail)
  merge('whatsappNumber', settings.whatsappNumber)
  merge('whatsappMessage', settings.whatsappMessage)
  merge('instagramUrl', settings.instagramUrl)
  merge('facebookUrl', settings.facebookUrl)
  merge('linkedinUrl', settings.linkedinUrl)
  merge('ga4MeasurementId', settings.ga4MeasurementId)
  merge('metaPixelId', settings.metaPixelId)
  merge('googleAdsenseAccount', settings.googleAdsenseAccount)
  merge('mapsEmbedUrl', settings.mapsEmbedUrl)
  merge('geoLatitude', settings.geoLatitude)
  merge('geoLongitude', settings.geoLongitude)

  const og = String(settings.defaultOgImageUrl || '').trim()
  if (og) {
    publicConfig.defaultOgImageUrl = og
    if (og.startsWith('/')) {
      publicConfig.defaultOgImagePath = og
    }
  }
}

export default defineNuxtPlugin({
  name: 'site-settings',
  enforce: 'pre',
  async setup() {
    try {
      const settings = await $fetch<SiteSettings>(`${resolveApiBase()}/public/settings`)
      mergePublicSettings(settings)
    } catch {
      // env/runtimeConfig continua como fallback
    }
  },
})
