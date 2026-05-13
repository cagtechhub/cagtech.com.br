<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { LANDING_ANCHOR } from '~/constants/landingScreen'

const landing = useLandingStore()
const { brandName, brandMonogram, contactReasons } = storeToRefs(landing)
</script>

<template>
  <section :id="LANDING_ANCHOR.contact" class="shell scroll-mt-24 py-8 sm:py-12">
    <div class="section-banner animate-fade-up">
      <span class="inline-flex h-12 w-12 items-center justify-center rounded-control bg-brand-gradient text-sm font-bold text-white">
        {{ brandMonogram }}
      </span>
      <h2 class="mt-4 section-title">Obrigado pelo interesse na {{ brandName }}.</h2>
      <p class="section-copy">
        Adoraríamos conversar e entender como podemos dar vida às suas ideias digitais.
      </p>
      <a href="#contact-form" class="mt-8 brand-button">Iniciar projeto</a>
    </div>

    <div id="contact-form" class="surface mt-6 animate-fade-up p-6 sm:p-8">
      <form class="space-y-5" action="#" method="post" @submit.prevent>
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="space-y-2 text-sm font-medium text-copy-strong">
            Nome completo
            <input type="text" name="fullName" placeholder="Digite aqui" class="field-control" />
          </label>
          <label class="space-y-2 text-sm font-medium text-copy-strong">
            E-mail
            <input type="email" name="email" placeholder="Digite aqui" class="field-control" />
          </label>
        </div>

        <fieldset class="surface bg-panel-soft/55 p-4">
          <legend class="px-2 text-sm font-semibold text-copy-strong">Motivo do contato</legend>
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <label
              v-for="reason in contactReasons"
              :key="reason"
              class="flex cursor-pointer items-center gap-2 rounded-control border border-stroke bg-panel/70 px-3 py-2 text-sm text-copy-base"
            >
              <input type="checkbox" class="h-4 w-4 rounded border-stroke bg-panel-soft text-brand-cyan focus:ring-brand-cyan/50" />
              <span>{{ reason }}</span>
            </label>
          </div>
        </fieldset>

        <div class="surface bg-panel-soft/55 p-4">
          <label class="block text-sm font-semibold text-copy-strong" for="budget">Orçamento previsto</label>
          <p class="mt-1 text-sm text-copy-muted">Ajuste o controle para indicar a faixa de investimento</p>
          <input
            id="budget"
            type="range"
            min="5000"
            max="25000"
            value="12000"
            class="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-stroke accent-brand-cyan"
          />
          <div class="mt-2 flex justify-between text-xs font-semibold text-copy-muted">
            <span>R$ 5 mil</span>
            <span>R$ 25 mil</span>
          </div>
        </div>

        <label class="block space-y-2 text-sm font-medium text-copy-strong">
          Mensagem
          <textarea name="message" rows="5" placeholder="Digite aqui" class="field-control resize-y" />
        </label>

        <div class="flex justify-center pt-1">
          <button type="submit" class="brand-button min-w-36">Enviar</button>
        </div>
      </form>
    </div>
  </section>
</template>
