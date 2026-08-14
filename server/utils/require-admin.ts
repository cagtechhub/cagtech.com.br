import type { H3Event } from 'h3'

import { getSupabaseAuthClient } from './supabase'

export type AdminUser = {
  id: string
  email: string
}

function parseAllowedAdminEmails(event: H3Event): Set<string> | null {
  const config = useRuntimeConfig(event)
  const raw = String(
    config.adminAllowedEmails || process.env.ADMIN_ALLOWED_EMAILS || '',
  ).trim()
  if (!raw) {
    return null
  }
  return new Set(
    raw
      .split(',')
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean),
  )
}

function adminRequireRole(event: H3Event): boolean {
  const config = useRuntimeConfig(event)
  const v = config.adminRequireRole as boolean | string | undefined
  return v === true || v === 'true' || v === '1' || process.env.ADMIN_REQUIRE_ROLE === 'true'
}

/** Valida Bearer JWT do Supabase Auth e a allowlist de e-mails. */
export async function requireAdmin(event: H3Event): Promise<AdminUser> {
  const header = getHeader(event, 'authorization') ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : ''

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token ausente',
    })
  }

  const supabase = getSupabaseAuthClient()
  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Sessão inválida ou expirada',
    })
  }

  const email = (data.user.email || '').toLowerCase()
  const allowedEmails = parseAllowedAdminEmails(event)
  if (allowedEmails && (!email || !allowedEmails.has(email))) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Usuário sem permissão de admin',
    })
  }

  const role = data.user.app_metadata?.role
  if (adminRequireRole(event) && role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Perfil admin obrigatório',
    })
  }

  return { id: data.user.id, email: data.user.email || email }
}
