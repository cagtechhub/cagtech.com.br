import type { LandingContent } from '@cagtech/shared'

export default defineNuxtPlugin({
  name: 'landing-cms',
  async setup() {
    try {
      const content = await $fetch<LandingContent>(`${resolveApiBase()}/public/landing`)
      useLandingStore().hydrateFromCms(content)
    } catch {
      // store estática permanece como fallback
    }
  },
})
