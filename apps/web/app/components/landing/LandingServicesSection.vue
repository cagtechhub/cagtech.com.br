<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { LANDING_ANCHOR } from '~/constants/landingScreen'

const landing = useLandingStore()
const { services, servicesIntro } = storeToRefs(landing)
</script>

<template>
  <section :id="LANDING_ANCHOR.services" class="py-space-4xl relative">
    <div class="max-w-[1360px] mx-auto px-6 lg:px-12">
      <div class="flex flex-col items-start gap-3 mb-16">
        <span class="font-eyebrow text-eyebrow text-brand-cyan uppercase tracking-[0.14em]">
          // 01 — CAPACIDADES DE ENGENHARIA
        </span>
        <h2
          class="font-headline-lg text-[32px] sm:text-[44px] lg:text-[48px] text-text-strong max-w-2xl"
        >
          {{ servicesIntro.title || 'Soluções completas construídas para a sua escala' }}
        </h2>
        <p class="font-body-md text-body-md text-text-muted max-w-xl">
          {{
            servicesIntro.body ||
            'Do design de arquitetura de alta tolerância a falhas até o deploy supervisionado. Entregamos ativos de tecnologia duradouros.'
          }}
        </p>
      </div>

      <!-- Bento Grid 3 columns -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Card 1: Large 2-column Bento Card (Web Systems / SaaS) -->
        <div
          class="md:col-span-2 rounded-[18px] bg-surface p-7 lg:p-9 border border-stroke hover:border-stroke-strong hover:bg-surface-raised transition-all relative overflow-hidden group"
        >
          <div
            class="absolute -right-20 -bottom-20 w-80 h-80 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-cyan/15 transition-all"
          />
          <div class="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div class="flex items-center justify-between mb-6">
                <div
                  class="w-12 h-12 rounded-xl bg-surface-raised border border-stroke flex items-center justify-center text-brand-cyan"
                >
                  <span class="material-symbols-outlined text-[26px]">web</span>
                </div>
                <span
                  class="font-code text-[12px] text-text-muted bg-white/[0.03] px-3 py-1 rounded-full border border-stroke"
                >
                  ESCALA ENTERPRISE
                </span>
              </div>
              <h3 class="font-headline-md text-headline-md text-text-strong mb-3">
                {{ services[0]?.title || 'Sistemas Web e Plataformas SaaS Sob Medida' }}
              </h3>
              <p class="font-body-md text-body-md text-text-muted max-w-2xl mb-6">
                {{
                  services[0]?.description ||
                  'Dashboards operacionais de alta densidade de dados, portais B2B protegidos, arquiteturas multitenant e painéis administrativos com foco em usabilidade e velocidade sem gargalos.'
                }}
              </p>
            </div>
            <div class="flex flex-wrap gap-2 pt-4 border-t border-stroke/50">
              <span
                class="font-code text-[12px] px-3 py-1 rounded-md bg-surface-container border border-stroke text-text-muted"
              >
                SPA / SSR
              </span>
              <span
                class="font-code text-[12px] px-3 py-1 rounded-md bg-surface-container border border-stroke text-text-muted"
              >
                Multi-tenant
              </span>
              <span
                class="font-code text-[12px] px-3 py-1 rounded-md bg-surface-container border border-stroke text-text-muted"
              >
                RBAC &amp; Enterprise Security
              </span>
              <span
                class="font-code text-[12px] px-3 py-1 rounded-md bg-surface-container border border-stroke text-text-muted"
              >
                High-density Grids
              </span>
            </div>
          </div>
        </div>

        <!-- Card 2: Mobile Apps -->
        <div
          class="rounded-[18px] bg-surface p-7 lg:p-8 border border-stroke hover:border-stroke-strong hover:bg-surface-raised transition-all relative overflow-hidden group"
        >
          <div class="flex flex-col justify-between h-full">
            <div>
              <div
                class="w-12 h-12 rounded-xl bg-surface-raised border border-stroke flex items-center justify-center text-brand-violet mb-6"
              >
                <span class="material-symbols-outlined text-[26px]">smartphone</span>
              </div>
              <h3 class="font-headline-md text-[20px] text-text-strong mb-2.5">
                Aplicativos Mobile Nativos &amp; Híbridos
              </h3>
              <p class="font-body-sm text-body-sm text-text-muted mb-6 leading-relaxed">
                Aplicações iOS e Android com renderização 60fps, sincronização em segundo plano,
                suporte offline-first e integração com hardware.
              </p>
            </div>
            <div class="flex flex-wrap gap-2 pt-4 border-t border-stroke/50">
              <span
                class="font-code text-[12px] px-2.5 py-1 rounded-md bg-surface-container border border-stroke text-text-muted"
              >
                React Native
              </span>
              <span
                class="font-code text-[12px] px-2.5 py-1 rounded-md bg-surface-container border border-stroke text-text-muted"
              >
                Flutter
              </span>
              <span
                class="font-code text-[12px] px-2.5 py-1 rounded-md bg-surface-container border border-stroke text-text-muted"
              >
                Offline-First
              </span>
            </div>
          </div>
        </div>

        <!-- Card 3: APIs & Microservices -->
        <div
          class="rounded-[18px] bg-surface p-7 lg:p-8 border border-stroke hover:border-stroke-strong hover:bg-surface-raised transition-all relative overflow-hidden group"
        >
          <div class="flex flex-col justify-between h-full">
            <div>
              <div
                class="w-12 h-12 rounded-xl bg-surface-raised border border-stroke flex items-center justify-center text-brand-cyan mb-6"
              >
                <span class="material-symbols-outlined text-[26px]">hub</span>
              </div>
              <h3 class="font-headline-md text-[20px] text-text-strong mb-2.5">
                APIs de Alta Escala &amp; Microsserviços
              </h3>
              <p class="font-body-sm text-body-sm text-text-muted mb-6 leading-relaxed">
                Arquiteturas distribuídas event-driven, mensageria assíncrona tolerante a
                particionamentos e barramentos de altíssima taxa de transmissão.
              </p>
            </div>
            <div class="flex flex-wrap gap-2 pt-4 border-t border-stroke/50">
              <span
                class="font-code text-[12px] px-2.5 py-1 rounded-md bg-surface-container border border-stroke text-text-muted"
              >
                gRPC &amp; REST
              </span>
              <span
                class="font-code text-[12px] px-2.5 py-1 rounded-md bg-surface-container border border-stroke text-text-muted"
              >
                Kafka / RabbitMQ
              </span>
              <span
                class="font-code text-[12px] px-2.5 py-1 rounded-md bg-surface-container border border-stroke text-text-muted"
              >
                OpenAPI 3.1
              </span>
            </div>
          </div>
        </div>

        <!-- Card 4: DevOps & Cloud -->
        <div
          class="rounded-[18px] bg-surface p-7 lg:p-8 border border-stroke hover:border-stroke-strong hover:bg-surface-raised transition-all relative overflow-hidden group"
        >
          <div class="flex flex-col justify-between h-full">
            <div>
              <div
                class="w-12 h-12 rounded-xl bg-surface-raised border border-stroke flex items-center justify-center text-primary mb-6"
              >
                <span class="material-symbols-outlined text-[26px]">terminal</span>
              </div>
              <h3 class="font-headline-md text-[20px] text-text-strong mb-2.5">
                Automação de Processos &amp; DevOps
              </h3>
              <p class="font-body-sm text-body-sm text-text-muted mb-6 leading-relaxed">
                Esteiras de CI/CD automatizadas, infraestrutura tratada como código (IaC),
                monitoramento 24/7 com métricas, logs e tracing distribuído.
              </p>
            </div>
            <div class="flex flex-wrap gap-2 pt-4 border-t border-stroke/50">
              <span
                class="font-code text-[12px] px-2.5 py-1 rounded-md bg-surface-container border border-stroke text-text-muted"
              >
                Terraform
              </span>
              <span
                class="font-code text-[12px] px-2.5 py-1 rounded-md bg-surface-container border border-stroke text-text-muted"
              >
                GitHub Actions
              </span>
              <span
                class="font-code text-[12px] px-2.5 py-1 rounded-md bg-surface-container border border-stroke text-text-muted"
              >
                Prometheus
              </span>
            </div>
          </div>
        </div>

        <!-- Card 5: Modernização de Legados -->
        <div
          class="rounded-[18px] bg-surface p-7 lg:p-8 border border-stroke hover:border-stroke-strong hover:bg-surface-raised transition-all relative overflow-hidden group"
        >
          <div class="flex flex-col justify-between h-full">
            <div>
              <div
                class="w-12 h-12 rounded-xl bg-surface-raised border border-stroke flex items-center justify-center text-accent-glow mb-6"
              >
                <span class="material-symbols-outlined text-[26px]">published_with_changes</span>
              </div>
              <h3 class="font-headline-md text-[20px] text-text-strong mb-2.5">
                Modernização &amp; Refatoração de Legados
              </h3>
              <p class="font-body-sm text-body-sm text-text-muted mb-6 leading-relaxed">
                Transição segura de sistemas monolíticos antigos para arquiteturas modulares,
                eliminando gargalos e débito técnico sem paralisação da empresa.
              </p>
            </div>
            <div class="flex flex-wrap gap-2 pt-4 border-t border-stroke/50">
              <span
                class="font-code text-[12px] px-2.5 py-1 rounded-md bg-surface-container border border-stroke text-text-muted"
              >
                Zero-Downtime
              </span>
              <span
                class="font-code text-[12px] px-2.5 py-1 rounded-md bg-surface-container border border-stroke text-text-muted"
              >
                Strangler Pattern
              </span>
              <span
                class="font-code text-[12px] px-2.5 py-1 rounded-md bg-surface-container border border-stroke text-text-muted"
              >
                Clean Arch
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
