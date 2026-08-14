import type { H3Event } from 'h3'

import type { SiteSettings, UpdateSiteSettingsInput } from '#shared/schemas/settings'
import { createSupabaseServerClient } from './supabase'

type SiteSettingsRow = {
  id: string
  site_url: string
  site_name: string
  seo_locality: string
  no_index: boolean
  business_address: string
  business_phone: string
  contact_email: string
  whatsapp_number: string
  whatsapp_message: string
  instagram_url: string
  facebook_url: string
  linkedin_url: string
  default_og_image_url: string
  ga4_measurement_id: string
  meta_pixel_id: string
  google_adsense_account: string
  maps_embed_url: string
  geo_latitude: string
  geo_longitude: string
  created_at: string
  updated_at: string
}

function asString(value: unknown, fallback = ''): string {
  return String(value ?? fallback).trim()
}

export function buildSiteSettingsFromEnv(event: H3Event): SiteSettings {
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
    createdAt: now,
    updatedAt: now,
  }
}

export function mapSiteSettingsRow(row: SiteSettingsRow): SiteSettings {
  return {
    id: row.id,
    siteUrl: row.site_url ?? '',
    siteName: row.site_name || 'CAG Tech',
    seoLocality: row.seo_locality ?? '',
    noIndex: Boolean(row.no_index),
    businessAddress: row.business_address ?? '',
    businessPhone: row.business_phone ?? '',
    contactEmail: row.contact_email ?? '',
    whatsappNumber: row.whatsapp_number ?? '',
    whatsappMessage: row.whatsapp_message ?? '',
    instagramUrl: row.instagram_url ?? '',
    facebookUrl: row.facebook_url ?? '',
    linkedinUrl: row.linkedin_url ?? '',
    defaultOgImageUrl: row.default_og_image_url || '/og-default.png',
    ga4MeasurementId: row.ga4_measurement_id ?? '',
    metaPixelId: row.meta_pixel_id ?? '',
    googleAdsenseAccount: row.google_adsense_account ?? '',
    mapsEmbedUrl: row.maps_embed_url ?? '',
    geoLatitude: row.geo_latitude ?? '',
    geoLongitude: row.geo_longitude ?? '',
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}

function toRowPatch(input: UpdateSiteSettingsInput): Record<string, unknown> {
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (input.siteUrl !== undefined) patch.site_url = input.siteUrl
  if (input.siteName !== undefined) patch.site_name = input.siteName
  if (input.seoLocality !== undefined) patch.seo_locality = input.seoLocality
  if (input.noIndex !== undefined) patch.no_index = input.noIndex
  if (input.businessAddress !== undefined) patch.business_address = input.businessAddress
  if (input.businessPhone !== undefined) patch.business_phone = input.businessPhone
  if (input.contactEmail !== undefined) patch.contact_email = input.contactEmail
  if (input.whatsappNumber !== undefined) patch.whatsapp_number = input.whatsappNumber
  if (input.whatsappMessage !== undefined) patch.whatsapp_message = input.whatsappMessage
  if (input.instagramUrl !== undefined) patch.instagram_url = input.instagramUrl
  if (input.facebookUrl !== undefined) patch.facebook_url = input.facebookUrl
  if (input.linkedinUrl !== undefined) patch.linkedin_url = input.linkedinUrl
  if (input.defaultOgImageUrl !== undefined) patch.default_og_image_url = input.defaultOgImageUrl
  if (input.ga4MeasurementId !== undefined) patch.ga4_measurement_id = input.ga4MeasurementId
  if (input.metaPixelId !== undefined) patch.meta_pixel_id = input.metaPixelId
  if (input.googleAdsenseAccount !== undefined) {
    patch.google_adsense_account = input.googleAdsenseAccount
  }
  if (input.mapsEmbedUrl !== undefined) patch.maps_embed_url = input.mapsEmbedUrl
  if (input.geoLatitude !== undefined) patch.geo_latitude = input.geoLatitude
  if (input.geoLongitude !== undefined) patch.geo_longitude = input.geoLongitude
  return patch
}

function seedRowFromEnv(event: H3Event): Record<string, unknown> {
  const seed = buildSiteSettingsFromEnv(event)
  return {
    id: 'default',
    site_url: seed.siteUrl,
    site_name: seed.siteName,
    seo_locality: seed.seoLocality,
    no_index: seed.noIndex,
    business_address: seed.businessAddress,
    business_phone: seed.businessPhone,
    contact_email: seed.contactEmail,
    whatsapp_number: seed.whatsappNumber,
    whatsapp_message: seed.whatsappMessage,
    instagram_url: seed.instagramUrl,
    facebook_url: seed.facebookUrl,
    linkedin_url: seed.linkedinUrl,
    default_og_image_url: seed.defaultOgImageUrl,
    ga4_measurement_id: seed.ga4MeasurementId,
    meta_pixel_id: seed.metaPixelId,
    google_adsense_account: seed.googleAdsenseAccount,
    maps_embed_url: seed.mapsEmbedUrl,
    geo_latitude: seed.geoLatitude,
    geo_longitude: seed.geoLongitude,
  }
}

export async function getOrCreateSiteSettings(event: H3Event): Promise<SiteSettings> {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase.from('site_settings').select('*').limit(1).maybeSingle()

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Não foi possível ler as configurações',
      message: error.message,
    })
  }

  if (data) {
    return mapSiteSettingsRow(data as SiteSettingsRow)
  }

  const { data: created, error: insertError } = await supabase
    .from('site_settings')
    .insert(seedRowFromEnv(event))
    .select('*')
    .single()

  if (insertError || !created) {
    return buildSiteSettingsFromEnv(event)
  }

  return mapSiteSettingsRow(created as SiteSettingsRow)
}

export async function updateSiteSettings(
  event: H3Event,
  input: UpdateSiteSettingsInput,
): Promise<SiteSettings> {
  await getOrCreateSiteSettings(event)
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from('site_settings')
    .update(toRowPatch(input))
    .eq('id', 'default')
    .select('*')
    .single()

  if (error || !data) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Falha ao salvar configurações',
      message: error?.message || 'Registro não encontrado',
    })
  }

  return mapSiteSettingsRow(data as SiteSettingsRow)
}

/** Settings do banco com fallback de env — usado em robots/sitemap. */
export async function resolveSiteSettings(event: H3Event): Promise<SiteSettings> {
  try {
    return await getOrCreateSiteSettings(event)
  } catch {
    return buildSiteSettingsFromEnv(event)
  }
}
