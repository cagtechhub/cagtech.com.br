<script setup lang="ts">
const route = useRoute()
const { logout } = useAdminApi()
const config = useRuntimeConfig()
const siteName = computed(() => String(config.public.siteName || 'CAG Tech').trim() || 'CAG Tech')

const mobileNavOpen = ref(false)
const adminEmail = ref('')

const links = [
  { to: '/admin', label: 'Visão geral', icon: 'dashboard', exact: true },
  { to: '/admin/leads', label: 'Leads & Orçamentos', icon: 'leaderboard' },
  { to: '/admin/pacotes', label: 'Pacotes', icon: 'inventory_2' },
  { to: '/admin/projetos', label: 'Projetos & Cases', icon: 'folder_open' },
  { to: '/admin/depoimentos', label: 'Depoimentos', icon: 'format_quote' },
  { to: '/admin/faq', label: 'FAQ', icon: 'quiz' },
  { to: '/admin/configuracoes', label: 'Configurações', icon: 'settings' },
]

const isActive = (to: string, exact = false) => {
  if (exact) return route.path === to
  return route.path === to || route.path.startsWith(`${to}/`)
}

const activeItem = computed(() => links.find((link) => isActive(link.to, link.exact)) ?? links[0]!)

const adminInitials = computed(() => {
  const local = adminEmail.value.split('@')[0]?.trim() || ''
  if (!local) return 'AD'
  const parts = local.split(/[._-]+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0]?.[0] ?? ''}${parts[1]?.[0] ?? ''}`.toUpperCase()
  }
  return local.slice(0, 2).toUpperCase()
})

const onLogout = async () => {
  mobileNavOpen.value = false
  await logout()
  await navigateTo('/admin/login')
}

watch(
  () => route.path,
  () => {
    mobileNavOpen.value = false
  }
)

onMounted(async () => {
  try {
    const { data } = await useSupabaseClient().auth.getUser()
    adminEmail.value = data.user?.email || ''
  } catch {
    adminEmail.value = ''
  }
})

useHead({
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})
</script>

<template>
  <div class="flex min-h-screen bg-canvas font-sans text-copy-base antialiased">
    <NuxtRouteAnnouncer />
    <NotifyStack />

    <!-- Mobile overlay backdrop -->
    <button
      v-if="mobileNavOpen"
      class="fixed inset-0 z-40 bg-canvas/80 backdrop-blur-sm lg:hidden cursor-pointer"
      type="button"
      aria-label="Fechar menu"
      @click="mobileNavOpen = false"
    />

    <!-- Sidebar 16rem (denunciapopular standard) -->
    <aside
      class="fixed inset-y-0 left-0 z-50 flex h-screen w-[16rem] shrink-0 flex-col bg-surface border-r border-stroke text-text-strong transition-transform duration-200 lg:sticky lg:top-0 lg:z-0 lg:translate-x-0"
      :class="mobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
      aria-label="Menu administrativo"
    >
      <!-- Sidebar Header -->
      <div
        class="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-stroke px-4 lg:h-20 lg:px-5"
      >
        <NuxtLink to="/admin" class="flex items-center gap-2.5 min-w-0">
          <BrandLogo height-class="h-7" />
        </NuxtLink>
        <button
          class="grid h-9 w-9 place-items-center rounded-lg text-text-muted hover:bg-surface-raised hover:text-text-strong lg:hidden cursor-pointer"
          type="button"
          aria-label="Fechar menu"
          @click="mobileNavOpen = false"
        >
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <!-- App identification card -->
      <div class="shrink-0 border-b border-stroke/70 px-3 py-4 lg:px-4">
        <p
          class="px-1 font-mono text-[10px] font-semibold tracking-[0.16em] text-brand-cyan uppercase"
        >
          // PAINEL DE CONTROLE
        </p>
        <div
          class="mt-2 flex w-full items-center gap-3 rounded-xl bg-surface-raised border border-stroke px-3 py-2.5 text-left text-sm"
        >
          <span
            class="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-r from-brand-violet to-brand-cyan text-xs font-bold text-white shadow-sm"
          >
            CAG
          </span>
          <span class="min-w-0">
            <span class="block truncate font-semibold text-text-strong">{{ siteName }}</span>
            <span class="block truncate text-xs text-text-muted">Console Admin</span>
          </span>
        </div>
      </div>

      <!-- Navigation links -->
      <nav class="min-h-0 flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p
          class="mb-2 px-3 font-mono text-[10px] font-semibold tracking-[0.14em] text-text-muted uppercase"
        >
          Navegação
        </p>
        <ul class="space-y-1">
          <li v-for="link in links" :key="link.to">
            <NuxtLink
              :to="link.to"
              class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all"
              :class="
                isActive(link.to, link.exact)
                  ? 'bg-brand-cyan/15 border border-brand-cyan/35 text-brand-cyan font-semibold shadow-sm'
                  : 'text-text-muted hover:bg-surface-raised hover:text-text-strong border border-transparent'
              "
              :aria-current="isActive(link.to, link.exact) ? 'page' : undefined"
            >
              <span class="material-symbols-outlined text-[18px] shrink-0" aria-hidden="true">
                {{ link.icon }}
              </span>
              <span class="truncate">{{ link.label }}</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- Sidebar Footer actions -->
      <div class="shrink-0 space-y-1 border-t border-stroke p-3">
        <NuxtLink
          to="/"
          class="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-text-muted transition hover:bg-surface-raised hover:text-text-strong"
        >
          <span class="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_back</span>
          <span>Voltar ao site</span>
        </NuxtLink>
        <button
          type="button"
          class="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-danger/80 transition hover:bg-danger/10 hover:text-danger cursor-pointer"
          @click="onLogout"
        >
          <span class="material-symbols-outlined text-[18px]" aria-hidden="true">logout</span>
          <span>Sair do painel</span>
        </button>
      </div>
    </aside>

    <!-- Main Content wrapper -->
    <div class="flex min-h-screen min-w-0 flex-1 flex-col">
      <!-- Sticky Header -->
      <header class="sticky top-0 z-30 border-b border-stroke bg-surface/80 backdrop-blur-xl">
        <div
          class="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:h-[4.5rem] lg:px-8"
        >
          <div class="flex min-w-0 items-center gap-3">
            <button
              class="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-stroke bg-surface-raised text-text-strong lg:hidden cursor-pointer active:scale-95 transition-all"
              type="button"
              :aria-label="mobileNavOpen ? 'Fechar menu' : 'Abrir menu'"
              :aria-expanded="mobileNavOpen"
              @click="mobileNavOpen = !mobileNavOpen"
            >
              <span class="material-symbols-outlined text-[20px]">menu</span>
            </button>
            <div class="min-w-0">
              <p
                class="truncate font-mono text-[10px] font-semibold tracking-wider text-brand-cyan uppercase"
              >
                // ADMIN CONSOLE
              </p>
              <h1
                class="truncate font-display text-base font-semibold tracking-tight text-text-strong lg:text-lg"
              >
                {{ activeItem.label }}
              </h1>
            </div>
          </div>

          <!-- User badge -->
          <div class="flex shrink-0 items-center gap-2 sm:gap-4">
            <div class="hidden h-8 w-px bg-stroke sm:block" />
            <div class="flex items-center gap-2.5">
              <span
                class="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-r from-brand-violet to-brand-cyan text-xs font-bold text-white shadow-sm"
              >
                {{ adminInitials }}
              </span>
              <div class="hidden sm:block text-left">
                <p class="max-w-[12rem] truncate text-sm font-semibold text-text-strong">
                  {{ adminEmail || 'Administrador' }}
                </p>
                <p class="text-[11px] font-mono text-brand-cyan">Admin Master</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Slot -->
      <main class="min-w-0 flex-1 overflow-x-hidden p-6 sm:p-8 lg:p-10">
        <slot />
      </main>
    </div>
  </div>
</template>
