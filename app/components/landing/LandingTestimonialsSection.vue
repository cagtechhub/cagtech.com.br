<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { LANDING_ANCHOR } from '~/constants/landingScreen'

const landing = useLandingStore()
const { testimonials } = storeToRefs(landing)
</script>

<template>
  <section :id="LANDING_ANCHOR.work" class="shell scroll-mt-24 py-8 sm:py-12">
    <div class="section-banner animate-fade-up">
      <h2 class="section-title">O que nossos clientes dizem</h2>
      <p class="section-copy">
        Orgulho em entregar produtos de alto nível e manter colaboração próxima do planejamento ao pós-lançamento.
      </p>
    </div>

    <div class="mt-6 grid gap-4 lg:grid-cols-2">
      <article
        v-for="(testimonial, index) in testimonials"
        :key="testimonial.name"
        class="surface landing-interactive-surface group animate-fade-up flex flex-col gap-6 p-6"
        :style="{ animationDelay: `${index * 90}ms` }"
      >
        <div>
          <h3 class="font-display text-2xl font-semibold leading-snug text-brand-cyan-light">{{ testimonial.title }}</h3>
          <p class="mt-4 text-sm leading-relaxed text-copy-muted">{{ testimonial.quote }}</p>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3 rounded-control border border-stroke bg-panel-soft/80 p-3">
          <div class="flex items-center gap-3">
            <span class="inline-flex h-10 w-10 items-center justify-center rounded-control bg-brand-blue/20 font-display text-xs font-semibold text-brand-cyan">
              {{ testimonial.name.slice(0, 2).toUpperCase() }}
            </span>
            <div>
              <p class="text-sm font-semibold text-copy-strong">{{ testimonial.name }}</p>
              <p class="text-xs text-copy-muted">{{ testimonial.role }}</p>
            </div>
          </div>
          <button type="button" class="ghost-button px-4 py-2 text-xs">Visitar site</button>
        </div>
      </article>
    </div>
  </section>
</template>
