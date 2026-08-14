<script setup lang="ts">
import { storeToRefs } from 'pinia'
import z from 'zod'

import { LANDING_ANCHOR } from '~/constants/landingScreen'

const landing = useLandingStore()
const { brandName, brandMonogram, contactReasons } = storeToRefs(landing)

const BUDGET_MIN = 1_250
const BUDGET_MAX = 25_000

const contactForm = ref({
  fullName: '',
  email: '',
  reason: [] as string[],
  budget: 10_000,
  message: '',
})

const budgetFormatted = computed(() =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(contactForm.value.budget)
)

const updateBudgetValue = (value: number) => {
  contactForm.value.budget = value
}
const schema = z.object({
  fullName: z.string().min(1, 'Nome completo é obrigatório'),
  email: z.email('E-mail inválido'),
  reason: z.array(z.string()).min(1, 'Motivo do contato é obrigatório'),
  budget: z
    .number()
    .min(BUDGET_MIN, 'Orçamento previsto deve ser maior que R$ 1.250')
    .max(BUDGET_MAX, 'Orçamento previsto deve ser menor que R$ 25.000'),
  message: z
    .string()
    .min(1, 'Mensagem é obrigatória')
    .max(1000, 'Mensagem deve ter no máximo 1000 caracteres'),
})

const contactFormSchema = toTypedSchema(schema)

const onSubmit = async (form: z.infer<typeof schema>) => {
  try {
    const response = await $fetch('/api/contact', {
      method: 'POST',
      body: {
        fullName: form.fullName,
        email: form.email,
        reason: form.reason,
        budget: form.budget,
        message: form.message,
      },
    })

    if (response.success) {
      useNotify().success(
        'Obrigado pelo contato!',
        'Em breve entraremos em contato para conversar sobre o seu projeto.',
        5_000
      )
      contactForm.value = {
        fullName: '',
        email: '',
        reason: [] as string[],
        budget: 10_000,
        message: '',
      }
      return
    }
  } catch {
    useNotify().error('Falha ao enviar o contato', 'Por favor, tente novamente mais tarde.')
  }
}
</script>

<template>
  <section :id="LANDING_ANCHOR.contact" class="shell scroll-mt-24 py-8 sm:py-12">
    <div class="section-banner animate-fade-up">
      <span
        class="inline-flex h-12 w-12 items-center justify-center rounded-control bg-brand-gradient text-sm font-bold text-white"
      >
        {{ brandMonogram }}
      </span>
      <h2 class="mt-4 section-title">Obrigado pelo interesse na {{ brandName }}.</h2>
      <p class="section-copy">
        Adoraríamos conversar e entender como podemos dar vida às suas ideias digitais.
      </p>
      <a href="#contact-form" class="mt-8 brand-button">Iniciar projeto</a>
    </div>

    <div
      id="contact-form"
      class="surface landing-interactive-surface mt-6 animate-fade-up p-6 sm:p-8"
    >
      <VeeForm class="space-y-5" @submit="onSubmit" :validation-schema="contactFormSchema">
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="space-y-2 text-sm font-medium text-copy-strong">
            Nome completo<br />
            <VeeField
              v-model="contactForm.fullName"
              type="text"
              name="fullName"
              placeholder="Digite aqui"
              class="field-control"
              required
            />
            <VeeErrorMessage name="fullName" />
          </label>
          <label class="space-y-2 text-sm font-medium text-copy-strong">
            E-mail<br />
            <VeeField
              v-model="contactForm.email"
              type="email"
              name="email"
              placeholder="Digite aqui"
              class="field-control"
              required
            />
            <VeeErrorMessage name="email" />
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
              <VeeField
                v-model="contactForm.reason"
                type="checkbox"
                name="reason"
                class="h-4 w-4 rounded border-stroke bg-panel-soft text-brand-cyan focus:ring-brand-cyan/50"
                :value="reason"
              />
              <span>{{ reason }}</span>
              <VeeErrorMessage name="reason" />
            </label>
          </div>
        </fieldset>

        <div class="surface bg-panel-soft/55 p-4">
          <label class="block text-sm font-semibold text-copy-strong" for="budget"
            >Orçamento previsto</label
          >
          <div class="mt-1 flex flex-wrap items-center justify-between gap-2">
            <p class="text-sm text-copy-muted">
              Ajuste o controle para indicar a faixa de investimento
            </p>
            <output
              class="shrink-0 rounded-control border border-brand-cyan/35 bg-brand-cyan/10 px-3 py-1 font-mono text-sm font-semibold tabular-nums text-brand-cyan-light"
              for="budget"
              aria-live="polite"
            >
              {{ budgetFormatted }}
            </output>
          </div>
          <VeeField
            id="budget"
            v-model.number="contactForm.budget"
            type="range"
            name="budget"
            :min="BUDGET_MIN"
            :max="BUDGET_MAX"
            :step="250"
            class="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-stroke accent-brand-cyan"
            required
          />
          <div
            class="mt-2 flex justify-between text-xs font-semibold text-copy-muted *:cursor-pointer"
          >
            <span @click="updateBudgetValue(BUDGET_MIN)">R$ 1.250</span>
            <span @click="updateBudgetValue(BUDGET_MAX)">+R$ 25 mil</span>
          </div>
        </div>

        <label class="block space-y-2 text-sm font-medium text-copy-strong">
          Mensagem<br />
          <VeeField
            type="textarea"
            v-model="contactForm.message"
            name="message"
            rows="5"
            placeholder="Digite aqui"
            class="field-control resize-y"
          />
          <VeeErrorMessage name="message" />
        </label>

        <div class="flex justify-center pt-1">
          <button type="submit" class="brand-button min-w-36">Enviar</button>
        </div>
      </VeeForm>
    </div>
  </section>
</template>
