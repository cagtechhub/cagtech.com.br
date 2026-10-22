<script setup lang="ts">
import { LANDING_ANCHOR, landingHref } from '~/constants/landingScreen'

const hrefContact = landingHref(LANDING_ANCHOR.contact)
</script>

<template>
  <section
    :id="LANDING_ANCHOR.home"
    class="relative w-full overflow-hidden pb-space-4xl pt-space-xl"
  >
    <!-- Ambient Aurora Glows -->
    <div
      class="absolute -top-24 left-1/4 w-[520px] h-[520px] bg-brand-violet/15 rounded-full blur-[140px] pointer-events-none"
    />
    <div
      class="absolute top-20 right-10 w-[460px] h-[460px] bg-brand-cyan/15 rounded-full blur-[150px] pointer-events-none"
    />

    <div
      class="max-w-[1360px] mx-auto px-6 lg:px-12 flex flex-col items-center text-center relative z-10"
    >
      <!-- Eyebrow Status Badge -->
      <div
        class="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 mb-8 backdrop-blur-md"
      >
        <span class="relative flex h-2 w-2">
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"
          />
          <span class="relative inline-flex rounded-full h-2 w-2 bg-success" />
        </span>
        <span class="font-eyebrow text-eyebrow uppercase text-brand-cyan-light tracking-[0.14em]">
          ● DISPONÍVEL PARA NOVOS PROJETOS
        </span>
      </div>

      <!-- Main Headline -->
      <h1
        class="font-headline-lg text-text-strong text-[40px] sm:text-[54px] lg:text-[72px] leading-[1.08] tracking-[-0.035em] max-w-5xl mb-6"
      >
        Software sob medida, do problema à
        <span
          class="bg-gradient-to-r from-brand-violet via-brand-indigo to-brand-cyan bg-clip-text text-transparent"
        >
          produção
        </span>
      </h1>

      <!-- Subtitle -->
      <p class="font-body-lg text-body-lg text-text-muted max-w-3xl mb-10 leading-relaxed">
        Desenvolvemos plataformas web, aplicativos de alto desempenho, APIs robustas e integrações
        complexas. Engenharia de software com arquitetura limpa, segurança rigorosa e escalabilidade
        garantida.
      </p>

      <!-- Action CTAs -->
      <div class="flex flex-wrap items-center justify-center gap-4 mb-14">
        <a
          class="inline-flex items-center justify-center gap-2.5 h-[52px] px-8 rounded-[10px] bg-gradient-to-r from-brand-violet via-brand-indigo to-brand-cyan text-light-canvas font-body-sm text-body-sm font-semibold shadow-[0_0_28px_rgba(29,182,253,0.35)] hover:shadow-[0_0_40px_rgba(29,182,253,0.55)] hover:-translate-y-0.5 transition-all group"
          :href="hrefContact"
        >
          <span>Iniciar projeto conosco</span>
          <span
            class="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:translate-x-1"
          >
            arrow_forward
          </span>
        </a>
        <a
          class="inline-flex items-center justify-center gap-2 h-[52px] px-7 rounded-[10px] bg-white/[0.03] border border-stroke text-text-strong hover:border-stroke-strong hover:bg-white/[0.06] font-body-sm text-body-sm font-semibold transition-all"
          href="#projetos"
        >
          <span class="material-symbols-outlined text-[18px] text-text-muted">terminal</span>
          <span>Explorar nossos cases</span>
        </a>
      </div>

      <!-- Social Proof Metrics Strip -->
      <div
        class="flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-text-muted font-body-sm text-[13px] border-t border-stroke/60 pt-6 max-w-3xl w-full"
      >
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-brand-cyan text-[18px]">verified</span>
          <span class="text-text-base">
            <strong class="text-text-strong font-semibold">+45</strong> sistemas entregues em
            produção
          </span>
        </div>
        <span class="hidden sm:inline text-stroke">/</span>
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-success text-[18px]">bolt</span>
          <span class="text-text-base">
            <strong class="text-text-strong font-semibold">99.98%</strong> de disponibilidade SLA
          </span>
        </div>
        <span class="hidden sm:inline text-stroke">/</span>
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-brand-violet text-[18px]">public</span>
          <span class="text-text-base">
            <strong class="text-text-strong font-semibold">6 estados</strong> com clientes ativos
          </span>
        </div>
      </div>

      <!-- Interactive UI Mockup Composition (Engineering Console) -->
      <div class="w-full max-w-[1100px] mt-16 relative">
        <!-- Glowing aura under console -->
        <div
          class="absolute inset-x-12 -top-6 h-32 bg-brand-indigo/20 blur-3xl rounded-full pointer-events-none"
        />

        <!-- Main Terminal Panel -->
        <div
          class="relative rounded-2xl bg-surface/90 border border-stroke shadow-[0_30px_80px_-20px_rgba(0,0,0,0.75)] backdrop-blur-2xl overflow-hidden text-left"
        >
          <!-- Terminal Titlebar -->
          <div
            class="h-11 px-4 bg-surface-raised/80 border-b border-stroke/60 flex items-center justify-between"
          >
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-danger/80" />
              <span class="w-3 h-3 rounded-full bg-warning/80" />
              <span class="w-3 h-3 rounded-full bg-success/80" />
              <span class="ml-3 font-code text-[12px] text-text-muted flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[14px]">lock</span>
                cag-cluster-01.brazil-east.internal
              </span>
            </div>
            <div class="hidden sm:flex items-center gap-3 font-eyebrow text-[11px] text-text-muted">
              <span class="px-2 py-0.5 rounded bg-surface border border-stroke text-brand-cyan">
                PROD ENVIRONMENT
              </span>
              <span class="text-success flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-success" />
                SYNCED
              </span>
            </div>
          </div>

          <!-- Console Main Grid -->
          <div
            class="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-stroke/60"
          >
            <!-- Code Editor Window (7 cols) -->
            <div
              class="lg:col-span-7 p-6 font-code text-[13px] leading-relaxed text-text-base bg-surface-container-lowest/50"
            >
              <div
                class="flex items-center justify-between pb-3 mb-3 border-b border-stroke/40 text-[11px] text-text-muted"
              >
                <span>src/services/pipeline.orchestrator.ts</span>
                <span class="text-brand-violet">TypeScript 5.4</span>
              </div>
              <pre
                class="overflow-x-auto space-y-1"
              ><code class="text-text-muted"><span class="text-brand-violet">export interface</span> <span class="text-brand-cyan">DeploymentPipeline</span> {
  id: <span class="text-secondary">string</span>;
  cluster: <span class="text-brand-cyan-light">'k8s-cag-core'</span>;
  healthCheck: <span class="text-brand-violet">() =&gt; Promise</span>&lt;<span class="text-success">SystemHealth</span>&gt;;
}

<span class="text-brand-violet">async function</span> <span class="text-brand-cyan">deployProduction</span>(spec: <span class="text-brand-cyan">DeploymentPipeline</span>) {
  <span class="text-text-muted">// Automated canary release with automatic zero-downtime rollback</span>
  <span class="text-brand-violet">const</span> canary = <span class="text-brand-violet">await</span> cluster.orchestrate({
    canaryTraffic: <span class="text-brand-cyan-light">0.10</span>,
    latencyToleranceMs: <span class="text-brand-cyan-light">25</span>,
    autoPromote: <span class="text-brand-violet">true</span>
  });
  <span class="text-text-muted">// Telemetry verification</span>
  <span class="text-brand-violet">return</span> canary.metrics.status === <span class="text-success">'HEALTHY_OPTIMAL'</span>;
}</code></pre>
            </div>

            <!-- Real-time Telemetry & Live Sparkline (5 cols) -->
            <div class="lg:col-span-5 p-6 flex flex-col justify-between bg-surface/60 space-y-6">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="font-eyebrow text-eyebrow text-text-muted uppercase tracking-wider">
                    // TELEMETRIA EM TEMPO REAL
                  </span>
                  <span
                    class="font-code text-[11px] text-success bg-success/10 px-2 py-0.5 rounded border border-success/30"
                  >
                    ATIVO
                  </span>
                </div>
                <div class="flex items-baseline gap-2">
                  <span class="font-metric-num text-metric-num text-text-strong font-bold">
                    14<span class="text-brand-cyan text-[24px]">ms</span>
                  </span>
                  <span class="font-body-sm text-body-sm text-text-muted">Latência p99 global</span>
                </div>
              </div>

              <!-- Mini SVG Sparkline -->
              <div class="w-full bg-surface-raised p-3 rounded-xl border border-stroke">
                <div
                  class="flex items-center justify-between text-[11px] font-code text-text-muted mb-1"
                >
                  <span>Throughput (2.4k req/s)</span>
                  <span class="text-brand-cyan">+4.2%</span>
                </div>
                <svg class="w-full h-12 text-brand-cyan overflow-visible" viewBox="0 0 260 50">
                  <defs>
                    <linearGradient id="heroSparklineGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stop-color="#1DB6FD" stop-opacity="0.35" />
                      <stop offset="100%" stop-color="#1DB6FD" stop-opacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,38 L25,32 L55,36 L85,20 L115,25 L145,15 L175,22 L205,10 L235,14 L260,8 L260,50 L0,50 Z"
                    fill="url(#heroSparklineGrad)"
                  />
                  <path
                    d="M0,38 L25,32 L55,36 L85,20 L115,25 L145,15 L175,22 L205,10 L235,14 L260,8"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-width="2"
                  />
                  <circle class="fill-brand-cyan animate-pulse" cx="260" cy="8" r="4" />
                </svg>
              </div>

              <!-- Floating Deploy Toast -->
              <div
                class="flex items-center gap-3 p-3 rounded-xl bg-surface-container-high/90 border border-success/30 shadow-lg"
              >
                <div
                  class="w-7 h-7 rounded-lg bg-success/20 flex items-center justify-center shrink-0"
                >
                  <span class="material-symbols-outlined text-success text-[18px]"
                    >check_circle</span
                  >
                </div>
                <div class="flex flex-col text-left">
                  <span class="font-body-sm text-[12px] font-semibold text-text-strong">
                    Deploy #1482 concluído com sucesso
                  </span>
                  <span class="font-code text-[11px] text-text-muted">
                    Promovido para produção em 42 segundos
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
