<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { LANDING_ANCHOR, landingHref } from '~/constants/landingScreen'

const landing = useLandingStore()
const { audiences, trustedBrands, heroCopy } = storeToRefs(landing)

const hrefWork = landingHref(LANDING_ANCHOR.work)
const hrefContact = landingHref(LANDING_ANCHOR.contact)
</script>

<template>
  <section :id="LANDING_ANCHOR.home" class="shell scroll-mt-24 py-14 sm:py-20">
    <div
      class="surface relative grid-overlay tech-grid-motion animate-fade-up overflow-hidden p-8 sm:p-10 lg:p-14"
    >
      <div
        class="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-violet/[0.06] via-transparent to-brand-cyan/[0.07]"
        aria-hidden="true"
      />
      <div class="relative mx-auto max-w-4xl text-center">
        <p class="font-mono text-xs uppercase tracking-[0.2em] text-copy-muted">
          {{ heroCopy.tagline }}
        </p>
        <h1
          class="mt-6 font-display text-4xl font-semibold leading-tight text-copy-strong sm:text-6xl"
        >
          {{ heroCopy.titleMain }}
          <span class="mt-1 block sm:mt-2">
            <span class="text-gradient-brand bg-[length:200%_200%] animate-gradient-shift">
              {{ heroCopy.titleAccent }}
            </span>
          </span>
        </h1>

        <div class="mt-7 flex flex-wrap items-center justify-center gap-2 text-sm text-copy-muted">
          <span
            v-for="(audience, index) in audiences"
            :key="audience"
            class="animate-fade-up rounded-control border border-stroke bg-panel-soft/70 px-3 py-1.5 transition duration-300 hover:border-brand-cyan/35 hover:shadow-[0_0_24px_-12px_rgba(29,182,253,0.35)]"
            :style="{ animationDelay: `${index * 90}ms` }"
          >
            {{ audience }}
          </span>
        </div>

        <div class="mt-9 flex flex-wrap justify-center gap-3">
          <a :href="hrefWork" class="ghost-button transition duration-300 hover:-translate-y-0.5"
            >Ver trabalhos</a
          >
          <a :href="hrefContact" class="brand-button">Iniciar projeto</a>
        </div>
      </div>

      <div class="mt-14 soft-divider pt-8">
        <p class="text-center text-xs font-semibold uppercase tracking-[0.18em] text-copy-muted">
          Confiança de clientes em diferentes segmentos
        </p>
        <div
          class="mt-5 grid grid-cols-2 gap-3 text-center sm:grid-cols-3 lg:grid-cols-4 justify-between"
        >
          <div
            v-for="brand in trustedBrands"
            :key="brand"
            class="rounded-control border border-stroke bg-panel-soft/70 px-3 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-copy-base transition duration-300 hover:border-brand-cyan/30 hover:text-copy-strong"
          >
            {{ brand }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
