<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { LANDING_ANCHOR, landingHref } from '~/constants/landingScreen'

const landing = useLandingStore()
const { brandName, navItems } = storeToRefs(landing)

const hrefHome = landingHref(LANDING_ANCHOR.home)
const hrefContact = landingHref(LANDING_ANCHOR.contact)
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-stroke/80 bg-canvas/85 backdrop-blur-md">
    <div class="shell">
      <div class="flex h-20 items-center justify-between gap-4">
        <a :href="hrefHome" class="inline-flex items-center gap-3">
          <img src="/img/logo.png" :alt="brandName" class="h-12 w-auto" width="140" height="46" />
        </a>

        <nav class="hidden items-center gap-2 lg:flex">
          <a
            v-for="item in navItems"
            :key="item.href"
            :href="item.href"
            class="rounded-control px-3 py-2 text-sm font-medium text-copy-muted transition hover:bg-panel-soft hover:text-copy-strong"
          >
            {{ item.label }}
          </a>
        </nav>

        <a :href="hrefContact" class="brand-button hidden sm:inline-flex">Fale conosco</a>
      </div>
    </div>
  </header>
</template>
