<script setup lang="ts">
import { storeToRefs } from 'pinia'

const landing = useLandingStore()
const { showcaseProjects } = storeToRefs(landing)

const categories = ['Todos', 'Sistemas Web', 'Mobile', 'APIs & Cloud']
const activeCategory = ref('Todos')

// Default cases for fallback / reference when CMS has few items
const defaultCases = [
  {
    id: 'case-logistica',
    name: 'Portal Omnichannel de Roteirização e Logística',
    clientName: 'LogiTech Brasil',
    category: 'Sistemas Web',
    siteUrl: '#contato',
    description:
      'Desenvolvimento de portal operacional centralizado conectando 14 centros de distribuição. Automatizou o algoritmo de despacho com telemetria GPS e cálculo de rota em tempo real.',
    urlLabel: 'app.logistica-express.io/fleet',
    categoryBadge: 'LOGÍSTICA & SUPPLY CHAIN',
    metricValue: '-65%',
    metricLabel: 'tempo de despacho',
    techs: ['Node.js', 'React Dashboard', 'Redis Pub/Sub', 'PostgreSQL PostGIS'],
    accent: 'cyan',
    status: 'LIVE',
    galleryUrls: [] as string[],
  },
  {
    id: 'case-fintech',
    name: 'Fintech Core Banking & Pix Engine Assíncrono',
    clientName: 'Nexa Pay',
    category: 'APIs & Cloud',
    siteUrl: '#contato',
    description:
      'Infraestrutura de conciliação bancária de alta confiabilidade projetada para absorver picos repentinos de pagamentos Pix, com barramento redundante e auditoria imutável.',
    urlLabel: 'api.fintech-core.cag.tech/metrics',
    categoryBadge: 'FINTECH & PAGAMENTOS',
    metricValue: '+50k',
    metricLabel: 'transações/dia',
    techs: ['Go (Golang)', 'Apache Kafka', 'Docker & K8s', 'AWS FinTech Infra'],
    accent: 'violet',
    status: 'STREAMING',
    galleryUrls: [] as string[],
  },
]

const displayProjects = computed(() => {
  const merged = [...showcaseProjects.value]
  // If fewer than 2 items in showcase, augment with default cases
  if (merged.length < 2) {
    for (const d of defaultCases) {
      if (!merged.some((m) => m.name.toLowerCase() === d.name.toLowerCase())) {
        merged.push({
          id: d.id,
          name: d.name,
          clientName: d.clientName,
          category: d.category,
          description: d.description,
          siteUrl: d.siteUrl,
          galleryUrls: d.galleryUrls,
        })
      }
    }
  }

  if (activeCategory.value === 'Todos') {
    return merged
  }

  return merged.filter((p) => {
    const cat = (p.category || 'Sistemas Web').toLowerCase()
    return (
      cat.includes(activeCategory.value.toLowerCase()) ||
      activeCategory.value.toLowerCase().includes(cat)
    )
  })
})

// Carousel navigation state per project card
const carouselState = reactive<Record<string, number>>({})

const getActiveSlide = (key: string, total: number) => {
  if (total <= 0) return 0
  const cur = carouselState[key] ?? 0
  return ((cur % total) + total) % total
}

const prevSlide = (key: string, total: number) => {
  if (total <= 1) return
  carouselState[key] = getActiveSlide(key, total) - 1
}

const nextSlide = (key: string, total: number) => {
  if (total <= 1) return
  carouselState[key] = getActiveSlide(key, total) + 1
}

const setSlide = (key: string, idx: number) => {
  carouselState[key] = idx
}
</script>

<template>
  <section
    id="projetos"
    class="py-space-4xl bg-surface-container-lowest/80 border-y border-stroke/60 relative"
  >
    <div class="max-w-[1360px] mx-auto px-6 lg:px-12">
      <!-- Section Header with Filter Pills -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span class="font-eyebrow text-eyebrow text-brand-violet uppercase tracking-[0.14em]">
            // 04 — CASES DE SUCESSO
          </span>
          <h2
            class="font-headline-lg text-[32px] sm:text-[44px] lg:text-[48px] text-text-strong mt-2"
          >
            O que já colocamos em produção
          </h2>
        </div>

        <!-- Filter Pills -->
        <div
          class="flex items-center gap-2 p-1 rounded-xl bg-surface border border-stroke shrink-0 overflow-x-auto"
        >
          <button
            v-for="cat in categories"
            :key="cat"
            type="button"
            :class="[
              'px-4 py-1.5 rounded-lg font-body-sm text-body-sm transition-colors whitespace-nowrap cursor-pointer',
              activeCategory === cat
                ? 'text-text-strong bg-surface-raised font-semibold border border-stroke'
                : 'text-text-muted hover:text-text-strong',
            ]"
            @click="activeCategory = cat"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Projects Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div
          v-for="(project, index) in displayProjects"
          :key="project.id || `${project.name}-${index}`"
          class="rounded-2xl bg-surface border border-stroke overflow-hidden group hover:border-brand-cyan/50 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <!-- Window Header Bar -->
            <div
              class="h-10 px-4 bg-surface-raised border-b border-stroke flex items-center justify-between"
            >
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-stroke-strong" />
                <span class="w-2.5 h-2.5 rounded-full bg-stroke-strong" />
                <span class="w-2.5 h-2.5 rounded-full bg-stroke-strong" />
                <span class="font-code text-[11px] text-text-muted ml-2">
                  {{
                    project.siteUrl
                      ? project.siteUrl.replace(/^https?:\/\//, '')
                      : 'cag.tech/cases/' + (index + 1)
                  }}
                </span>
              </div>
              <span class="font-code text-[11px] text-success flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-success" />
                {{ index % 2 === 0 ? 'LIVE' : 'STREAMING' }}
              </span>
            </div>

            <!-- CARROSSEL DE IMAGENS QUANDO HOUVER GALERIA CADASTRADA -->
            <div
              v-if="(project.galleryUrls || project.gallery || []).length > 0"
              class="h-64 sm:h-72 bg-surface-raised relative overflow-hidden group/carousel"
            >
              <div class="absolute inset-0">
                <img
                  :src="
                    (project.galleryUrls?.length ? project.galleryUrls : project.gallery)![
                      getActiveSlide(
                        project.name,
                        (project.galleryUrls || project.gallery || []).length
                      )
                    ]
                  "
                  :alt="project.name"
                  class="w-full h-full object-cover transition-all duration-300"
                />
              </div>

              <!-- Overlay gradient -->
              <div
                class="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-surface to-transparent pointer-events-none"
              />

              <!-- Top category chip inside image -->
              <div class="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span
                  class="px-3 py-1 rounded bg-black/60 backdrop-blur-md text-brand-cyan font-code text-[11px] border border-brand-cyan/30"
                >
                  {{ project.category || 'CASE TÉCNICO' }}
                </span>
              </div>

              <!-- Counter badge top-right -->
              <div class="absolute top-4 right-4 z-10">
                <span
                  class="px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-white font-mono text-[11px] border border-white/10"
                >
                  {{
                    getActiveSlide(
                      project.name,
                      (project.galleryUrls || project.gallery || []).length
                    ) + 1
                  }}
                  /
                  {{ (project.galleryUrls || project.gallery || []).length }}
                </span>
              </div>

              <!-- Navigation arrows -->
              <div
                v-if="(project.galleryUrls || project.gallery || []).length > 1"
                class="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between z-10 opacity-0 group-hover/carousel:opacity-100 transition-opacity"
              >
                <button
                  type="button"
                  class="h-8 w-8 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
                  aria-label="Imagem anterior"
                  @click="
                    prevSlide(project.name, (project.galleryUrls || project.gallery || []).length)
                  "
                >
                  <span class="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button
                  type="button"
                  class="h-8 w-8 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
                  aria-label="Próxima imagem"
                  @click="
                    nextSlide(project.name, (project.galleryUrls || project.gallery || []).length)
                  "
                >
                  <span class="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>

              <!-- Pagination dots -->
              <div
                v-if="(project.galleryUrls || project.gallery || []).length > 1"
                class="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5"
              >
                <button
                  v-for="(_, dotIdx) in (project.galleryUrls || project.gallery || []).length"
                  :key="dotIdx"
                  type="button"
                  class="h-1.5 rounded-full transition-all cursor-pointer"
                  :class="
                    getActiveSlide(
                      project.name,
                      (project.galleryUrls || project.gallery || []).length
                    ) === dotIdx
                      ? 'w-5 bg-brand-cyan'
                      : 'w-1.5 bg-white/40 hover:bg-white/70'
                  "
                  :aria-label="`Ir para imagem ${dotIdx + 1}`"
                  @click="setSlide(project.name, dotIdx)"
                />
              </div>
            </div>

            <!-- SIMULATED DASHBOARD / METRICS PREVIEW QUANDO NÃO HOUVER FOTO CADASTRADA (MOCKUP STITCH) -->
            <div
              v-else-if="index % 2 === 0"
              class="h-64 sm:h-72 bg-gradient-to-br from-surface-raised to-surface p-6 flex flex-col justify-between relative overflow-hidden"
            >
              <div
                class="absolute inset-0 bg-[radial-gradient(#1DB6FD_1px,transparent_1px)] [background-size:16px_16px] opacity-10"
              />
              <div class="relative z-10 flex items-center justify-between">
                <span
                  class="px-3 py-1 rounded bg-brand-cyan/15 text-brand-cyan font-code text-[11px] border border-brand-cyan/30"
                >
                  {{
                    project.category ? project.category.toUpperCase() : 'LOGÍSTICA & SUPPLY CHAIN'
                  }}
                </span>
                <span class="font-metric-num text-[28px] font-bold text-text-strong">
                  -65%
                  <span class="text-[14px] text-text-muted font-normal">tempo de despacho</span>
                </span>
              </div>

              <!-- Dashboard Mini Mockup Element inside -->
              <div
                class="relative z-10 rounded-xl bg-surface-container/90 border border-stroke/80 p-4 shadow-xl"
              >
                <div class="flex items-center justify-between mb-3">
                  <span class="font-code text-[12px] text-text-strong font-medium truncate">
                    {{ project.name }}
                  </span>
                  <span class="font-eyebrow text-[11px] text-success">98.4% EFICIÊNCIA</span>
                </div>
                <div class="grid grid-cols-3 gap-2 text-center">
                  <div class="p-2 rounded bg-surface/80 border border-stroke/40">
                    <span class="text-[10px] text-text-muted block font-code">VEÍCULOS ATIVOS</span>
                    <span class="text-[15px] font-bold text-text-strong">1.240</span>
                  </div>
                  <div class="p-2 rounded bg-surface/80 border border-stroke/40">
                    <span class="text-[10px] text-text-muted block font-code">ENTREGAS/DIA</span>
                    <span class="text-[15px] font-bold text-brand-cyan">18.950</span>
                  </div>
                  <div class="p-2 rounded bg-surface/80 border border-stroke/40">
                    <span class="text-[10px] text-text-muted block font-code">UPTIME</span>
                    <span class="text-[15px] font-bold text-success">99.99%</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- TERMINAL OUTPUT PREVIEW ALTERNADO -->
            <div
              v-else
              class="h-64 sm:h-72 bg-gradient-to-br from-surface-raised to-surface p-6 flex flex-col justify-between relative overflow-hidden"
            >
              <div
                class="absolute inset-0 bg-[radial-gradient(#C464FF_1px,transparent_1px)] [background-size:16px_16px] opacity-10"
              />
              <div class="relative z-10 flex items-center justify-between">
                <span
                  class="px-3 py-1 rounded bg-brand-violet/15 text-brand-violet font-code text-[11px] border border-brand-violet/30"
                >
                  {{ project.category ? project.category.toUpperCase() : 'FINTECH & PAGAMENTOS' }}
                </span>
                <span class="font-metric-num text-[28px] font-bold text-text-strong">
                  +50k <span class="text-[14px] text-text-muted font-normal">transações/dia</span>
                </span>
              </div>

              <!-- Mini Terminal Output Mockup -->
              <div
                class="relative z-10 rounded-xl bg-surface-container-lowest/90 border border-stroke/80 p-4 shadow-xl font-code text-[12px] text-text-base"
              >
                <div class="flex items-center justify-between text-text-muted mb-2 text-[11px]">
                  <span>ENGINE V3 — CORE PIPELINE</span>
                  <span class="text-success">0.00% ERROS</span>
                </div>
                <div class="space-y-1 text-text-muted text-[11px]">
                  <div>&gt; [PROD] Batch telemetry assíncrona processado em 18ms</div>
                  <div class="text-text-strong">
                    &gt; Failover automático:
                    <span class="text-success">0 segundos de indisponibilidade</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Case Details -->
            <div class="p-7">
              <div class="flex items-center justify-between gap-3 mb-2">
                <h3 class="font-headline-md text-[22px] text-text-strong">
                  {{ project.name }}
                </h3>
                <span v-if="project.clientName" class="text-xs font-code text-text-muted shrink-0">
                  // {{ project.clientName }}
                </span>
              </div>

              <p class="font-body-sm text-body-sm text-text-muted mb-6 leading-relaxed">
                {{
                  project.description ||
                  'Arquitetura em microsserviços e frontends modernos, integrando barramentos de alta capacidade e infraestrutura resiliente na nuvem.'
                }}
              </p>

              <div class="flex flex-wrap gap-2 mb-6">
                <span
                  class="font-code text-[12px] px-2.5 py-1 rounded bg-surface-raised border border-stroke text-text-muted"
                >
                  Node.js / Go
                </span>
                <span
                  class="font-code text-[12px] px-2.5 py-1 rounded bg-surface-raised border border-stroke text-text-muted"
                >
                  Nuxt / React
                </span>
                <span
                  class="font-code text-[12px] px-2.5 py-1 rounded bg-surface-raised border border-stroke text-text-muted"
                >
                  PostgreSQL
                </span>
                <span
                  class="font-code text-[12px] px-2.5 py-1 rounded bg-surface-raised border border-stroke text-text-muted"
                >
                  Docker &amp; K8s
                </span>
              </div>

              <a
                v-if="project.siteUrl"
                :href="project.siteUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 font-body-sm text-body-sm text-brand-cyan hover:text-brand-cyan-light font-medium group-hover:underline"
              >
                <span>Ver projeto ao vivo</span>
                <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
              <a
                v-else
                href="#contato"
                class="inline-flex items-center gap-1.5 font-body-sm text-body-sm text-brand-cyan hover:text-brand-cyan-light font-medium group-hover:underline"
              >
                <span>Solicitar estudo de caso detalhado</span>
                <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
