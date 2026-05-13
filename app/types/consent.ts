/** Chave única no `localStorage` para a escolha de cookies (LGPD / transparência). */
export const CONSENT_STORAGE_KEY = 'cagtech_cookie_consent_v1'

/** `pending`: ainda não escolheu; `essential`: sem medição de marketing; `all`: GA4/Meta permitidos. */
export type ConsentChoice = 'pending' | 'essential' | 'all'
