<script setup lang="ts">
import type { NotifyVariant } from '~/types/notify'

const props = withDefaults(
  defineProps<{
    variant: NotifyVariant
    title: string
    message?: string
    dismissible?: boolean
  }>(),
  { dismissible: true, message: undefined },
)

const emit = defineEmits<{
  dismiss: []
}>()

const role = computed(() => (props.variant === 'error' ? 'alert' : 'status'))
const ariaLive = computed<'assertive' | 'polite'>(() =>
  props.variant === 'error' ? 'assertive' : 'polite',
)

const shellClass = computed(() => {
  const base =
    'relative flex gap-3 rounded-box border px-4 py-3 shadow-[0_16px_48px_-24px_rgba(0,0,0,0.65)] backdrop-blur-md'
  const byVariant: Record<NotifyVariant, string> = {
    success:
      'border-emerald-400/35 bg-emerald-950/55 text-emerald-50 [&_.notify-msg]:text-emerald-100/90',
    error: 'border-rose-400/40 bg-rose-950/50 text-rose-50 [&_.notify-msg]:text-rose-100/90',
    warning:
      'border-amber-400/40 bg-amber-950/45 text-amber-50 [&_.notify-msg]:text-amber-100/90',
    info: 'border-brand-cyan/40 bg-panel/95 text-copy-strong [&_.notify-msg]:text-copy-muted',
  }
  return `${base} ${byVariant[props.variant]}`
})

const iconClass = 'mt-0.5 h-5 w-5 shrink-0'
</script>

<template>
  <div :class="shellClass" :role="role" :aria-live="ariaLive">
    <span class="sr-only">{{ variant === 'error' ? 'Erro.' : variant === 'success' ? 'Sucesso.' : variant === 'warning' ? 'Alerta.' : 'Informação.' }}</span>

    <!-- success -->
    <svg v-if="variant === 'success'" :class="iconClass" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 12.5 11 15l4-5"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>

    <!-- error -->
    <svg v-else-if="variant === 'error'" :class="iconClass" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 8v5"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
      />
      <path d="M12 17h.01" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
      <path
        d="M10.3 3.2 2.8 17.1c-.5.9-.5 2 0 2.9s1.4 1.5 2.4 1.5h13.6c1 0 1.9-.6 2.4-1.5s.5-2 0-2.9L13.7 3.2c-.5-.9-1.4-1.5-2.4-1.5s-1.9.6-2.4 1.5Z"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linejoin="round"
      />
    </svg>

    <!-- warning -->
    <svg v-else-if="variant === 'warning'" :class="iconClass" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 9v4"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
      />
      <path d="M12 17h.01" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
      <path
        d="M10.3 3.2 2.8 17.1c-.5.9-.5 2 0 2.9s1.4 1.5 2.4 1.5h13.6c1 0 1.9-.6 2.4-1.5s.5-2 0-2.9L13.7 3.2c-.5-.9-1.4-1.5-2.4-1.5s-1.9.6-2.4 1.5Z"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linejoin="round"
      />
    </svg>

    <!-- info -->
    <svg v-else :class="iconClass" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 16v-5"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
      />
      <path d="M12 8h.01" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
      <path
        d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>

    <div class="min-w-0 flex-1 pt-0.5 text-left">
      <p class="text-sm font-semibold leading-snug">{{ title }}</p>
      <p v-if="message" class="notify-msg mt-1 text-xs leading-relaxed">{{ message }}</p>
    </div>

    <button
      v-if="dismissible"
      type="button"
      class="absolute right-2 top-2 rounded-control p-1 text-current/70 transition hover:bg-white/10 hover:text-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
      aria-label="Fechar notificação"
      @click="emit('dismiss')"
    >
      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
      </svg>
    </button>
  </div>
</template>
