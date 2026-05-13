import { useMarketingSetup } from '~/composables/useMarketingSetup'
import { useSiteSeoHead } from '~/composables/useSiteSeoHead'

export default defineNuxtPlugin(() => {
  useSiteSeoHead()
  useMarketingSetup()
})
