import { createClient } from '@supabase/supabase-js'

/**
 * Base do projeto Supabase — sem `/rest/v1` (o cliente PostgREST adiciona o path).
 * @see https://supabase.com/docs/reference/javascript/initializing
 */
export function normalizeSupabaseUrl(raw: string): string {
  const trimmed = raw.trim().replace(/\/+$/, '')
  if (!trimmed) {
    return ''
  }

  try {
    const url = new URL(trimmed)
    // Erro comum: colar a URL da API REST em vez da URL do projeto.
    if (url.pathname === '/rest/v1' || url.pathname.startsWith('/rest/v1/')) {
      url.pathname = ''
    }
    return url.toString().replace(/\/+$/, '')
  } catch {
    return trimmed
  }
}

export function getSupabaseServerConfig() {
  const config = useRuntimeConfig()
  const url = normalizeSupabaseUrl(
    String(config.private.supabaseUrl || config.public.supabaseUrl || ''),
  )
  const key = String(config.private.supabaseKey || '').trim()
  const schema = String(config.private.supabaseSchema || 'cagtech').trim() || 'cagtech'

  return { url, key, schema }
}

/** Cliente Auth (JWT `getUser`) — anon key no browser; fallback service no servidor. */
export function getSupabaseAuthClient() {
  const config = useRuntimeConfig()
  const url = normalizeSupabaseUrl(
    String(config.public.supabaseUrl || config.private.supabaseUrl || ''),
  )
  const key = String(config.public.supabaseAnonKey || config.private.supabaseKey || '').trim()

  if (!url || !key) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Supabase Auth não configurado',
      message:
        'Defina NUXT_PUBLIC_SUPABASE_URL e NUXT_PUBLIC_SUPABASE_ANON_KEY (login do painel).',
    })
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
}

export function createSupabaseServerClient() {
  const { url, key, schema } = getSupabaseServerConfig()

  if (!url || !key) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Integração com banco indisponível',
      message:
        'Configure NUXT_PRIVATE_SUPABASE_URL e NUXT_PRIVATE_SUPABASE_KEY (URL do projeto, sem /rest/v1).',
    })
  }

  try {
    const client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    return client.schema(schema)
  } catch {
    throw createError({
      statusCode: 503,
      statusMessage: 'URL do Supabase inválida',
      message:
        'NUXT_PRIVATE_SUPABASE_URL deve ser a URL base do projeto (ex.: https://xxxx.supabase.co), sem /rest/v1.',
    })
  }
}
