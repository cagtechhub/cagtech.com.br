<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { LANDING_ANCHOR } from '~/constants/landingScreen'

const landing = useLandingStore()
const { services, servicesIntro } = storeToRefs(landing)
</script>

<template>
  <section :id="LANDING_ANCHOR.services" class="shell scroll-mt-24 py-8 sm:py-12">
    <div class="section-banner animate-fade-up">
      <h2 class="section-title">{{ servicesIntro.title }}</h2>
      <p class="section-copy">
        {{ servicesIntro.body }}
      </p>
    </div>

    <div class="mt-6 grid gap-4 md:grid-cols-3">
      <article
        v-for="(service, index) in services"
        :key="service.title"
        class="surface landing-interactive-surface group animate-fade-up flex h-full flex-col p-6"
        :style="{ animationDelay: `${index * 110}ms` }"
      >
        <span class="inline-flex h-12 w-12 items-center justify-center rounded-control border border-brand-cyan/30 bg-brand-cyan/10 text-brand-cyan transition duration-300 group-hover:scale-105 group-hover:border-brand-cyan/50 group-hover:shadow-[0_0_28px_-10px_rgba(29,182,253,0.45)]">
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
            <path :d="service.icon" />
          </svg>
        </span>
        <h3 class="mt-5 font-display text-2xl font-semibold text-copy-strong">{{ service.title }}</h3>
        <p class="mt-4 text-sm leading-relaxed text-copy-muted">{{ service.description }}</p>
        <div class="mt-8">
          <button type="button" class="ghost-button w-full">Saiba mais</button>
        </div>
      </article>
    </div>
  </section>
</template>
