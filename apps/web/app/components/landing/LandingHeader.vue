<script setup lang="ts">
import { LANDING_ANCHOR, landingHref } from '~/constants/landingScreen'

const hrefHome = landingHref(LANDING_ANCHOR.home)
const hrefContact = landingHref(LANDING_ANCHOR.contact)

const navLinks = [
  { label: 'Serviços', href: '#servicos' },
  { label: 'Por que a CAG Tech', href: '#por-que-a-cag-tech' },
  { label: 'Pacotes', href: '#pacotes' },
  { label: 'Projetos', href: '#projetos' },
  { label: 'Depoimentos', href: '#depoimentos' },
  { label: 'FAQ', href: '#faq' },
]

const MOBILE_MENU_ID = 'landing-mobile-menu'
const isMenuOpen = ref(false)

function closeMenu(): void {
  isMenuOpen.value = false
}

function toggleMenu(): void {
  isMenuOpen.value = !isMenuOpen.value
}

function onNavClick(): void {
  closeMenu()
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && isMenuOpen.value) {
    closeMenu()
  }
}

watch(isMenuOpen, (open) => {
  if (!import.meta.client) return
  document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 bg-surface/70 backdrop-blur-xl border-b border-stroke/60"
  >
    <div
      class="h-[72px] max-w-[1360px] mx-auto px-6 lg:px-12 flex items-center justify-between gap-6"
    >
      <!-- Logo + Version tag -->
      <div class="flex items-center gap-4 shrink-0">
        <a :href="hrefHome" class="flex items-center" @click="onNavClick">
          <BrandLogo height-class="h-8" />
        </a>
        <span
          class="hidden sm:inline-block font-eyebrow text-eyebrow uppercase text-text-muted px-2 py-0.5 rounded bg-surface-raised border border-stroke"
        >
          v2.5_core
        </span>
      </div>

      <!-- Desktop Nav -->
      <nav
        class="hidden xl:flex items-center gap-1 p-1 rounded-xl bg-surface-container-lowest/60 border border-stroke/50"
        aria-label="Navegação principal"
      >
        <a
          v-for="item in navLinks"
          :key="item.href"
          :href="item.href"
          class="font-body-sm text-body-sm text-on-surface-variant hover:text-text-strong px-3.5 py-1.5 rounded-lg transition-colors"
        >
          {{ item.label }}
        </a>
      </nav>

      <!-- Action buttons -->
      <div class="flex items-center gap-3 shrink-0">
        <a
          class="hidden md:inline-flex items-center justify-center h-10 px-4 rounded-[10px] bg-white/[0.03] border border-stroke text-text-strong hover:border-stroke-strong hover:bg-white/[0.06] font-body-sm text-body-sm font-semibold transition-all"
          href="https://wa.me/"
          rel="noopener noreferrer"
          target="_blank"
        >
          WhatsApp
        </a>
        <a
          class="hidden sm:inline-flex items-center justify-center h-10 px-5 rounded-[10px] bg-gradient-to-r from-brand-violet via-brand-indigo to-brand-cyan text-light-canvas font-body-sm text-body-sm font-semibold shadow-[0_0_24px_rgba(29,182,253,0.35)] hover:shadow-[0_0_32px_rgba(29,182,253,0.55)] hover:-translate-y-0.5 transition-all"
          :href="hrefContact"
        >
          Solicitar orçamento
        </a>

        <!-- Mobile hamburger -->
        <button
          type="button"
          class="w-11 h-11 flex items-center justify-center rounded-lg bg-surface-raised/60 text-text-strong active:scale-95 transition-all xl:hidden"
          :aria-expanded="isMenuOpen"
          :aria-controls="MOBILE_MENU_ID"
          :aria-label="isMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'"
          @click="toggleMenu"
        >
          <span class="material-symbols-outlined text-[22px]">
            {{ isMenuOpen ? 'close' : 'menu' }}
          </span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <ClientOnly>
      <Teleport to="body">
        <Transition name="mobile-menu">
          <div v-if="isMenuOpen" class="fixed inset-0 z-50 xl:hidden" role="presentation">
            <button
              type="button"
              class="absolute inset-0 bg-canvas/80 backdrop-blur-md"
              aria-label="Fechar menu"
              tabindex="-1"
              @click="closeMenu"
            />

            <nav
              :id="MOBILE_MENU_ID"
              class="absolute inset-x-0 top-[72px] border-b border-stroke bg-surface/95 px-6 pb-8 pt-4 shadow-[0_24px_48px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
              aria-label="Navegação mobile"
            >
              <ul class="flex flex-col gap-2">
                <li v-for="item in navLinks" :key="item.href">
                  <a
                    :href="item.href"
                    class="flex rounded-xl px-4 py-3 font-headline-md text-[20px] font-semibold text-text-strong hover:bg-surface-raised transition-colors"
                    @click="onNavClick"
                  >
                    {{ item.label }}
                  </a>
                </li>
              </ul>

              <div class="mt-6 flex flex-col gap-3">
                <a
                  :href="hrefContact"
                  class="flex items-center justify-center h-12 w-full rounded-[10px] bg-gradient-to-r from-brand-violet via-brand-indigo to-brand-cyan text-light-canvas font-body-sm font-semibold shadow-[0_0_24px_rgba(29,182,253,0.35)]"
                  @click="onNavClick"
                >
                  Solicitar orçamento
                </a>
                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center justify-center h-12 w-full rounded-[10px] bg-white/[0.04] border border-stroke text-text-strong font-body-sm font-semibold"
                  @click="onNavClick"
                >
                  WhatsApp
                </a>
              </div>
            </nav>
          </div>
        </Transition>
      </Teleport>
    </ClientOnly>
  </header>
</template>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.2s ease;
}

.mobile-menu-enter-active nav,
.mobile-menu-leave-active nav {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}

.mobile-menu-enter-from nav,
.mobile-menu-leave-to nav {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
