<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { LANDING_ANCHOR } from '~/constants/landingScreen'

const landing = useLandingStore()
const { faqColumns } = storeToRefs(landing)

/** Numeração global dos itens do FAQ (independente da divisão em colunas). */
function faqOrdinal(columnIndex: number, itemIndex: number): number {
  const cols = faqColumns.value
  let n = itemIndex
  for (let i = 0; i < columnIndex; i++) {
    n += cols[i]?.length ?? 0
  }
  return n + 1
}
</script>

<template>
  <section :id="LANDING_ANCHOR.process" class="shell scroll-mt-24 py-8 sm:py-12">
    <div class="section-banner animate-fade-up">
      <h2 class="section-title">Perguntas frequentes</h2>
      <p class="section-copy">
        Perguntas comuns sobre escopo, processo e suporte para ajudar sua equipe a decidir com mais seguranca.
      </p>
    </div>

    <div class="mt-6 grid gap-4 lg:grid-cols-2">
      <div v-for="(column, columnIndex) in faqColumns" :key="columnIndex" class="space-y-4">
        <details
          v-for="(faq, itemIndex) in column"
          :key="faq.question"
          class="surface landing-interactive-surface animate-fade-up group p-5"
          :style="{ animationDelay: `${(columnIndex * 4 + itemIndex) * 70}ms` }"
        >
          <summary class="flex list-none cursor-pointer items-start justify-between gap-4">
            <div class="flex items-start gap-4">
              <span class="font-mono text-lg font-semibold text-brand-cyan">
                {{ String(faqOrdinal(columnIndex, itemIndex)).padStart(2, '0') }}
              </span>
              <span class="pt-0.5 text-base font-semibold text-copy-strong">{{ faq.question }}</span>
            </div>
            <span class="text-xl leading-none text-copy-muted transition group-open:rotate-45 group-open:text-brand-cyan">+</span>
          </summary>
          <p class="mt-4 pl-10 text-sm leading-relaxed text-copy-muted">{{ faq.answer }}</p>
        </details>
      </div>
    </div>
  </section>
</template>
