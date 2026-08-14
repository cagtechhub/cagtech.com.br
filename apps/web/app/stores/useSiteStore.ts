import { defineStore } from 'pinia'

import type { WhatsAppSource } from '~/types/site'

export const useSiteStore = defineStore('site', () => {
  const config = useRuntimeConfig()

  const whatsappNumber = computed(() =>
    String(config.public.whatsappNumber || config.public.whatsappPhone || '').replace(/\D/g, '')
  )

  const whatsappMessage = computed(() =>
    String(config.public.whatsappMessage || 'Olá! Gostaria de falar com a CAG Tech.')
  )

  const whatsappLink = computed(
    () => `https://wa.me/${whatsappNumber.value}?text=${encodeURIComponent(whatsappMessage.value)}`
  )

  const trackWhatsAppClick = (source: WhatsAppSource) => {
    if (!import.meta.client) {
      return
    }

    const w = window as Window & {
      gtag?: (...args: unknown[]) => void
      dataLayer?: Array<Record<string, unknown>>
      fbq?: (...args: unknown[]) => void
    }

    if (typeof w.gtag === 'function') {
      w.gtag('event', 'whatsapp_click', {
        source,
        event_category: 'engagement',
        event_label: 'cta_whatsapp',
      })
    }

    if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event: 'whatsapp_click', source })
    }

    if (typeof w.fbq === 'function') {
      w.fbq('trackCustom', 'WhatsAppClick', { source })
    }
  }

  const openWhatsApp = (source: WhatsAppSource) => {
    trackWhatsAppClick(source)
    if (import.meta.client) {
      window.open(whatsappLink.value, '_blank', 'noopener,noreferrer')
    }
  }

  return {
    whatsappLink,
    openWhatsApp,
  }
})
