<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { LANDING_ANCHOR } from '~/constants/landingScreen'

const landing = useLandingStore()
const { brandName, differentiators } = storeToRefs(landing)
</script>

<template>
  <section :id="LANDING_ANCHOR.about" class="shell scroll-mt-24 py-8 sm:py-12">
    <div class="section-banner animate-fade-up">
      <h2 class="section-title">Por que escolher a {{ brandName }}?</h2>
      <p class="section-copy">
        Unimos engenharia de software para web, SEO e gestão de projeto para sites e landings que evoluem com seu negócio — do pacote inicial ao produto personalizado.
      </p>
    </div>

    <div class="mt-6 grid gap-4 md:grid-cols-2">
      <article
        v-for="(item, index) in differentiators"
        :key="item.title"
        class="surface landing-interactive-surface group animate-fade-up p-6"
        :style="{ animationDelay: `${index * 100}ms` }"
      >
        <div class="flex items-start gap-3">
          <span class="inline-flex h-11 w-11 items-center justify-center rounded-control border border-brand-violet/35 bg-brand-violet/12 text-brand-violet transition duration-300 group-hover:scale-105 group-hover:border-brand-violet/55 group-hover:shadow-[0_0_26px_-10px_rgba(196,100,255,0.4)]">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
              <path :d="item.icon" />
            </svg>
          </span>
          <h3 class="font-display text-2xl font-semibold text-copy-strong">{{ item.title }}</h3>
        </div>
        <p class="mt-4 text-sm leading-relaxed text-copy-muted">{{ item.description }}</p>
      </article>
    </div>
  </section>
</template>
