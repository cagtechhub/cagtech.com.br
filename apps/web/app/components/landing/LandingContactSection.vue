<script setup lang="ts">
import { storeToRefs } from 'pinia'
import z from 'zod'

import { LANDING_ANCHOR } from '~/constants/landingScreen'

const landing = useLandingStore()
const { footerEmail, contactProjectTypes, contactBudgetRanges } = storeToRefs(landing)

const contactForm = ref({
  fullName: '',
  email: '',
  phone: '',
  company: '',
  projectType: '',
  budgetRange: '',
  message: '',
})

watch(
  [contactProjectTypes, contactBudgetRanges],
  ([types, budgets]) => {
    if (types?.[0] && !contactForm.value.projectType) {
      contactForm.value.projectType = types[0]
    }
    if (budgets?.[0] && !contactForm.value.budgetRange) {
      contactForm.value.budgetRange = budgets[0]
    }
  },
  { immediate: true }
)

const isSubmitting = ref(false)

const budgetNumericMap: Record<string, number> = {
  'Até R$ 20.000 (MVP / Escopo pontual)': 15000,
  'R$ 20.000 a R$ 50.000 (Sistema sob medida)': 25000,
  'R$ 50.000 a R$ 120.000 (Plataforma complexa / Escala)': 25000,
  'Acima de R$ 120.000 / Squad Dedicado contínuo)': 25000,
}

const schema = z.object({
  fullName: z.string().min(1, 'Nome completo é obrigatório'),
  email: z.string().email('E-mail corporativo inválido'),
  phone: z.string().min(1, 'WhatsApp é obrigatório'),
  company: z.string().optional(),
  projectType: z.string(),
  budgetRange: z.string(),
  message: z.string().min(1, 'Descrição é obrigatória').max(2000),
})

const contactFormSchema = toTypedSchema(schema)

const onSubmit = async (form: z.infer<typeof schema>) => {
  isSubmitting.value = true
  try {
    const numericBudget = budgetNumericMap[form.budgetRange] || 15000
    const reasonPayload = [
      form.projectType,
      form.company ? `Empresa: ${form.company}` : '',
      `WhatsApp: ${form.phone}`,
      `Faixa: ${form.budgetRange}`,
    ].filter(Boolean)

    const response = await $fetch<{ success: boolean }>(`${resolveApiBase()}/public/contacts`, {
      method: 'POST',
      body: {
        fullName: form.fullName,
        email: form.email,
        reason: reasonPayload,
        budget: numericBudget,
        message: form.message,
      },
    })

    if (response.success) {
      useNotify().success(
        'Solicitação enviada!',
        'Nossos arquitetos entrarão em contato em até 24 horas úteis.',
        5_000
      )
      contactForm.value = {
        fullName: '',
        email: '',
        phone: '',
        company: '',
        projectType: 'web',
        budgetRange: 'R$ 20.000 a R$ 50.000 (Sistema sob medida)',
        message: '',
      }
    }
  } catch {
    useNotify().error(
      'Falha ao enviar',
      'Por favor, tente novamente ou entre em contato pelo WhatsApp.'
    )
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section :id="LANDING_ANCHOR.contact" class="py-space-4xl relative">
    <div class="max-w-[1360px] mx-auto px-6 lg:px-12">
      <!-- Glass Frame Container -->
      <div
        class="rounded-[24px] bg-surface/70 border border-stroke p-8 lg:p-14 backdrop-blur-2xl shadow-[0_30px_90px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden"
      >
        <!-- Ambient accents inside panel -->
        <div
          class="absolute -top-32 -right-32 w-96 h-96 bg-brand-cyan/15 rounded-full blur-[120px] pointer-events-none"
        />
        <div
          class="absolute -bottom-32 -left-32 w-96 h-96 bg-brand-violet/15 rounded-full blur-[120px] pointer-events-none"
        />

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
          <!-- Column Left: Copy & Contact Details (5 cols) -->
          <div class="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div>
              <span
                class="font-eyebrow text-eyebrow text-brand-cyan uppercase tracking-[0.14em] block mb-3"
              >
                // 07 — VAMOS CONVERSAR
              </span>
              <h2
                class="font-headline-lg text-[32px] sm:text-[44px] text-text-strong leading-tight mb-4"
              >
                Pronto para tirar sua ideia do papel e colocar em código?
              </h2>
              <p class="font-body-md text-body-md text-text-muted leading-relaxed">
                Preencha o formulário e receba uma análise de viabilidade técnica e arquitetural com
                estimativa de cronograma em até
                <strong class="text-text-strong">24 horas úteis</strong>.
              </p>
            </div>

            <!-- Direct Contact List -->
            <div class="space-y-4 pt-4 border-t border-stroke/60">
              <div class="flex items-center gap-3 text-text-muted font-body-sm text-body-sm">
                <span
                  class="w-8 h-8 rounded-lg bg-surface-raised border border-stroke flex items-center justify-center text-brand-cyan shrink-0"
                >
                  <span class="material-symbols-outlined text-[18px]">mail</span>
                </span>
                <span>{{ footerEmail || 'contato@cagtech.com.br' }}</span>
              </div>
              <div class="flex items-center gap-3 text-text-muted font-body-sm text-body-sm">
                <span
                  class="w-8 h-8 rounded-lg bg-surface-raised border border-stroke flex items-center justify-center text-brand-cyan shrink-0"
                >
                  <span class="material-symbols-outlined text-[18px]">verified_user</span>
                </span>
                <span>Acordo de Confidencialidade (NDA) disponível na primeira reunião</span>
              </div>
              <div class="flex items-center gap-3 text-text-muted font-body-sm text-body-sm">
                <span
                  class="w-8 h-8 rounded-lg bg-surface-raised border border-stroke flex items-center justify-center text-brand-cyan shrink-0"
                >
                  <span class="material-symbols-outlined text-[18px]">schedule</span>
                </span>
                <span>Atendimento técnico: Segunda a Sexta, das 09h às 18h</span>
              </div>
            </div>

            <div
              class="inline-flex items-center gap-2 font-code text-[12px] text-success bg-success/10 px-3 py-1.5 rounded-lg border border-success/30 w-fit"
            >
              <span class="w-2 h-2 rounded-full bg-success animate-pulse" />
              SLA de resposta comercial: &lt; 24h
            </div>
          </div>

          <!-- Column Right: Form (7 cols) -->
          <div
            class="lg:col-span-7 bg-surface-container-lowest/60 p-6 sm:p-8 rounded-2xl border border-stroke/70"
          >
            <VeeForm class="space-y-5" :validation-schema="contactFormSchema" @submit="onSubmit">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1.5 text-left">
                  <label class="font-body-sm text-[13px] text-text-muted font-medium">
                    Nome completo *
                  </label>
                  <VeeField
                    v-model="contactForm.fullName"
                    type="text"
                    name="fullName"
                    placeholder="Seu nome ou responsável"
                    class="w-full h-12 px-4 rounded-[10px] bg-white/[0.03] border border-stroke text-text-strong font-body-sm text-body-sm placeholder:text-text-muted/50 focus:outline-none focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 transition-all"
                  />
                  <VeeErrorMessage name="fullName" class="text-xs text-danger" />
                </div>
                <div class="space-y-1.5 text-left">
                  <label class="font-body-sm text-[13px] text-text-muted font-medium">
                    E-mail corporativo *
                  </label>
                  <VeeField
                    v-model="contactForm.email"
                    type="email"
                    name="email"
                    placeholder="nome@empresa.com.br"
                    class="w-full h-12 px-4 rounded-[10px] bg-white/[0.03] border border-stroke text-text-strong font-body-sm text-body-sm placeholder:text-text-muted/50 focus:outline-none focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 transition-all"
                  />
                  <VeeErrorMessage name="email" class="text-xs text-danger" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1.5 text-left">
                  <label class="font-body-sm text-[13px] text-text-muted font-medium">
                    WhatsApp com DDD *
                  </label>
                  <VeeField
                    v-model="contactForm.phone"
                    type="tel"
                    name="phone"
                    placeholder="(11) 99999-9999"
                    class="w-full h-12 px-4 rounded-[10px] bg-white/[0.03] border border-stroke text-text-strong font-body-sm text-body-sm placeholder:text-text-muted/50 focus:outline-none focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 transition-all"
                  />
                  <VeeErrorMessage name="phone" class="text-xs text-danger" />
                </div>
                <div class="space-y-1.5 text-left">
                  <label class="font-body-sm text-[13px] text-text-muted font-medium">
                    Nome da empresa
                  </label>
                  <VeeField
                    v-model="contactForm.company"
                    type="text"
                    name="company"
                    placeholder="Razão social ou startup"
                    class="w-full h-12 px-4 rounded-[10px] bg-white/[0.03] border border-stroke text-text-strong font-body-sm text-body-sm placeholder:text-text-muted/50 focus:outline-none focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 transition-all"
                  />
                </div>
              </div>

              <!-- Tipo de projeto tags -->
              <div class="space-y-2 text-left">
                <label class="font-body-sm text-[13px] text-text-muted font-medium block">
                  Tipo de projeto principal
                </label>
                <div class="flex flex-wrap gap-2">
                  <label v-for="type in contactProjectTypes" :key="type" class="cursor-pointer">
                    <VeeField
                      v-model="contactForm.projectType"
                      type="radio"
                      name="projectType"
                      :value="type"
                      class="peer sr-only"
                    />
                    <span
                      class="px-3.5 py-1.5 rounded-lg border border-stroke bg-surface peer-checked:bg-brand-cyan/15 peer-checked:border-brand-cyan peer-checked:text-brand-cyan font-body-sm text-[13px] text-text-muted transition-all block"
                    >
                      {{ type }}
                    </span>
                  </label>
                </div>
              </div>

              <!-- Faixa de investimento -->
              <div class="space-y-1.5 text-left">
                <label class="font-body-sm text-[13px] text-text-muted font-medium">
                  Faixa de investimento estimada
                </label>
                <VeeField
                  v-model="contactForm.budgetRange"
                  as="select"
                  name="budgetRange"
                  class="w-full h-12 px-4 rounded-[10px] bg-surface border border-stroke text-text-strong font-body-sm text-body-sm focus:outline-none focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 transition-all"
                >
                  <option
                    v-for="budget in contactBudgetRanges"
                    :key="budget"
                    class="bg-surface text-text-strong"
                    :value="budget"
                  >
                    {{ budget }}
                  </option>
                </VeeField>
              </div>

              <!-- Mensagem / Descrição -->
              <div class="space-y-1.5 text-left">
                <label class="font-body-sm text-[13px] text-text-muted font-medium">
                  Breve descrição da necessidade ou desafio *
                </label>
                <VeeField
                  v-model="contactForm.message"
                  as="textarea"
                  name="message"
                  rows="3"
                  placeholder="Conte-nos os objetivos, gargalos atuais ou funcionalidades essenciais..."
                  class="w-full p-4 rounded-[10px] bg-white/[0.03] border border-stroke text-text-strong font-body-sm text-body-sm placeholder:text-text-muted/50 focus:outline-none focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 transition-all"
                />
                <VeeErrorMessage name="message" class="text-xs text-danger" />
              </div>

              <!-- Submit button -->
              <button
                class="w-full h-[52px] rounded-[10px] bg-gradient-to-r from-brand-violet via-brand-indigo to-brand-cyan text-light-canvas font-body-sm text-body-sm font-semibold shadow-[0_0_24px_rgba(29,182,253,0.35)] hover:shadow-[0_0_36px_rgba(29,182,253,0.6)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                type="submit"
                :disabled="isSubmitting"
              >
                <span>{{
                  isSubmitting ? 'Enviando...' : 'Solicitar proposta técnica gratuita'
                }}</span>
                <span class="material-symbols-outlined text-[18px]">send</span>
              </button>
              <p class="font-body-sm text-[11px] text-text-muted text-center">
                Seus dados estão protegidos de acordo com a LGPD e não serão compartilhados com
                terceiros.
              </p>
            </VeeForm>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
