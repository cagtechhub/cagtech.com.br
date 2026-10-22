<script setup lang="ts">
import { storeToRefs } from 'pinia'

const landing = useLandingStore()
const { faqItems } = storeToRefs(landing)

const defaultFaqs = [
  {
    question: 'O código-fonte e o repositório pertencem à minha empresa?',
    answer:
      'Sim, 100%. Todo o código-fonte desenvolvido, arquivos de configuração de infraestrutura (IaC), assets visuais e documentação técnica são de propriedade integral e exclusiva da sua empresa sob cláusula explícita em contrato. Sem qualquer tipo de retenção ou dependência tecnológica futura.',
  },
  {
    question: 'Quais são os prazos médios típicos de entrega?',
    answer:
      'MVPs e plataformas menores costumam ser entregues em produção entre 3 a 6 semanas. Projetos corporativos de maior complexidade e sistemas customizados variam de 2 a 5 meses, sempre com releases quinzenais em ambiente de staging funcional para validação contínua.',
  },
  {
    question: 'Como funciona o alinhamento e a comunicação durante o projeto?',
    answer:
      'Operamos com sprints ágeis. Você tem canal direto com o Tech Lead responsável pelo projeto via Slack ou WhatsApp, além de alinhamentos semanais de revisão com demonstração do software funcionando e acesso ao board de tarefas no Jira/Linear.',
  },
  {
    question: 'Existe garantia pós-lançamento contra bugs ou falhas?',
    answer:
      'Sim. Todos os projetos entregues possuem garantia técnica padrão de 60 dias após a entrada oficial em produção, com correção prioritária e sem custos adicionais de qualquer inconformidade referente ao escopo contratado.',
  },
  {
    question: 'Como funciona a sustentação e o suporte contínuo?',
    answer:
      'Oferecemos planos de suporte continuado (SLA de resposta de até 1 hora para incidentes críticos), incluindo monitoramento ativo de telemetria, atualizações periódicas de segurança, backups automatizados e horas dedicadas para evolução contínua do produto.',
  },
]
</script>

<template>
  <section
    id="faq"
    class="py-space-4xl bg-surface-container-lowest/80 border-y border-stroke/60 relative"
  >
    <div class="max-w-[1360px] mx-auto px-6 lg:px-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <!-- Left column: Intro & direct contact helper -->
        <div class="lg:col-span-5 flex flex-col justify-between">
          <div>
            <span class="font-eyebrow text-eyebrow text-brand-violet uppercase tracking-[0.14em]">
              // 06 — DÚVIDAS FREQUENTES
            </span>
            <h2 class="font-headline-lg text-[32px] sm:text-[40px] text-text-strong mt-2 mb-4">
              Tudo o que você precisa saber antes de iniciar
            </h2>
            <p class="font-body-md text-body-md text-text-muted mb-8 leading-relaxed">
              Acreditamos em contratos transparentes e expectativas alinhadas desde o minuto zero.
              Se a sua dúvida não estiver aqui, nosso time responde no mesmo dia.
            </p>
          </div>

          <div class="p-6 rounded-2xl bg-surface border border-stroke space-y-4">
            <div class="flex items-center gap-3">
              <div
                class="w-9 h-9 rounded-lg bg-brand-cyan/15 flex items-center justify-center text-brand-cyan"
              >
                <span class="material-symbols-outlined text-[20px]">chat</span>
              </div>
              <div>
                <span class="font-body-sm text-body-sm font-semibold text-text-strong block">
                  Prefere conversar em tempo real?
                </span>
                <span class="font-code text-[12px] text-text-muted">
                  Tempo médio de resposta: 15 minutos
                </span>
              </div>
            </div>
            <a
              class="flex items-center justify-center gap-2 w-full h-11 rounded-[10px] bg-white/[0.04] border border-stroke hover:border-brand-cyan/50 text-text-strong font-body-sm text-body-sm font-medium hover:bg-white/[0.08] transition-all"
              href="https://wa.me/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span>Falar diretamente via WhatsApp</span>
              <span class="material-symbols-outlined text-[16px] text-brand-cyan">open_in_new</span>
            </a>
          </div>
        </div>

        <!-- Right column: Accordion List -->
        <div class="lg:col-span-7 flex flex-col divide-y divide-stroke/80">
          <details
            v-for="(faq, index) in faqItems.length >= 5 ? faqItems : defaultFaqs"
            :key="faq.question"
            class="group py-5 text-left cursor-pointer"
            :open="index === 0"
          >
            <summary
              class="flex items-center justify-between font-headline-md text-[18px] text-text-strong list-none hover:text-brand-cyan transition-colors"
            >
              <span>{{ faq.question }}</span>
              <span
                class="material-symbols-outlined text-text-muted transition-transform duration-300 group-open:rotate-45"
              >
                add
              </span>
            </summary>
            <div
              class="mt-4 font-body-md text-[15px] text-text-muted leading-relaxed pl-3 border-l-2 border-brand-cyan"
            >
              {{ faq.answer }}
            </div>
          </details>
        </div>
      </div>
    </div>
  </section>
</template>
