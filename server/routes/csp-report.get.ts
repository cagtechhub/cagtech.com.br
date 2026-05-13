import { setResponseStatus } from 'h3'

/**
 * Evita que `GET /csp-report` caia no Vue Router (aviso “No match found”).
 * Relatórios CSP usam `POST`; GET responde vazio.
 */
export default defineEventHandler((event) => {
  setResponseStatus(event, 204)
  return ''
})
