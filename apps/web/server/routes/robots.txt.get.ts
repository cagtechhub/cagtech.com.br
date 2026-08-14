export default defineEventHandler(async (event) => {
  const settings = await resolveSiteSettings(event)
  const origin = publicOrigin(event, settings.siteUrl)

  const lines = ['User-Agent: *']
  if (settings.noIndex) {
    lines.push('Disallow: /')
  } else {
    lines.push('Allow: /')
    lines.push('Disallow: /admin')
    lines.push('')
    lines.push(`Sitemap: ${origin}/sitemap.xml`)
  }

  setResponseHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return lines.join('\n')
})
