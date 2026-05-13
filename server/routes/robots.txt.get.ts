import { getRequestURL } from 'h3'

import { noIndexFromRuntimeConfig } from '../utils/no-index'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const noIndex = noIndexFromRuntimeConfig(config as { public?: Record<string, unknown> })
  const configured = String(config.public?.siteUrl || '')
    .trim()
    .replace(/\/$/, '')
  const origin = configured || getRequestURL(event).origin

  const lines = ['User-Agent: *']
  if (noIndex) {
    lines.push('Disallow: /')
  } else {
    lines.push('Allow: /')
    lines.push('')
    lines.push(`Sitemap: ${origin}/sitemap.xml`)
  }

  setResponseHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return lines.join('\n')
})
