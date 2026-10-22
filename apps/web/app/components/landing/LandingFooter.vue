<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { LANDING_ANCHOR, landingHref } from '~/constants/landingScreen'

const landing = useLandingStore()
const { brandName, footerEmail, footerPhone, siteCnpj, currentYear } = storeToRefs(landing)

const hrefContact = landingHref(LANDING_ANCHOR.contact)
</script>

<template>
  <div>
    <!-- Section 10: Final CTA Strip -->
    <section class="py-space-3xl relative overflow-hidden">
      <div class="max-w-[1360px] mx-auto px-6 lg:px-12">
        <div
          class="rounded-2xl bg-gradient-to-r from-surface-raised via-surface to-surface-raised border border-stroke p-10 lg:p-14 text-center relative overflow-hidden flex flex-col items-center"
        >
          <!-- Glow background accents -->
          <div
            class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#3F6EFF_0.2,transparent_70%)] pointer-events-none"
          />
          <div class="relative z-10 max-w-2xl flex flex-col items-center">
            <span
              class="font-eyebrow text-eyebrow text-brand-cyan uppercase tracking-[0.14em] mb-4"
            >
              // PRÓXIMO PASSO
            </span>
            <h2 class="font-headline-lg text-[32px] sm:text-[44px] text-text-strong mb-4">
              Vamos construir seu próximo software?
            </h2>
            <p class="font-body-md text-body-md text-text-muted mb-8 max-w-lg">
              Agende uma sessão técnica preliminar com nossos arquitetos de software e valide a
              melhor estratégia técnica para o seu projeto.
            </p>
            <div class="flex flex-wrap items-center justify-center gap-4">
              <a
                class="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-[10px] bg-gradient-to-r from-brand-violet via-brand-indigo to-brand-cyan text-light-canvas font-body-sm text-body-sm font-semibold shadow-[0_0_28px_rgba(29,182,253,0.35)] hover:shadow-[0_0_40px_rgba(29,182,253,0.55)] hover:-translate-y-0.5 transition-all"
                :href="hrefContact"
              >
                <span>Iniciar projeto agora</span>
                <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
              </a>
              <a
                class="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-[10px] bg-white/[0.04] border border-stroke text-text-strong font-body-sm text-body-sm font-semibold hover:bg-white/[0.08] transition-all"
                href="https://wa.me/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>Conversar pelo WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 11: Main Footer -->
    <footer class="relative z-10 w-full bg-surface border-t border-stroke mt-space-4xl">
      <div class="max-w-[1360px] mx-auto px-6 lg:px-12 pt-space-3xl pb-space-2xl">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-gutter lg:gap-8">
          <!-- Col 1: Brand & Status -->
          <div class="lg:col-span-4 flex flex-col items-start gap-4">
            <BrandLogo height-class="h-8" />
            <p class="text-text-muted font-body-sm text-body-sm max-w-sm">
              Do problema ao software em produção, com engenharia de verdade. Arquitetura
              resiliente, código limpo e entregas contínuas.
            </p>
            <div
              class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/30 font-eyebrow text-eyebrow text-success"
            >
              <span class="w-2 h-2 rounded-full bg-success animate-pulse" />
              Sistemas operacionais e disponíveis
            </div>
          </div>

          <!-- Col 2: Serviços -->
          <div class="lg:col-span-3 flex flex-col gap-3">
            <h4
              class="font-headline-md text-[16px] text-text-strong font-semibold tracking-wide uppercase"
            >
              Serviços
            </h4>
            <ul class="flex flex-col gap-2 font-body-sm text-body-sm text-text-muted">
              <li>
                <a class="hover:text-primary transition-colors" href="#servicos">
                  Sistemas Web sob medida
                </a>
              </li>
              <li>
                <a class="hover:text-primary transition-colors" href="#servicos">
                  Aplicativos Mobile
                </a>
              </li>
              <li>
                <a class="hover:text-primary transition-colors" href="#servicos">
                  Integrações e APIs
                </a>
              </li>
              <li>
                <a class="hover:text-primary transition-colors" href="#servicos">
                  Automação &amp; DevOps
                </a>
              </li>
              <li>
                <a class="hover:text-primary transition-colors" href="#servicos">
                  Manutenção &amp; Escala
                </a>
              </li>
            </ul>
          </div>

          <!-- Col 3: Navegação -->
          <div class="lg:col-span-2 flex flex-col gap-3">
            <h4
              class="font-headline-md text-[16px] text-text-strong font-semibold tracking-wide uppercase"
            >
              Navegação
            </h4>
            <ul class="flex flex-col gap-2 font-body-sm text-body-sm text-text-muted">
              <li>
                <a class="hover:text-primary transition-colors" href="#home">Sobre nós</a>
              </li>
              <li>
                <a class="hover:text-primary transition-colors" href="#por-que-a-cag-tech">
                  Metodologia
                </a>
              </li>
              <li>
                <a class="hover:text-primary transition-colors" href="#pacotes">Pacotes</a>
              </li>
              <li>
                <a class="hover:text-primary transition-colors" href="#projetos"
                  >Cases de Sucesso</a
                >
              </li>
              <li>
                <a class="hover:text-primary transition-colors" :href="hrefContact">Contato</a>
              </li>
            </ul>
          </div>

          <!-- Col 4: Atendimento -->
          <div class="lg:col-span-3 flex flex-col gap-3">
            <h4
              class="font-headline-md text-[16px] text-text-strong font-semibold tracking-wide uppercase"
            >
              Atendimento
            </h4>
            <div class="flex flex-col gap-2 font-body-sm text-body-sm text-text-muted">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px] text-brand-cyan"
                  >location_on</span
                >
                <span>Campo Grande, MS · Brasil</span>
              </div>
              <a
                class="flex items-center gap-2 hover:text-text-strong transition-colors"
                :href="`mailto:${footerEmail || 'contato@cagtech.com.br'}`"
              >
                <span class="material-symbols-outlined text-[18px] text-brand-cyan">mail</span>
                <span>{{ footerEmail || 'contato@cagtech.com.br' }}</span>
              </a>
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px] text-brand-cyan">schedule</span>
                <span>Segunda a Sexta, 09h às 18h</span>
              </div>
              <div v-if="footerPhone" class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px] text-brand-cyan">phone</span>
                <span>{{ footerPhone }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Sub-footer copyright -->
        <div
          class="mt-space-2xl pt-6 border-t border-stroke/60 flex flex-col md:flex-row items-center justify-between gap-4 font-body-sm text-[13px] text-text-muted"
        >
          <p>
            © {{ currentYear }} {{ brandName }} Software Engineering. Todos os direitos reservados.
          </p>
          <div class="flex items-center gap-6">
            <a class="hover:text-text-strong transition-colors" href="#">Termos de Uso</a>
            <a class="hover:text-text-strong transition-colors" href="#">Política de Privacidade</a>
            <span class="font-code text-eyebrow text-text-muted/70">
              CNPJ: {{ siteCnpj || '00.000.000/0001-00' }}
            </span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
