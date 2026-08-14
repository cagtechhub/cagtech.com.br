import type { SiteSettings } from '@cagtech/shared'
import type { H3Event } from 'h3'

import { getRequestURL } from 'h3'

function asString(value: unknown, fallback = '') {
  return String(value ?? fallback).trim()
}

export function settingsFromEnv(event: H3Event): SiteSettings {
  const config = useRuntimeConfig(event)
  const pub = config.public
  const now = new Date()
  return {
    id: 'default',
    siteUrl: asString(pub.siteUrl),
    siteName: asString(pub.siteName, 'CAG Tech') || 'CAG Tech',
    seoLocality: asString(pub.seoLocality, 'Campo Grande, MS'),
    noIndex: pub.noIndex === true || pub.noIndex === 'true' || pub.noIndex === '1',
    businessAddress: asString(pub.businessAddress),
    businessPhone: asString(pub.businessPhone),
    contactEmail: asString(pub.contactEmail),
    whatsappNumber: asString(pub.whatsappNumber || pub.whatsappPhone),
    whatsappMessage: asString(pub.whatsappMessage),
    instagramUrl: asString(pub.instagramUrl),
    facebookUrl: asString(pub.facebookUrl),
    linkedinUrl: asString(pub.linkedinUrl),
    defaultOgImageUrl: asString(pub.defaultOgImageUrl || pub.defaultOgImagePath, '/og-default.png'),
    ga4MeasurementId: asString(pub.ga4MeasurementId),
    metaPixelId: asString(pub.metaPixelId),
    googleAdsenseAccount: asString(pub.googleAdsenseAccount),
    mapsEmbedUrl: asString(pub.mapsEmbedUrl),
    geoLatitude: asString(pub.geoLatitude),
    geoLongitude: asString(pub.geoLongitude),
    packagesIntroTitle: '',
    packagesIntroBody: '',
    initialProjectTitle: '',
    initialProjectLead: '',
    initialProjectBullets: [],
    createdAt: now,
    updatedAt: now,
  }
}

export async function resolveSiteSettings(event: H3Event): Promise<SiteSettings> {
  const config = useRuntimeConfig(event)
  const base = String(config.apiBase || config.public.apiBase || '').replace(/\/$/, '')
  if (base) {
    try {
      return await $fetch<SiteSettings>(`${base}/public/settings`)
    } catch {
      // fallback env
    }
  }
  return settingsFromEnv(event)
}

export function publicOrigin(event: H3Event, siteUrl: string) {
  const configured = siteUrl.trim().replace(/\/$/, '')
  return configured || getRequestURL(event).origin
}
