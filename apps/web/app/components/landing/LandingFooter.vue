<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { LANDING_ANCHOR, landingHref } from '~/constants/landingScreen'

const landing = useLandingStore()
const {
  brandName,
  navItems,
  socialLinks,
  footerEmail,
  footerPhone,
  footerLocation,
  currentYear,
} = storeToRefs(landing)

const hrefHome = landingHref(LANDING_ANCHOR.home)
</script>

<template>
  <footer class="shell mt-4 border-t border-stroke/70 pt-8">
    <div class="surface grid gap-6 p-5 sm:p-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <a :href="hrefHome" class="inline-flex items-center gap-3">
          <img src="/img/logo.png" :alt="brandName" class="h-8 w-auto" width="140" height="46" />
        </a>

        <nav class="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-copy-muted">
          <a
            v-for="item in navItems"
            :key="`footer-${item.href}`"
            :href="item.href"
            class="rounded-control px-2 py-1 transition hover:text-copy-strong"
          >
            {{ item.label }}
          </a>
        </nav>

        <div class="flex items-center gap-2">
          <a
            v-for="social in socialLinks"
            :key="social.label"
            :href="social.href"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex h-9 w-9 items-center justify-center rounded-control border border-stroke bg-panel-soft text-xs font-bold text-copy-base transition hover:border-brand-cyan/60 hover:text-brand-cyan"
          >
            {{ social.label }}
          </a>
        </div>
      </div>

      <div class="soft-divider pt-4 text-sm text-copy-muted">
        <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span>{{ footerEmail }}</span>
          <span>{{ footerPhone }}</span>
          <span>{{ footerLocation }}</span>
          <span class="ml-auto">{{ currentYear }} {{ brandName }}. Todos os direitos reservados.</span>
        </div>
      </div>
    </div>
  </footer>
</template>
