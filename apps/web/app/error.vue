<script setup lang="ts">
import type { NuxtError } from '#app'

useSiteSeoHead()

const props = defineProps<{
  error: NuxtError
}>()

const title = computed(() => {
  const s = props.error.statusCode
  if (s === 404) return 'Página não encontrada'
  return 'Algo deu errado'
})

const description = computed(() => {
  const s = props.error.statusCode
  if (s === 404) return 'O endereço que você acessou não existe ou foi movido.'
  return props.error.message || 'Tente novamente em instantes ou volte à página inicial.'
})

const handleClear = () => clearError({ redirect: '/' })
</script>

<template>
  <NuxtLayout name="default">
    <div class="shell flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <p class="font-mono text-sm uppercase tracking-[0.2em] text-copy-muted">
        {{ error.statusCode || 'Erro' }}
      </p>
      <h1 class="mt-4 font-display text-3xl font-semibold text-copy-strong sm:text-4xl">
        {{ title }}
      </h1>
      <p class="mt-4 max-w-md text-sm leading-relaxed text-copy-muted">
        {{ description }}
      </p>
      <div class="mt-10 flex flex-wrap justify-center gap-3">
        <button type="button" class="brand-button" @click="handleClear">Ir para o início</button>
        <button type="button" class="ghost-button" @click="() => clearError()">Tentar de novo</button>
      </div>
    </div>
  </NuxtLayout>
</template>
