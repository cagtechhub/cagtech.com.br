import { createClient } from '@supabase/supabase-js'
import type { Context, Next } from 'hono'
import { HTTPException } from 'hono/http-exception'

import { env, parseAllowedEmails } from '../env.ts'

export type AdminUser = { id: string; email: string }

function authClient() {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new HTTPException(500, { message: 'Supabase Auth não configurado' })
  }
  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function requireAdmin(c: Context, next: Next) {
  const header = c.req.header('authorization') ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : ''
  if (!token) {
    throw new HTTPException(401, { message: 'Token ausente' })
  }

  const { data, error } = await authClient().auth.getUser(token)
  if (error || !data.user) {
    throw new HTTPException(401, { message: 'Sessão inválida ou expirada' })
  }

  const email = (data.user.email || '').toLowerCase()
  const allowed = parseAllowedEmails()
  if (allowed && (!email || !allowed.has(email))) {
    throw new HTTPException(403, { message: 'Usuário sem permissão de admin' })
  }

  const role = data.user.app_metadata?.role
  if (env.adminRequireRole && role !== 'admin') {
    throw new HTTPException(403, { message: 'Perfil admin obrigatório' })
  }

  c.set('admin', { id: data.user.id, email: data.user.email || email } satisfies AdminUser)
  await next()
}

export function storageClient() {
  if (!env.supabaseUrl || !env.supabaseServiceKey) {
    throw new HTTPException(500, { message: 'Storage não configurado (service role)' })
  }
  return createClient(env.supabaseUrl, env.supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export function publicLogoUrl(path: string | null): string | null {
  if (!path || !env.supabaseUrl) return null
  return `${env.supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/project-logos/${path}`
}
