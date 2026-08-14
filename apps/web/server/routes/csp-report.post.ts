import { getHeader, readBody, readRawBody, setResponseStatus } from 'h3'

const MAX_BODY_CHARS = 16_384

/**
 * Recebe relatórios de violação CSP (`report-uri`).
 * @see https://www.w3.org/TR/CSP3/#violation-reports
 */
export default defineEventHandler(async (event) => {
  let payload: unknown

  try {
    const ct = (getHeader(event, 'content-type') || '').toLowerCase()
    if (ct.includes('application/json') || ct.includes('application/csp-report')) {
      payload = await readBody(event)
    } else {
      const raw = await readRawBody(event, 'utf8')
      if (!raw) {
        payload = null
      } else if (raw.length > MAX_BODY_CHARS) {
        payload = { truncated: true, length: raw.length }
      } else {
        try {
          payload = JSON.parse(raw) as unknown
        } catch {
          payload = { rawPreview: raw.slice(0, 500) }
        }
      }
    }
  } catch {
    payload = { parseError: true }
  }

  if (import.meta.dev) {
    const line =
      typeof payload === 'string'
        ? payload.slice(0, MAX_BODY_CHARS)
        : JSON.stringify(payload).slice(0, MAX_BODY_CHARS)
    console.warn('[csp-report]', line)
  }

  setResponseStatus(event, 204)
  return ''
})
