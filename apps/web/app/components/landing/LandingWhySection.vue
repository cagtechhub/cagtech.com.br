<script setup lang="ts">
const metrics = [
  {
    value: '100%',
    color: 'text-brand-cyan',
    title: 'Tipagem & Testes',
    description:
      'Código com tipagem estrita e cobertura de testes automatizados unitários e de integração.',
  },
  {
    value: '14 dias',
    color: 'text-brand-violet',
    title: 'Staging Funcional',
    description:
      'Primeira versão executável disponível em ambiente de homologação para testes reais.',
  },
  {
    value: '0',
    color: 'text-text-strong',
    title: 'Vendor Lock-in',
    description:
      'Propriedade intelectual 100% sua: repositório Git, documentação de arquitetura e infra.',
  },
  {
    value: '99.98%',
    color: 'text-success',
    title: 'SLA de Produção',
    description: 'Disponibilidade média sustentada em todas as aplicações sob nosso gerenciamento.',
  },
]

const pipelineSteps = [
  {
    step: '01 / DISCOVERY',
    color: 'text-brand-cyan',
    title: 'Descoberta & Arquitetura',
    description:
      'Mapeamento de regras de negócio, modelagem de dados e especificação técnica de infraestrutura.',
    badgeIcon: 'schema',
    badgeText: 'Diagrama C4',
  },
  {
    step: '02 / UI & PROTÓTIPO',
    color: 'text-brand-violet',
    title: 'Design & Fluxos',
    description:
      'Criação de design system, fluxos de uso refinados e validação com os stakeholders.',
    badgeIcon: 'devices',
    badgeText: 'Protótipo interativo',
  },
  {
    step: '03 / SPRINTS',
    color: 'text-brand-indigo',
    title: 'Desenvolvimento Ágil',
    description:
      'Ciclos quinzenais de entrega, deploy contínuo em staging e acesso direto ao repositório.',
    badgeIcon: 'commit',
    badgeText: 'Git branches diárias',
  },
  {
    step: '04 / QA & SECURITY',
    color: 'text-brand-cyan',
    title: 'Testes & Hardening',
    description:
      'Testes de carga, validação de segurança OWASP Top 10 e auditoria de vulnerabilidades.',
    badgeIcon: 'security',
    badgeText: 'Auditoria e Pentest',
  },
  {
    step: '05 / PRODUCTION',
    color: 'text-success',
    title: 'Deploy & Suporte',
    description:
      'Deploy monitorado em produção, telemetria em tempo real e suporte operacional contínuo.',
    badgeIcon: 'speed',
    badgeText: '24/7 APM Ativo',
  },
]
</script>

<template>
  <section
    id="por-que-a-cag-tech"
    class="py-space-4xl bg-surface-container-lowest/80 border-y border-stroke/60 relative"
  >
    <div class="max-w-[1360px] mx-auto px-6 lg:px-12">
      <!-- Section Intro Header -->
      <div class="flex flex-col items-center text-center gap-3 mb-20">
        <span class="font-eyebrow text-eyebrow text-brand-violet uppercase tracking-[0.14em]">
          // 02 — NOSSO MÉTODO
        </span>
        <h2
          class="font-headline-lg text-[32px] sm:text-[44px] lg:text-[48px] text-text-strong max-w-2xl"
        >
          Engenharia de verdade, sem caixas pretas
        </h2>
        <p class="font-body-md text-body-md text-text-muted max-w-xl">
          Transparência algorítmica e previsibilidade em cada linha de código. Você acompanha a
          evolução em tempo real.
        </p>
      </div>

      <!-- 4 Key Engineering Metrics -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
        <div
          v-for="metric in metrics"
          :key="metric.title"
          class="p-6 rounded-2xl bg-surface border border-stroke relative"
        >
          <div :class="['font-metric-num text-metric-num mb-2 font-bold', metric.color]">
            {{ metric.value }}
          </div>
          <h4 class="font-headline-md text-[17px] text-text-strong mb-1">
            {{ metric.title }}
          </h4>
          <p class="font-body-sm text-body-sm text-text-muted">
            {{ metric.description }}
          </p>
        </div>
      </div>

      <!-- 5-Step Pipeline Process -->
      <div class="flex flex-col gap-8">
        <div class="flex items-center justify-between">
          <h3 class="font-headline-md text-headline-md text-text-strong">
            Pipeline de Desenvolvimento CAG Tech
          </h3>
          <span class="font-eyebrow text-eyebrow text-text-muted uppercase">
            CONTINUOUS DELIVERY
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          <div
            v-for="step in pipelineSteps"
            :key="step.step"
            class="p-5 rounded-xl bg-surface border border-stroke flex flex-col justify-between"
          >
            <div>
              <span :class="['font-code text-[12px] mb-3 block', step.color]">
                {{ step.step }}
              </span>
              <h5 class="font-headline-md text-[16px] text-text-strong mb-2">
                {{ step.title }}
              </h5>
              <p class="font-body-sm text-[13px] text-text-muted leading-relaxed">
                {{ step.description }}
              </p>
            </div>
            <div
              class="mt-4 pt-3 border-t border-stroke/40 font-code text-[11px] text-text-muted flex items-center gap-1"
            >
              <span :class="['material-symbols-outlined text-[14px]', step.color]">
                {{ step.badgeIcon }}
              </span>
              {{ step.badgeText }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
