import { defineStore } from 'pinia'

import { CONSENT_STORAGE_KEY, type ConsentChoice } from '~/types/consent'

function readStoredChoice(): ConsentChoice | null {
  if (!import.meta.client) {
    return null
  }
  const raw = localStorage.getItem(CONSENT_STORAGE_KEY)
  if (raw === 'all' || raw === 'essential') {
    return raw
  }
  return null
}

export const useConsentStore = defineStore('consent', () => {
  const status = ref<ConsentChoice>('pending')
  /** `true` após ler o `localStorage` no cliente (plugin `00.consent-hydrate.client`). */
  const hydrated = ref(false)

  function hydrate(): void {
    if (!import.meta.client || hydrated.value) {
      return
    }
    const stored = readStoredChoice()
    status.value = stored ?? 'pending'
    hydrated.value = true
  }

  function persist(value: Exclude<ConsentChoice, 'pending'>): void {
    if (!import.meta.client) {
      return
    }
    localStorage.setItem(CONSENT_STORAGE_KEY, value)
  }

  /** Google Analytics 4, Meta Pixel e similares. */
  const allowsMarketing = computed(() => status.value === 'all')

  function acceptAll(): void {
    status.value = 'all'
    persist('all')
  }

  function acceptEssentialOnly(): void {
    status.value = 'essential'
    persist('essential')
  }

  return {
    status,
    hydrated,
    hydrate,
    allowsMarketing,
    acceptAll,
    acceptEssentialOnly,
  }
})
