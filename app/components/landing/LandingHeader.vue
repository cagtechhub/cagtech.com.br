<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { LANDING_ANCHOR, landingHref } from '~/constants/landingScreen'

const landing = useLandingStore()
const { brandName, navItems } = storeToRefs(landing)

const hrefHome = landingHref(LANDING_ANCHOR.home)
const hrefContact = landingHref(LANDING_ANCHOR.contact)

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
  if (!import.meta.client) {
    return
  }
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
    class="sticky top-0 z-40 border-b border-stroke/80 bg-canvas/85 shadow-[0_14px_44px_-32px_rgba(7,11,20,0.9)] backdrop-blur-md transition-[box-shadow,border-color] duration-300"
  >
    <div class="shell">
      <div class="flex h-20 items-center justify-between gap-4">
        <a :href="hrefHome" class="inline-flex items-center gap-3" @click="onNavClick">
          <img src="/img/logo.png" :alt="brandName" class="h-12 w-auto" width="140" height="46" />
        </a>

        <nav class="hidden items-center gap-2 lg:flex" aria-label="Navegação principal">
          <a
            v-for="item in navItems"
            :key="item.href"
            :href="item.href"
            class="rounded-control px-3 py-2 text-sm font-medium text-copy-muted transition duration-200 hover:bg-panel-soft hover:text-copy-strong hover:shadow-[0_0_24px_-14px_rgba(29,182,253,0.25)]"
          >
            {{ item.label }}
          </a>
        </nav>

        <div class="flex items-center gap-2">
          <a :href="hrefContact" class="brand-button hidden sm:inline-flex">Fale conosco</a>

          <button
            type="button"
            class="inline-flex h-11 w-11 items-center justify-center rounded-control border border-stroke bg-panel-soft/80 text-copy-strong transition duration-200 hover:border-brand-cyan/40 hover:text-brand-cyan lg:hidden"
            :aria-expanded="isMenuOpen"
            :aria-controls="MOBILE_MENU_ID"
            :aria-label="isMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'"
            @click="toggleMenu"
          >
            <svg
              v-if="!isMenuOpen"
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              aria-hidden="true"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
            <svg
              v-else
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <ClientOnly>
      <Teleport to="body">
        <Transition name="mobile-menu">
          <div v-if="isMenuOpen" class="fixed inset-0 z-50 lg:hidden" role="presentation">
            <button
              type="button"
              class="absolute inset-0 bg-canvas/75 backdrop-blur-sm"
              aria-label="Fechar menu"
              tabindex="-1"
              @click="closeMenu"
            />

            <nav
              :id="MOBILE_MENU_ID"
              class="absolute inset-x-0 top-20 border-b border-stroke/80 bg-panel/98 px-4 pb-6 pt-4 shadow-[0_24px_48px_-20px_rgba(0,0,0,0.65)] backdrop-blur-md sm:px-6"
              aria-label="Navegação mobile"
            >
              <ul class="flex flex-col gap-1">
                <li v-for="item in navItems" :key="item.href">
                  <a
                    :href="item.href"
                    class="flex rounded-control px-4 py-3 text-base font-medium text-copy-base transition duration-200 hover:bg-panel-soft hover:text-copy-strong active:bg-brand-cyan/10"
                    @click="onNavClick"
                  >
                    {{ item.label }}
                  </a>
                </li>
              </ul>

              <a
                :href="hrefContact"
                class="brand-button mt-4 w-full justify-center"
                @click="onNavClick"
              >
                Fale conosco
              </a>
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
  transition: opacity 0.22s ease;
}

.mobile-menu-enter-active nav,
.mobile-menu-leave-active nav {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
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
