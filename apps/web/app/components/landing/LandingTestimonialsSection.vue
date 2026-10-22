<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { LANDING_ANCHOR } from '~/constants/landingScreen'

const landing = useLandingStore()
const { testimonials } = storeToRefs(landing)

const defaultTestimonials = [
  {
    name: 'Marcelo Rezende',
    role: 'CTO · LogiTech Brasil',
    initials: 'MR',
    color: 'bg-brand-indigo/30 border-brand-indigo/50',
    quote:
      '"A CAG Tech transformou nossa operação. Migramos de um legado caótico para uma arquitetura em microsserviços sem um único segundo de indisponibilidade nas nossas vendas. É uma equipe que fala a linguagem do negócio e entrega excelência de código."',
  },
  {
    name: 'Fernanda Albuquerque',
    role: 'Head de Produto · Nexa Pay',
    initials: 'FA',
    color: 'bg-brand-violet/30 border-brand-violet/50',
    quote:
      '"O diferencial deles é a ausência de enrolação técnica. Prazos cumpridos rigorosamente, testes com alta cobertura e repositório organizado. Conseguimos validar nossa tese de MVP em apenas 4 semanas com clientes pagantes."',
  },
  {
    name: 'Rodrigo Silveira',
    role: 'Diretor de Operações · DataGov',
    initials: 'RS',
    color: 'bg-brand-cyan/30 border-brand-cyan/50',
    quote:
      '"Contratamos o modelo de Squad Dedicado e o ganho de cadência foi imediato. Os engenheiros da CAG Tech se integraram perfeitamente à nossa equipe interna, elevando inclusive nossos padrões de code review e CI/CD."',
  },
]
</script>

<template>
  <section :id="LANDING_ANCHOR.work" class="py-space-4xl relative">
    <div class="max-w-[1360px] mx-auto px-6 lg:px-12">
      <!-- Section Intro Header -->
      <div class="flex flex-col items-center text-center gap-3 mb-16">
        <span class="font-eyebrow text-eyebrow text-brand-cyan uppercase tracking-[0.14em]">
          // 05 — CONFIANÇA COMPROVADA
        </span>
        <h2
          class="font-headline-lg text-[32px] sm:text-[44px] lg:text-[48px] text-text-strong max-w-2xl"
        >
          O que dizem os líderes de tecnologia e negócios
        </h2>
        <p class="font-body-md text-body-md text-text-muted max-w-xl">
          Relações sustentadas em entregas pontuais, comunicação técnica franca e código que não
          quebra no dia seguinte ao go-live.
        </p>
      </div>

      <!-- 3 Testimonial Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="t in testimonials.length >= 3 ? testimonials : defaultTestimonials"
          :key="t.name"
          class="rounded-2xl bg-surface/80 p-8 border border-stroke backdrop-blur-md flex flex-col justify-between hover:border-stroke-strong transition-all"
        >
          <div>
            <!-- Stars & Quote Icon -->
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-1 text-warning">
                <span v-for="s in 5" :key="s" class="material-symbols-outlined text-[18px]">
                  star
                </span>
              </div>
              <span
                class="font-headline-lg text-[36px] leading-none bg-gradient-to-r from-brand-violet to-brand-cyan bg-clip-text text-transparent font-serif"
              >
                “
              </span>
            </div>
            <p class="font-body-md text-[15px] text-text-base mb-6 leading-relaxed">
              {{ t.quote }}
            </p>
          </div>

          <div class="flex items-center gap-3 pt-4 border-t border-stroke/60">
            <img
              v-if="'logoUrl' in t && t.logoUrl"
              :src="t.logoUrl"
              :alt="t.role"
              class="w-10 h-10 rounded-full bg-surface-raised border border-stroke object-contain p-1"
            />
            <div
              v-else
              :class="[
                'w-10 h-10 rounded-full border flex items-center justify-center font-bold text-text-strong text-[14px]',
                'color' in t && t.color ? t.color : 'bg-brand-indigo/30 border-brand-indigo/50',
              ]"
            >
              {{ 'initials' in t ? t.initials : t.name.slice(0, 2).toUpperCase() }}
            </div>
            <div>
              <div class="font-body-sm text-[14px] font-semibold text-text-strong">
                {{ t.name }}
              </div>
              <div class="font-code text-[11px] text-text-muted">
                {{ t.role }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
