import type { SiteSettings } from '@cagtech/shared'
import type { SiteSettings as SiteSettingsRow } from '../infrastructure/prisma/output/client.ts'

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map((item) => String(item))
}

export function mapSettings(row: SiteSettingsRow): SiteSettings {
  return {
    id: row.id,
    siteUrl: row.siteUrl,
    siteName: row.siteName,
    seoLocality: row.seoLocality,
    noIndex: row.noIndex,
    businessAddress: row.businessAddress,
    businessPhone: row.businessPhone,
    contactEmail: row.contactEmail,
    whatsappNumber: row.whatsappNumber,
    whatsappMessage: row.whatsappMessage,
    instagramUrl: row.instagramUrl,
    facebookUrl: row.facebookUrl,
    linkedinUrl: row.linkedinUrl,
    defaultOgImageUrl: row.defaultOgImageUrl,
    ga4MeasurementId: row.ga4MeasurementId,
    metaPixelId: row.metaPixelId,
    googleAdsenseAccount: row.googleAdsenseAccount,
    mapsEmbedUrl: row.mapsEmbedUrl,
    geoLatitude: row.geoLatitude,
    geoLongitude: row.geoLongitude,
    packagesIntroTitle: row.packagesIntroTitle,
    packagesIntroBody: row.packagesIntroBody,
    initialProjectTitle: row.initialProjectTitle,
    initialProjectLead: row.initialProjectLead,
    initialProjectBullets: asStringArray(row.initialProjectBullets),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

export function parseReasons(raw: string | null): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    if (Array.isArray(parsed)) return parsed.map((item) => String(item))
  } catch {
    // stored as plain text
  }
  return [raw]
}
