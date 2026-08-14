<script setup lang="ts">
const route = useRoute()
const { logout } = useAdminApi()
const config = useRuntimeConfig()
const siteName = computed(() => String(config.public.siteName || 'CAG Tech').trim() || 'CAG Tech')

const links = [
  { to: '/admin', label: 'Visão geral', exact: true },
  { to: '/admin/contatos', label: 'Contatos' },
  { to: '/admin/configuracoes', label: 'Configurações' },
]

const isActive = (to: string, exact = false) => {
  if (exact) return route.path === to
  return route.path === to || route.path.startsWith(`${to}/`)
}

const onLogout = async () => {
  await logout()
  await navigateTo('/admin/login')
}
</script>

<template>
  <div class="min-h-screen bg-canvas font-sans text-copy-base antialiased">
    <NuxtRouteAnnouncer />
    <NotifyStack />
    <header class="border-b border-stroke bg-panel">
      <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-brand-cyan">Painel</p>
          <h1 class="font-display text-xl font-semibold text-copy-strong">{{ siteName }} Admin</h1>
        </div>
        <nav class="flex flex-wrap items-center gap-2">
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="rounded-control px-3 py-1.5 text-sm transition"
            :class="
              isActive(link.to, link.exact)
                ? 'bg-white/10 text-brand-cyan'
                : 'text-copy-muted hover:bg-white/5 hover:text-copy-strong'
            "
          >
            {{ link.label }}
          </NuxtLink>
          <NuxtLink
            to="/"
            class="rounded-control px-3 py-1.5 text-sm text-copy-muted hover:bg-white/5 hover:text-copy-strong"
          >
            Ver site
          </NuxtLink>
          <button
            type="button"
            class="rounded-control border border-stroke px-3 py-1.5 text-sm text-copy-base hover:bg-white/5"
            @click="onLogout"
          >
            Sair
          </button>
        </nav>
      </div>
    </header>
    <main class="mx-auto max-w-7xl px-5 py-8">
      <slot />
    </main>
  </div>
</template>
