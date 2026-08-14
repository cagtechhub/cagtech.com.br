import 'dotenv/config'

function required(name: string): string {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error(`Variável de ambiente ausente: ${name}`)
  }
  return value
}

function optional(name: string, fallback = ''): string {
  return process.env[name]?.trim() || fallback
}

export const env = {
  port: Number(process.env.PORT || 3001),
  databaseUrl: required('DATABASE_URL'),
  supabaseUrl: optional('SUPABASE_URL') || optional('NUXT_PUBLIC_SUPABASE_URL'),
  supabaseAnonKey: optional('SUPABASE_ANON_KEY') || optional('NUXT_PUBLIC_SUPABASE_ANON_KEY'),
  supabaseServiceKey: optional('SUPABASE_SERVICE_ROLE_KEY') || optional('NUXT_PRIVATE_SUPABASE_KEY'),
  webOrigin: optional('WEB_ORIGIN') || optional('NUXT_PUBLIC_SITE_URL') || 'http://localhost:3000',
  adminAllowedEmails: optional('ADMIN_ALLOWED_EMAILS') || optional('NUXT_ADMIN_ALLOWED_EMAILS'),
  adminRequireRole:
    process.env.ADMIN_REQUIRE_ROLE === 'true' || process.env.NUXT_ADMIN_REQUIRE_ROLE === 'true',
}

export function parseAllowedEmails(): Set<string> | null {
  const raw = env.adminAllowedEmails
  if (!raw) return null
  return new Set(
    raw
      .split(',')
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean),
  )
}
