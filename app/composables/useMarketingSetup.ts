export const useMarketingSetup = () => {
  const config = useRuntimeConfig()

  const ga4MeasurementId = computed(() => String(config.public.ga4MeasurementId || '').trim())
  const metaPixelId = computed(() => String(config.public.metaPixelId || '').trim())

  useHead(() => {
    const scripts: Array<Record<string, unknown>> = []

    if (ga4MeasurementId.value) {
      const id = ga4MeasurementId.value
      scripts.push({
        key: 'ga4-gtag-src',
        src: `https://www.googletagmanager.com/gtag/js?id=${id}`,
        async: true,
        defer: true,
        tagPosition: 'bodyClose' as const,
      })
      scripts.push({
        key: 'ga4-inline',
        type: 'text/javascript',
        tagPosition: 'bodyClose' as const,
        children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=window.gtag||gtag;gtag('js',new Date());gtag('config','${id}');`,
      })
    }

    if (metaPixelId.value) {
      const id = metaPixelId.value
      scripts.push({
        key: 'meta-pixel',
        type: 'text/javascript',
        tagPosition: 'bodyClose' as const,
        children: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${id}');fbq('track','PageView');`,
      })
    }

    return { script: scripts }
  })

  return {
    ga4MeasurementId,
    metaPixelId,
  }
}
