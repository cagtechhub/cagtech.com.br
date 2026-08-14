<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

const api = useAdminApi()
const error = ref('')
const loading = ref(true)
const stats = ref<AdminDashboardStats>({
  contactsNew: 0,
  contactsTotal: 0,
  siteName: 'CAG Tech',
  noIndex: false,
})

const cards = computed(() => [
  { label: 'Contatos (7 dias)', value: stats.value.contactsNew },
  { label: 'Contatos totais', value: stats.value.contactsTotal },
  { label: 'Indexação', value: stats.value.noIndex ? 'Noindex' : 'Index' },
])

const loadDashboard = async () => {
  loading.value = true
  error.value = ''
  try {
    stats.value = await api.getDashboard()
  } catch (cause: unknown) {
    const statusMessage =
      cause && typeof cause === 'object' && 'statusMessage' in cause
        ? String((cause as { statusMessage?: string }).statusMessage)
        : ''
    const statusCode =
      cause && typeof cause === 'object' && 'statusCode' in cause
        ? Number((cause as { statusCode?: number }).statusCode)
        : 0
    if (statusCode === 403) {
      error.value =
        'Usuário sem permissão de admin. Inclua o e-mail em ADMIN_ALLOWED_EMAILS no .env ou deixe a variável vazia em desenvolvimento.'
    } else if (statusCode === 401) {
      error.value = 'Sessão expirada. Faça login novamente.'
      await navigateTo('/admin/login')
    } else {
      error.value = statusMessage || 'Não foi possível carregar o dashboard.'
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void loadDashboard()
})
</script>

<template>
  <div class="space-y-8">
    <div>
      <h2 class="font-display text-3xl font-semibold text-copy-strong">Visão geral</h2>
      <p class="mt-1 text-sm text-copy-muted">Resumo dos contatos da landing e do status de SEO.</p>
    </div>

    <p v-if="loading" class="text-sm text-copy-muted">Carregando…</p>
    <div v-else-if="error" class="space-y-3">
      <p class="text-sm text-red-300">{{ error }}</p>
      <button type="button" class="ghost-button" @click="loadDashboard">Tentar novamente</button>
    </div>

    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="card in cards" :key="card.label" class="surface p-5">
        <p class="text-xs uppercase tracking-wider text-copy-muted">{{ card.label }}</p>
        <p class="mt-2 font-display text-3xl font-semibold text-brand-cyan">{{ card.value }}</p>
      </div>
    </div>

    <div v-if="!loading && !error" class="flex flex-wrap gap-3">
      <NuxtLink to="/admin/contatos" class="brand-button">Ver contatos</NuxtLink>
      <NuxtLink to="/admin/configuracoes" class="ghost-button">Editar configurações</NuxtLink>
    </div>
  </div>
</template>
