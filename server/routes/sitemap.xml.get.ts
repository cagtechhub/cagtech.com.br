import { getRequestURL } from 'h3'

import { noIndexFromRuntimeConfig } from '../utils/no-index'

function escapeXml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  if (noIndexFromRuntimeConfig(config as { public?: Record<string, unknown> })) {
    setResponseStatus(event, 404)
    setResponseHeader(event, 'content-type', 'text/plain; charset=utf-8')
    return 'Not found'
  }

  const configured = String(config.public?.siteUrl || '')
    .trim()
    .replace(/\/$/, '')
  const origin = configured || getRequestURL(event).origin
  const home = `${origin}/`

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${escapeXml(home)}</loc>
    <changefreq>weekly</changefreq>
    <priority>1</priority>
  </url>
</urlset>
`

  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return xml
})
