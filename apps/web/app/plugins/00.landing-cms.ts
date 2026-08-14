import type { LandingContent } from '@cagtech/shared'

export default defineNuxtPlugin({
  name: 'landing-cms',
  async setup(nuxtApp) {
    try {
      const content = await $fetch<LandingContent>(`${resolveApiBase()}/public/landing`)
      nuxtApp.runWithContext(() => {
        useLandingStore().hydrateFromCms(content)
      })
    } catch {
      // store estática permanece como fallback
    }
  },
})
