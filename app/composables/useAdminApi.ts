import { updateSiteSettingsSchema, type SiteSettings, type UpdateSiteSettingsInput } from '#shared/schemas/settings'
import type { AdminDashboardStats, ContactRecord } from '#shared/types/admin'

export function useAdminApi() {
  const token = useCookie<string | null>('admin_token', {
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  })

  const ensureAccessToken = async (): Promise<string | null> => {
    if (import.meta.client) {
      try {
        const supabase = useSupabaseClient()
        const { data } = await supabase.auth.getSession()
        token.value = data.session?.access_token ?? null
      } catch {
        // keep cookie value
      }
    }
    return token.value
  }

  const request = async <T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> => {
    const accessToken = await ensureAccessToken()
    return await $fetch<T>(path, {
      method: (init.method as 'GET' | 'PUT' | 'POST') || 'GET',
      body: init.body,
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    })
  }

  const login = async (email: string, password: string) => {
    const supabase = useSupabaseClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    if (error || !data.session) {
      throw createError({
        statusCode: 401,
        statusMessage: error?.message || 'E-mail ou senha inválidos',
      })
    }
    token.value = data.session.access_token

    try {
      await request<AdminDashboardStats>('/api/admin/dashboard')
    } catch (cause: unknown) {
      token.value = null
      try {
        await supabase.auth.signOut()
      } catch {
        // ignore
      }
      const statusCode =
        cause && typeof cause === 'object' && 'statusCode' in cause
          ? Number((cause as { statusCode?: number }).statusCode)
          : 403
      throw createError({
        statusCode: statusCode || 403,
        statusMessage:
          statusCode === 403
            ? 'Este e-mail não tem permissão de admin. Inclua-o em ADMIN_ALLOWED_EMAILS.'
            : 'Falha ao validar acesso admin',
      })
    }
  }

  const logout = async () => {
    try {
      if (import.meta.client) {
        await useSupabaseClient().auth.signOut()
      }
    } finally {
      token.value = null
    }
  }

  const isAuthenticated = computed(() => Boolean(token.value))

  const getDashboard = () => request<AdminDashboardStats>('/api/admin/dashboard')
  const listContacts = () => request<ContactRecord[]>('/api/admin/contacts')
  const getSettings = () => request<SiteSettings>('/api/admin/settings')
  const updateSettings = (input: UpdateSiteSettingsInput) =>
    request<SiteSettings>('/api/admin/settings', {
      method: 'PUT',
      body: updateSiteSettingsSchema.parse(input),
    })

  return {
    token,
    isAuthenticated,
    login,
    logout,
    getDashboard,
    listContacts,
    getSettings,
    updateSettings,
  }
}
