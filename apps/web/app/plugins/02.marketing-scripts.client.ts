import type { RouteLocationNormalizedLoaded } from 'vue-router'

const GA_SRC_ID = 'cagtech-ga4-src'
const GA_INLINE_ID = 'cagtech-ga4-inline'
const META_PIXEL_ID = 'cagtech-meta-pixel'

function appendExternalScript(id: string, src: string): void {
  if (document.getElementById(id)) {
    return
  }
  const el = document.createElement('script')
  el.id = id
  el.async = true
  el.src = src
  document.head.appendChild(el)
}

function appendInlineScript(id: string, code: string): void {
  if (document.getElementById(id)) {
    return
  }
  const el = document.createElement('script')
  el.id = id
  el.type = 'text/javascript'
  el.textContent = code
  document.head.appendChild(el)
}

function injectGa4(measurementId: string): void {
  const idJson = JSON.stringify(measurementId)
  appendExternalScript(
    GA_SRC_ID,
    `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`,
  )
  appendInlineScript(
    GA_INLINE_ID,
    [
      'window.dataLayer=window.dataLayer||[];',
      'function gtag(){dataLayer.push(arguments);}',
      'window.gtag=window.gtag||gtag;',
      "gtag('js', new Date());",
      `gtag('config', ${idJson}, { send_page_view: false });`,
    ].join(''),
  )
}

/** Só `init`; `PageView` é disparado em `flushMarketingPageViews` para evitar duplicata na primeira carga. */
function injectMetaPixel(pixelId: string): void {
  const idJson = JSON.stringify(pixelId)
  appendInlineScript(
    META_PIXEL_ID,
    [
      "!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');",
      `fbq('init', ${idJson});`,
    ].join(''),
  )
}

function sendGa4PageView(to: RouteLocationNormalizedLoaded): void {
  const w = window as Window & { gtag?: (...args: unknown[]) => void }
  if (typeof w.gtag !== 'function') {
    return
  }
  w.gtag('event', 'page_view', {
    page_path: to.fullPath,
    page_location: `${w.location.origin}${to.fullPath}`,
    page_title: document.title,
  })
}

function sendMetaPageView(): void {
  const w = window as Window & { fbq?: (...args: unknown[]) => void }
  if (typeof w.fbq !== 'function') {
    return
  }
  w.fbq('track', 'PageView')
}

function flushMarketingPageViews(
  to: RouteLocationNormalizedLoaded,
  measurementId: string,
  hasPixel: boolean,
): void {
  nextTick(() => {
    if (measurementId) {
      sendGa4PageView(to)
    }
    if (hasPixel) {
      sendMetaPageView()
    }
  })
}

/**
 * GA4 / Meta Pixel fora do `useHead`: o Unhead pode remover `<script>` com `tagPosition: 'bodyClose'`
 * em navegações (ex.: âncoras `#secao`). Injeção idempotente em `document.head` + page view nas mudanças de rota.
 */
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const consent = useConsentStore()
  const router = useRouter()

  const gaId = computed(() => String(config.public.ga4MeasurementId || '').trim())
  const pixelId = computed(() => String(config.public.metaPixelId || '').trim())

  function syncMarketing(): void {
    if (!consent.allowsMarketing) {
      return
    }
    if (router.currentRoute.value.path.startsWith('/admin')) {
      return
    }
    const g = gaId.value
    const p = pixelId.value
    if (g) {
      injectGa4(g)
    }
    if (p) {
      injectMetaPixel(p)
    }
  }

  watch(
    [() => consent.allowsMarketing, gaId, pixelId],
    () => {
      syncMarketing()
      if (!consent.allowsMarketing) {
        return
      }
      flushMarketingPageViews(router.currentRoute.value, gaId.value, Boolean(pixelId.value))
    },
    { immediate: true },
  )

  /** Primeiro `afterEach` coincide com a carga inicial já coberta pelo `watch` imediato. */
  let skipNextAfterEach = true
  router.afterEach((to) => {
    if (!consent.allowsMarketing) {
      return
    }
    if (to.path.startsWith('/admin')) {
      return
    }
    if (skipNextAfterEach) {
      skipNextAfterEach = false
      return
    }
    flushMarketingPageViews(to, gaId.value, Boolean(pixelId.value))
  })
})
