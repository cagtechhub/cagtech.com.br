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
  <div class="flex min-h-screen items-center justify-center bg-canvas px-5">
    <form class="surface w-full max-w-md p-8 shadow-neon" @submit.prevent="onSubmit">
      <p class="text-xs uppercase tracking-[0.22em] text-brand-cyan">Acesso restrito</p>
      <h1 class="mt-2 font-display text-3xl font-semibold text-copy-strong">{{ siteName }} Admin</h1>
      <p class="mt-2 text-sm text-copy-muted">Entre com a conta Supabase Auth do painel.</p>
      <label class="mt-6 block text-sm text-copy-base">
        E-mail
        <input
          v-model="email"
          type="email"
          required
          class="field-control mt-2"
          autocomplete="username"
        />
      </label>
      <label class="mt-4 block text-sm text-copy-base">
        Senha
        <input
          v-model="password"
          type="password"
          required
          class="field-control mt-2"
          autocomplete="current-password"
        />
      </label>
      <p v-if="error" class="mt-3 text-sm text-red-300">{{ error }}</p>
      <button type="submit" class="brand-button mt-6 w-full disabled:opacity-60" :disabled="loading">
        {{ loading ? 'Entrando…' : 'Entrar' }}
      </button>
    </form>
  </div>
</template>
