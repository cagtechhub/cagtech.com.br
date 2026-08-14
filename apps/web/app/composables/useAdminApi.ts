import {
  updateSiteSettingsSchema,
  type AdminDashboardStats,
  type FaqRecord,
  type LandingContent,
  type LeadRecord,
  type PackageRecord,
  type ProjectRecord,
  type SiteSettings,
  type TestimonialRecord,
  type UpdateLeadInput,
  type UpdateSiteSettingsInput,
} from '@cagtech/shared'

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
    return await $fetch<T>(`${resolveApiBase()}${path}`, {
      method: (init.method as 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE') || 'GET',
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
      await request<AdminDashboardStats>('/admin/dashboard')
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

  const uploadLogo = async (projectId: string, file: File) => {
    const accessToken = await ensureAccessToken()
    const form = new FormData()
    form.append('file', file)
    return await $fetch<ProjectRecord>(`${resolveApiBase()}/admin/projects/${projectId}/logo`, {
      method: 'POST',
      body: form,
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    })
  }

  return {
    token,
    isAuthenticated,
    login,
    logout,
    getDashboard: () => request<AdminDashboardStats>('/admin/dashboard'),
    getSettings: () => request<SiteSettings>('/admin/settings'),
    updateSettings: (input: UpdateSiteSettingsInput) =>
      request<SiteSettings>('/admin/settings', {
        method: 'PUT',
        body: updateSiteSettingsSchema.parse(input),
      }),
    listLeads: () => request<LeadRecord[]>('/admin/leads'),
    updateLead: (id: string, input: UpdateLeadInput) =>
      request<LeadRecord>(`/admin/leads/${id}`, { method: 'PATCH', body: input }),
    listPackages: () => request<PackageRecord[]>('/admin/packages'),
    createPackage: (body: unknown) => request<PackageRecord>('/admin/packages', { method: 'POST', body }),
    updatePackage: (id: string, body: unknown) =>
      request<PackageRecord>(`/admin/packages/${id}`, { method: 'PUT', body }),
    deletePackage: (id: string) => request<{ ok: boolean }>(`/admin/packages/${id}`, { method: 'DELETE' }),
    listProjects: () => request<ProjectRecord[]>('/admin/projects'),
    createProject: (body: unknown) => request<ProjectRecord>('/admin/projects', { method: 'POST', body }),
    updateProject: (id: string, body: unknown) =>
      request<ProjectRecord>(`/admin/projects/${id}`, { method: 'PUT', body }),
    deleteProject: (id: string) => request<{ ok: boolean }>(`/admin/projects/${id}`, { method: 'DELETE' }),
    uploadLogo,
    listTestimonials: () => request<TestimonialRecord[]>('/admin/testimonials'),
    createTestimonial: (body: unknown) =>
      request<TestimonialRecord>('/admin/testimonials', { method: 'POST', body }),
    updateTestimonial: (id: string, body: unknown) =>
      request<TestimonialRecord>(`/admin/testimonials/${id}`, { method: 'PUT', body }),
    deleteTestimonial: (id: string) =>
      request<{ ok: boolean }>(`/admin/testimonials/${id}`, { method: 'DELETE' }),
    listFaqs: () => request<FaqRecord[]>('/admin/faqs'),
    createFaq: (body: unknown) => request<FaqRecord>('/admin/faqs', { method: 'POST', body }),
    updateFaq: (id: string, body: unknown) =>
      request<FaqRecord>(`/admin/faqs/${id}`, { method: 'PUT', body }),
    deleteFaq: (id: string) => request<{ ok: boolean }>(`/admin/faqs/${id}`, { method: 'DELETE' }),
    getLanding: () => request<LandingContent>('/public/landing'),
  }
}
