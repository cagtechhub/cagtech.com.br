import type { ContactRecord } from '#shared/types/admin'

type ContactRow = {
  id: string
  full_name: string
  email: string
  reason: string | null
  budget: number | string | null
  message: string | null
  created_at: string
}

function parseReason(raw: string | null): string[] {
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item).trim()).filter(Boolean)
    }
  } catch {
    // texto livre antigo
  }
  return raw.trim() ? [raw.trim()] : []
}

export default defineEventHandler(async (event): Promise<ContactRecord[]> => {
  await requireAdmin(event)
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from('contacts')
    .select('id, full_name, email, reason, budget, message, created_at')
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Não foi possível carregar os contatos',
      message: error.message,
    })
  }

  return ((data || []) as ContactRow[]).map((row) => ({
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    reason: parseReason(row.reason),
    budget: row.budget === null || row.budget === undefined ? null : Number(row.budget),
    message: row.message || '',
    createdAt: row.created_at,
  }))
})
