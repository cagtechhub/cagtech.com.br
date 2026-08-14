<script setup lang="ts">
import { storeToRefs } from 'pinia'

const consent = useConsentStore()
const { status, hydrated } = storeToRefs(consent)

const show = computed(() => hydrated.value && status.value === 'pending')

function onAcceptAll() {
  consent.acceptAll()
}

function onEssentialOnly() {
  consent.acceptEssentialOnly()
}
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="consent-fade">
        <div
          v-if="show"
          class="fixed inset-0 z-[120] flex items-end justify-center p-4 sm:items-center sm:p-6"
          role="presentation"
        >
          <div
            class="absolute inset-0 bg-canvas/80 backdrop-blur-sm"
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="consent-title"
            aria-describedby="consent-desc"
            class="relative z-10 w-full max-w-lg rounded-box border border-stroke bg-panel/95 p-6 shadow-[0_24px_64px_-20px_rgba(0,0,0,0.75)] backdrop-blur-md sm:p-8"
            @click.stop
          >
            <h2 id="consent-title" class="font-display text-xl font-semibold text-copy-strong sm:text-2xl">
              Cookies e privacidade
            </h2>
            <p id="consent-desc" class="mt-3 text-sm leading-relaxed text-copy-muted">
              Usamos cookies <strong class="font-medium text-copy-base">essenciais</strong> para o site funcionar.
              Com a sua autorização, também podemos carregar
              <strong class="font-medium text-copy-base">Google Analytics 4</strong> e
              <strong class="font-medium text-copy-base">Meta Pixel</strong> (quando configurados), para entender
              audiência e campanhas. Você pode recusar os opcionais e continuar navegando.
            </p>
            <p class="mt-2 text-xs leading-relaxed text-copy-muted">
              A escolha fica guardada neste aparelho. Para revogar, apague os dados do site nas configurações do
              navegador ou limpe o armazenamento local deste domínio.
            </p>
            <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button type="button" class="ghost-button w-full sm:w-auto" @click="onEssentialOnly">
                Apenas essenciais
              </button>
              <button type="button" class="brand-button w-full sm:w-auto" @click="onAcceptAll">
                Aceitar todos
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<style scoped>
.consent-fade-enter-active,
.consent-fade-leave-active {
  transition: opacity 0.22s ease;
}

.consent-fade-enter-from,
.consent-fade-leave-to {
  opacity: 0;
}
</style>
