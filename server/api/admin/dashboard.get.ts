import type { AdminDashboardStats } from '#shared/types/admin'

export default defineEventHandler(async (event): Promise<AdminDashboardStats> => {
  await requireAdmin(event)

  const settings = await resolveSiteSettings(event)
  const supabase = createSupabaseServerClient()
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [totalRes, newRes] = await Promise.all([
    supabase.from('contacts').select('id', { count: 'exact', head: true }),
    supabase.from('contacts').select('id', { count: 'exact', head: true }).gte('created_at', weekAgo),
  ])

  return {
    contactsTotal: totalRes.count ?? 0,
    contactsNew: newRes.count ?? 0,
    siteName: settings.siteName,
    noIndex: settings.noIndex,
  }
})
