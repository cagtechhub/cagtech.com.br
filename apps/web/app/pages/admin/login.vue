<script setup lang="ts">
definePageMeta({
  layout: false,
})

const config = useRuntimeConfig()
const siteName = computed(() => String(config.public.siteName || 'CAG Tech').trim() || 'CAG Tech')
const { login, isAuthenticated } = useAdminApi()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

if (import.meta.client && isAuthenticated.value) {
  await navigateTo('/admin')
}

const onSubmit = async () => {
  error.value = ''
  loading.value = true
  try {
    await login(email.value, password.value)
    await navigateTo('/admin')
  } catch (e: unknown) {
    const message =
      e && typeof e === 'object' && 'statusMessage' in e
        ? String((e as { statusMessage?: string }).statusMessage)
        : ''
    error.value = message || 'E-mail ou senha inválidos.'
    await useAdminApi().logout()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    class="relative flex min-h-screen items-center justify-center bg-canvas px-5 overflow-hidden"
  >
    <!-- Ambient Aurora Glows -->
    <div
      class="absolute -top-20 -left-20 w-80 h-80 bg-brand-violet/20 rounded-full blur-[120px] pointer-events-none"
    />
    <div
      class="absolute -bottom-20 -right-20 w-80 h-80 bg-brand-cyan/20 rounded-full blur-[120px] pointer-events-none"
    />

    <div class="relative z-10 w-full max-w-md">
      <!-- Brand Logo -->
      <div class="flex justify-center mb-8">
        <NuxtLink to="/">
          <BrandLogo height-class="h-9" />
        </NuxtLink>
      </div>

      <form
        class="surface w-full p-8 sm:p-10 shadow-glow-primary border-stroke relative"
        @submit.prevent="onSubmit"
      >
        <div class="flex items-center gap-2 mb-2">
          <span class="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
          <p class="font-mono text-xs uppercase tracking-[0.2em] text-brand-cyan">
            Acesso Restrito
          </p>
        </div>

        <h1 class="font-display text-2xl sm:text-3xl font-semibold text-text-strong">
          {{ siteName }} Console
        </h1>
        <p class="mt-2 text-sm text-text-muted">
          Entre com as credenciais administrativas do painel.
        </p>

        <div class="mt-6 space-y-4">
          <label class="block text-sm text-text-muted">
            E-mail
            <input
              v-model="email"
              type="email"
              required
              class="field-control mt-1.5"
              autocomplete="username"
              placeholder="admin@cagtech.com.br"
            />
          </label>
          <label class="block text-sm text-text-muted">
            Senha
            <input
              v-model="password"
              type="password"
              required
              class="field-control mt-1.5"
              autocomplete="current-password"
              placeholder="••••••••••••"
            />
          </label>
        </div>

        <p v-if="error" class="mt-4 text-xs font-mono text-danger">{{ error }}</p>

        <button
          type="submit"
          class="brand-button mt-6 w-full cursor-pointer disabled:opacity-60"
          :disabled="loading"
        >
          <span class="material-symbols-outlined text-[18px]">lock_open</span>
          <span>{{ loading ? 'Autenticando…' : 'Acessar console' }}</span>
        </button>

        <div class="mt-6 pt-4 border-t border-stroke text-center">
          <NuxtLink to="/" class="text-xs text-text-muted hover:text-brand-cyan transition-colors">
            ← Voltar para o site institucional
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>
