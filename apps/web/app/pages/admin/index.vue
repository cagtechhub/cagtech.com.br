<script setup lang="ts">
import type { AdminDashboardStats } from '@cagtech/shared'

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
  packagesCount: 0,
  projectsCount: 0,
  siteName: 'CAG Tech',
  noIndex: false,
})

const cards = computed(() => [
  {
    label: 'Leads Recentes (7d)',
    value: stats.value.contactsNew,
    icon: 'mark_email_unread',
    color: 'text-brand-cyan',
    desc: 'Contatos recebidos nesta semana',
  },
  {
    label: 'Pipeline Total de Leads',
    value: stats.value.contactsTotal,
    icon: 'groups',
    color: 'text-brand-violet',
    desc: 'Oportunidades registradas no funil',
  },
  {
    label: 'Pacotes Comerciais',
    value: stats.value.packagesCount,
    icon: 'inventory_2',
    color: 'text-success',
    desc: 'Planos ativos exibidos na landing',
  },
  {
    label: 'Projetos no Portfólio',
    value: stats.value.projectsCount,
    icon: 'folder_open',
    color: 'text-primary',
    desc: 'Cases publicados com galeria',
  },
  {
    label: 'Status de Indexação',
    value: stats.value.noIndex ? 'Noindex (Oculto)' : 'Index (Ativo)',
    icon: 'travel_explore',
    color: stats.value.noIndex ? 'text-warning' : 'text-success',
    desc: 'Robôs de busca Google / Bing',
  },
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
        'Usuário sem permissão de admin. Inclua o e-mail em ADMIN_ALLOWED_EMAILS no .env.'
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
  <div class="space-y-8 max-w-6xl">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <span class="font-mono text-xs uppercase tracking-[0.14em] text-brand-cyan">
          // TELEMETRIA &amp; MÉTRICAS
        </span>
        <h2 class="mt-1 font-display text-3xl font-semibold text-text-strong">
          Visão Geral da Operação
        </h2>
        <p class="mt-1 text-sm text-text-muted">
          Métricas de conversão de leads, integridade dos serviços e catálogo do site.
        </p>
      </div>

      <div class="flex flex-wrap gap-2.5">
        <NuxtLink to="/admin/leads" class="brand-button text-xs h-10 px-4">
          <span class="material-symbols-outlined text-[16px]">leaderboard</span>
          <span>Kanban de leads</span>
        </NuxtLink>
        <NuxtLink to="/admin/configuracoes" class="ghost-button text-xs h-10 px-4">
          <span class="material-symbols-outlined text-[16px]">settings</span>
          <span>Configurações</span>
        </NuxtLink>
      </div>
    </div>

    <p v-if="loading" class="text-sm text-text-muted">Carregando telemetria do sistema…</p>
    <div v-else-if="error" class="surface p-6 border-danger/30 space-y-3">
      <p class="text-sm text-danger">{{ error }}</p>
      <button type="button" class="ghost-button text-xs" @click="loadDashboard">
        Tentar novamente
      </button>
    </div>

    <!-- Cards Grid -->
    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="card in cards"
        :key="card.label"
        class="surface p-6 hover:border-stroke-strong transition-all relative overflow-hidden group flex flex-col justify-between"
      >
        <div class="flex items-start justify-between gap-3 mb-4">
          <span class="font-mono text-xs uppercase tracking-wider text-text-muted">
            {{ card.label }}
          </span>
          <div
            class="h-9 w-9 rounded-lg border border-stroke bg-surface-raised flex items-center justify-center text-text-muted group-hover:text-brand-cyan transition-colors"
          >
            <span class="material-symbols-outlined text-[20px]">{{ card.icon }}</span>
          </div>
        </div>

        <div>
          <p :class="['font-display text-3xl sm:text-4xl font-bold tracking-tight', card.color]">
            {{ card.value }}
          </p>
          <p class="mt-2 text-xs text-text-muted">
            {{ card.desc }}
          </p>
        </div>
      </div>
    </div>

    <!-- Quick Navigation Panels -->
    <div v-if="!loading && !error" class="grid gap-4 md:grid-cols-2 pt-2">
      <div class="surface p-6 space-y-3">
        <h3 class="font-display text-lg font-semibold text-text-strong flex items-center gap-2">
          <span class="material-symbols-outlined text-brand-cyan">contacts</span>
          <span>Gestão de Leads &amp; Propostas</span>
        </h3>
        <p class="text-sm text-text-muted">
          Acompanhe os orçamentos solicitados via landing page em um quadro kanban arrastável.
        </p>
        <div class="pt-2">
          <NuxtLink
            to="/admin/leads"
            class="inline-flex items-center gap-1.5 text-xs text-brand-cyan hover:underline font-semibold"
          >
            <span>Acessar pipeline completo</span>
            <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
          </NuxtLink>
        </div>
      </div>

      <div class="surface p-6 space-y-3">
        <h3 class="font-display text-lg font-semibold text-text-strong flex items-center gap-2">
          <span class="material-symbols-outlined text-brand-violet">photo_library</span>
          <span>Galeria de Cases &amp; Projetos</span>
        </h3>
        <p class="text-sm text-text-muted">
          Atualize os cases em produção e faça upload de capturas para os carrosséis do site.
        </p>
        <div class="pt-2">
          <NuxtLink
            to="/admin/projetos"
            class="inline-flex items-center gap-1.5 text-xs text-brand-violet hover:underline font-semibold"
          >
            <span>Gerenciar portfólio</span>
            <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
