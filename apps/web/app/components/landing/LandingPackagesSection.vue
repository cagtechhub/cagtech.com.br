<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { LANDING_ANCHOR, landingHref } from '~/constants/landingScreen'

const landing = useLandingStore()
const { packagesIntro, projectPackages } = storeToRefs(landing)

const hrefContact = landingHref(LANDING_ANCHOR.contact)
</script>

<template>
  <section :id="LANDING_ANCHOR.packages" class="py-space-4xl relative">
    <div class="max-w-[1360px] mx-auto px-6 lg:px-12">
      <!-- Header -->
      <div class="flex flex-col items-center text-center gap-3 mb-16">
        <span class="font-eyebrow text-eyebrow text-brand-cyan uppercase tracking-[0.14em]">
          // 03 — INVESTIMENTO TRANSPARENTE
        </span>
        <h2
          class="font-headline-lg text-[32px] sm:text-[44px] lg:text-[48px] text-text-strong max-w-2xl"
        >
          {{ packagesIntro.title || 'Modelos flexíveis para cada momento do seu negócio' }}
        </h2>
        <p class="font-body-md text-body-md text-text-muted max-w-xl">
          {{
            packagesIntro.body ||
            'Sem custos ocultos ou amarras contratuais abusivas. Escopos claros, métricas de sucesso bem definidas e SLA garantido em contrato.'
          }}
        </p>
      </div>

      <!-- Pricing Matrix (3 columns) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-6">
        <!-- Card 1: MVP Rápido / Landing inicial -->
        <div
          class="rounded-2xl bg-surface border border-stroke p-8 flex flex-col justify-between transition-all hover:border-stroke-strong"
        >
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="font-eyebrow text-eyebrow text-text-muted uppercase">
                STARTUPS &amp; NOVAS IDEIAS
              </span>
            </div>
            <h3 class="font-headline-md text-[24px] text-text-strong mb-2">
              {{ projectPackages[0]?.name || 'MVP Rápido' }}
            </h3>
            <p class="font-body-sm text-body-sm text-text-muted mb-6">
              {{
                projectPackages[0]?.subtitle ||
                'Valide sua hipótese de negócio com um software real e funcional no mercado sem gastar meses de desenvolvimento.'
              }}
            </p>
            <div class="p-4 rounded-xl bg-surface-container-lowest border border-stroke/60 mb-6">
              <span class="font-code text-[12px] text-text-muted block">INVESTIMENTO ESTIMADO</span>
              <div class="font-headline-md text-[22px] text-text-strong font-semibold mt-1">
                {{ projectPackages[0]?.priceDisplay || 'A partir de R$ 12.000' }}
              </div>
              <span class="font-code text-[11px] text-brand-cyan">
                {{ projectPackages[0]?.priceFootnote || 'Prazo médio: 3 a 5 semanas' }}
              </span>
            </div>
            <ul class="space-y-3 font-body-sm text-body-sm text-text-base mb-8">
              <li
                v-for="(item, i) in projectPackages[0]?.includes?.length
                  ? projectPackages[0].includes
                  : [
                      'Prototipagem rápida UI/UX no Figma',
                      'Frontend moderno responsivo (Next.js/React/Nuxt)',
                      'Backend robusto com banco PostgreSQL/Supabase',
                      'Autenticação de usuários e painel básico',
                      'Deploy em produção na nuvem com SSL',
                    ]"
                :key="i"
                class="flex items-start gap-2.5"
              >
                <span class="material-symbols-outlined text-success text-[18px] shrink-0 mt-0.5">
                  check_circle
                </span>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
          <a
            class="inline-flex items-center justify-center w-full h-12 rounded-[10px] bg-white/[0.04] border border-stroke hover:border-brand-cyan/50 text-text-strong font-body-sm text-body-sm font-semibold hover:bg-white/[0.08] transition-all"
            :href="hrefContact"
          >
            Solicitar orçamento para MVP
          </a>
        </div>

        <!-- Card 2: RECOMENDADO (Sistema Sob Medida / Institucional) -->
        <div
          class="rounded-2xl bg-surface-raised border-2 border-brand-indigo/60 p-8 flex flex-col justify-between relative shadow-[0_0_60px_-10px_rgba(196,100,255,0.25)] lg:-translate-y-4"
        >
          <div
            class="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-brand-violet to-brand-cyan text-light-canvas font-eyebrow text-[11px] font-bold tracking-wider uppercase shadow-md"
          >
            ★ MAIS ESCOLHIDO POR EMPRESAS
          </div>
          <div>
            <div class="flex items-center justify-between mb-4 mt-2">
              <span class="font-eyebrow text-eyebrow text-brand-cyan uppercase">
                OPERAÇÃO &amp; ESCALA
              </span>
            </div>
            <h3 class="font-headline-md text-[24px] text-text-strong mb-2">
              {{ projectPackages[1]?.name || 'Sistema Sob Medida' }}
            </h3>
            <p class="font-body-sm text-body-sm text-text-muted mb-6">
              {{
                projectPackages[1]?.subtitle ||
                'Plataforma corporativa completa, desenhada estritamente para os processos e exigências da sua empresa.'
              }}
            </p>
            <div class="p-4 rounded-xl bg-surface border border-brand-indigo/30 mb-6">
              <span class="font-code text-[12px] text-text-muted block">INVESTIMENTO ESTIMADO</span>
              <div class="font-headline-md text-[22px] text-brand-cyan-light font-semibold mt-1">
                {{ projectPackages[1]?.priceDisplay || 'Proposta Personalizada' }}
              </div>
              <span class="font-code text-[11px] text-brand-violet">
                {{ projectPackages[1]?.priceFootnote || 'Baseado em escopo e arquitetura' }}
              </span>
            </div>
            <ul class="space-y-3 font-body-sm text-body-sm text-text-base mb-8">
              <li
                v-for="(item, i) in projectPackages[1]?.includes?.length
                  ? projectPackages[1].includes
                  : [
                      'Arquitetura de microsserviços ou monolito modular',
                      'Painel administrativo com controle avançado de permissões (RBAC)',
                      'Integração com ERPs, CRMs e gateways de pagamento',
                      'Pipeline automatizado CI/CD e testes ponta a ponta',
                      '60 dias de garantia técnica e suporte prioritário pós-deploy',
                    ]"
                :key="i"
                class="flex items-start gap-2.5"
              >
                <span class="material-symbols-outlined text-success text-[18px] shrink-0 mt-0.5">
                  check_circle
                </span>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
          <a
            class="inline-flex items-center justify-center w-full h-12 rounded-[10px] bg-gradient-to-r from-brand-violet via-brand-indigo to-brand-cyan text-light-canvas font-body-sm text-body-sm font-semibold shadow-[0_0_24px_rgba(29,182,253,0.35)] hover:shadow-[0_0_32px_rgba(29,182,253,0.55)] transition-all"
            :href="hrefContact"
          >
            Solicitar Proposta Customizada
          </a>
        </div>

        <!-- Card 3: Squad Dedicado / Personalizado -->
        <div
          class="rounded-2xl bg-surface border border-stroke p-8 flex flex-col justify-between transition-all hover:border-stroke-strong"
        >
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="font-eyebrow text-eyebrow text-text-muted uppercase">
                ACELERAÇÃO CONTÍNUA
              </span>
            </div>
            <h3 class="font-headline-md text-[24px] text-text-strong mb-2">
              {{ projectPackages[2]?.name || 'Squad Dedicado' }}
            </h3>
            <p class="font-body-sm text-body-sm text-text-muted mb-6">
              {{
                projectPackages[2]?.subtitle ||
                'Equipe sênior de engenharia incorporada ao seu ecossistema, pronta para acelerar entregas e roadmap técnico.'
              }}
            </p>
            <div class="p-4 rounded-xl bg-surface-container-lowest border border-stroke/60 mb-6">
              <span class="font-code text-[12px] text-text-muted block">INVESTIMENTO ESTIMADO</span>
              <div class="font-headline-md text-[22px] text-text-strong font-semibold mt-1">
                {{ projectPackages[2]?.priceDisplay || 'Mensalidade por Squad' }}
              </div>
              <span class="font-code text-[11px] text-brand-cyan">
                {{ projectPackages[2]?.priceFootnote || 'Contratação flexível com renovação' }}
              </span>
            </div>
            <ul class="space-y-3 font-body-sm text-body-sm text-text-base mb-8">
              <li
                v-for="(item, i) in projectPackages[2]?.includes?.length
                  ? projectPackages[2].includes
                  : [
                      'Tech Lead Arquiteto + Devs Fullstack sêniores',
                      'Dedicação exclusiva (Full-time ou Half-time)',
                      'Cerimônias ágeis, dailies e relatórios semanais de throughput',
                      'Escala ou redução do time com 30 dias de aviso prévio',
                      'Gestão direta ou gerenciado pela CAG Tech',
                    ]"
                :key="i"
                class="flex items-start gap-2.5"
              >
                <span class="material-symbols-outlined text-success text-[18px] shrink-0 mt-0.5">
                  check_circle
                </span>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
          <a
            class="inline-flex items-center justify-center w-full h-12 rounded-[10px] bg-white/[0.04] border border-stroke hover:border-brand-cyan/50 text-text-strong font-body-sm text-body-sm font-semibold hover:bg-white/[0.08] transition-all"
            :href="hrefContact"
          >
            Consultar disponibilidade de Squad
          </a>
        </div>
      </div>

      <!-- Bottom Advisory Note -->
      <div
        class="mt-12 text-center p-5 rounded-xl bg-surface border border-stroke/60 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3"
      >
        <span class="material-symbols-outlined text-brand-cyan text-[20px]">info</span>
        <span class="font-body-sm text-body-sm text-text-muted">
          Precisa de uma análise técnica personalizada?
          <a
            class="text-brand-cyan underline font-medium hover:text-brand-cyan-light"
            :href="hrefContact"
          >
            Agende um diagnóstico de viabilidade sem custo
          </a>
          com nossos arquitetos.
        </span>
      </div>
    </div>
  </section>
</template>
