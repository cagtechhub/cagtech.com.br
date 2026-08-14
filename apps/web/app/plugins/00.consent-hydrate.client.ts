export default defineNuxtPlugin(() => {
  const consent = useConsentStore()
  consent.hydrate()
})
