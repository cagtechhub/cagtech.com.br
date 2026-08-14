<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { LANDING_ANCHOR, landingHref } from '~/constants/landingScreen'

const landing = useLandingStore()
const { packagesIntro, initialProject, projectPackages } = storeToRefs(landing)

const hrefContact = landingHref(LANDING_ANCHOR.contact)
</script>

<template>
  <section :id="LANDING_ANCHOR.packages" class="shell scroll-mt-24 py-8 sm:py-12">
    <div class="section-banner animate-fade-up">
      <h2 class="section-title">{{ packagesIntro.title }}</h2>
      <p class="section-copy">
        {{ packagesIntro.body }}
      </p>
    </div>

    <div
      class="surface landing-interactive-surface mt-6 animate-fade-up border-brand-cyan/25 bg-panel-soft/40 p-6 sm:p-8"
    >
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div class="min-w-0">
          <h3 class="font-display text-xl font-semibold text-copy-strong sm:text-2xl">
            {{ initialProject.title }}
          </h3>
          <p class="mt-3 text-sm leading-relaxed text-copy-muted sm:text-base">
            {{ initialProject.lead }}
          </p>
        </div>
        <a :href="hrefContact" class="brand-button shrink-0 self-start sm:self-center">Solicitar proposta</a>
      </div>
      <ul class="mt-6 grid gap-3 sm:grid-cols-2">
        <li
          v-for="(item, index) in initialProject.bullets"
          :key="index"
          class="flex gap-2 text-sm leading-relaxed text-copy-base"
        >
          <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-cyan" aria-hidden="true" />
          <span>{{ item }}</span>
        </li>
      </ul>
    </div>

    <div class="mt-6 grid gap-4 lg:grid-cols-3">
      <article
        v-for="(pkg, index) in projectPackages"
        :key="pkg.name"
        class="surface landing-interactive-surface relative flex h-full flex-col p-6 animate-fade-up"
        :class="
          pkg.featured
            ? 'border-brand-cyan/45 shadow-[0_0_40px_-18px_rgba(29,182,253,0.35)] lg:scale-[1.02] lg:border-brand-cyan/50'
            : ''
        "
        :style="{ animationDelay: `${index * 90}ms` }"
      >
        <p
          v-if="pkg.featured"
          class="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full border border-brand-cyan/50 bg-brand-cyan/15 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-cyan-light"
        >
          Mais completo
        </p>
        <h3 class="mt-1 font-display text-xl font-semibold text-copy-strong">{{ pkg.name }}</h3>
        <p class="mt-2 text-sm text-copy-muted">{{ pkg.subtitle }}</p>
        <p class="mt-5 font-mono text-2xl font-bold tabular-nums text-brand-cyan-light sm:text-3xl">
          {{ pkg.priceDisplay }}
        </p>
        <p v-if="pkg.priceFootnote" class="mt-2 text-xs leading-relaxed text-copy-muted">
          {{ pkg.priceFootnote }}
        </p>
        <ul class="mt-5 flex flex-1 flex-col gap-2.5 border-t border-stroke/80 pt-5">
          <li
            v-for="(line, i) in pkg.includes"
            :key="i"
            class="flex gap-2 text-sm leading-relaxed text-copy-base"
          >
            <span class="mt-0.5 text-brand-cyan" aria-hidden="true">✓</span>
            <span>{{ line }}</span>
          </li>
        </ul>
        <div class="mt-8">
          <a :href="hrefContact" class="ghost-button block w-full text-center">Falar deste pacote</a>
        </div>
      </article>
    </div>
  </section>
</template>
