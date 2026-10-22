<script setup lang="ts">
import type { SiteSettings } from '@cagtech/shared'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

const api = useAdminApi()
const notify = useNotify()
const error = ref('')
const loading = ref(true)
const saving = ref(false)

const tabs = [
  { id: 'geral', label: 'Geral & SEO', icon: 'public' },
  { id: 'contato', label: 'Contato & Redes', icon: 'contact_phone' },
  { id: 'form', label: 'Formulário de Contato', icon: 'assignment' },
  { id: 'textos', label: 'Textos da Landing', icon: 'description' },
  { id: 'analytics', label: 'Analytics & Tags', icon: 'analytics' },
] as const

type TabId = (typeof tabs)[number]['id']
const activeTab = ref<TabId>('geral')

const form = reactive({
  siteUrl: '',
  siteName: '',
  seoLocality: '',
  cnpj: '',
  noIndex: false,
  businessAddress: '',
  businessPhone: '',
  contactEmail: '',
  whatsappNumber: '',
  whatsappMessage: '',
  instagramUrl: '',
  facebookUrl: '',
  linkedinUrl: '',
  defaultOgImageUrl: '',
  ga4MeasurementId: '',
  metaPixelId: '',
  googleAdsenseAccount: '',
  mapsEmbedUrl: '',
  geoLatitude: '',
  geoLongitude: '',
  packagesIntroTitle: '',
  packagesIntroBody: '',
  initialProjectTitle: '',
  initialProjectLead: '',
  initialProjectBulletsText: '',
  contactProjectTypesText: '',
  contactBudgetRangesText: '',
})

const applySettings = (item: SiteSettings) => {
  form.siteUrl = item.siteUrl
  form.siteName = item.siteName
  form.seoLocality = item.seoLocality
  form.cnpj = item.cnpj || ''
  form.noIndex = item.noIndex
  form.businessAddress = item.businessAddress
  form.businessPhone = item.businessPhone
  form.contactEmail = item.contactEmail
  form.whatsappNumber = item.whatsappNumber
  form.whatsappMessage = item.whatsappMessage
  form.instagramUrl = item.instagramUrl
  form.facebookUrl = item.facebookUrl
  form.linkedinUrl = item.linkedinUrl
  form.defaultOgImageUrl = item.defaultOgImageUrl
  form.ga4MeasurementId = item.ga4MeasurementId
  form.metaPixelId = item.metaPixelId
  form.googleAdsenseAccount = item.googleAdsenseAccount
  form.mapsEmbedUrl = item.mapsEmbedUrl
  form.geoLatitude = item.geoLatitude
  form.geoLongitude = item.geoLongitude
  form.packagesIntroTitle = item.packagesIntroTitle
  form.packagesIntroBody = item.packagesIntroBody
  form.initialProjectTitle = item.initialProjectTitle
  form.initialProjectLead = item.initialProjectLead
  form.initialProjectBulletsText = (item.initialProjectBullets || []).join('\n')
  form.contactProjectTypesText = (
    item.contactProjectTypes?.length
      ? item.contactProjectTypes
      : ['Sistema Web / SaaS', 'Aplicativo Mobile', 'Integração & APIs', 'Squad Dedicado']
  ).join('\n')
  form.contactBudgetRangesText = (
    item.contactBudgetRanges?.length
      ? item.contactBudgetRanges
      : [
          'Até R$ 20.000 (MVP / Escopo pontual)',
          'R$ 20.000 a R$ 50.000 (Sistema sob medida)',
          'R$ 50.000 a R$ 120.000 (Plataforma complexa / Escala)',
          'Acima de R$ 120.000 / Squad Dedicado contínuo',
        ]
  ).join('\n')
}

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    applySettings(await api.getSettings())
  } catch {
    error.value = 'Não foi possível carregar as configurações.'
  } finally {
    loading.value = false
  }
}

const onSubmit = async () => {
  saving.value = true
  error.value = ''
  try {
    const updated = await api.updateSettings({
      ...form,
      initialProjectBullets: form.initialProjectBulletsText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
      contactProjectTypes: form.contactProjectTypesText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
      contactBudgetRanges: form.contactBudgetRangesText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
    })
    applySettings(updated)
    notify.success(
      'Configurações salvas!',
      'Os dados foram atualizados com sucesso na landing pública.'
    )
  } catch {
    error.value = 'Falha ao salvar configurações.'
    notify.error('Erro ao salvar', 'Verifique os dados e tente novamente.')
  } finally {
    saving.value = false
  }
}

await load()
</script>

<template>
  <div class="max-w-4xl space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <span class="font-mono text-xs uppercase tracking-[0.14em] text-brand-cyan">
          // SISTEMA &amp; CONTEÚDO
        </span>
        <h2 class="mt-1 font-display text-3xl font-semibold text-text-strong">
          Configurações do site
        </h2>
        <p class="mt-1 text-sm text-text-muted">
          SEO, dados da empresa, formulário de conversão e rastreamento.
        </p>
      </div>

      <button
        type="button"
        class="brand-button self-start sm:self-auto cursor-pointer"
        :disabled="saving"
        @click="onSubmit"
      >
        <span class="material-symbols-outlined text-[18px]">save</span>
        <span>{{ saving ? 'Salvando…' : 'Salvar alterações' }}</span>
      </button>
    </div>

    <!-- Tabs Navigation -->
    <div class="flex items-center gap-2 border-b border-stroke pb-px overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="flex items-center gap-2 px-4 py-3 font-body-sm text-[13px] font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer"
        :class="
          activeTab === tab.id
            ? 'border-brand-cyan text-brand-cyan bg-brand-cyan/5 rounded-t-lg'
            : 'border-transparent text-text-muted hover:text-text-strong hover:bg-surface-raised/50 rounded-t-lg'
        "
        @click="activeTab = tab.id"
      >
        <span class="material-symbols-outlined text-[18px]">{{ tab.icon }}</span>
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <p v-if="loading" class="text-sm text-text-muted">Carregando dados…</p>
    <p v-else-if="error && !form.siteName" class="text-sm text-danger">{{ error }}</p>

    <form v-else class="surface space-y-6 p-6 sm:p-8" @submit.prevent="onSubmit">
      <!-- TAB 1: GERAL & SEO -->
      <div v-show="activeTab === 'geral'" class="space-y-4">
        <h3
          class="font-display text-lg font-semibold text-text-strong pb-2 border-b border-stroke/60"
        >
          Identificação da Marca e SEO
        </h3>
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="block text-sm text-text-muted">
            Nome oficial do site / Marca *
            <input v-model="form.siteName" class="field-control mt-1.5" required />
          </label>
          <label class="block text-sm text-text-muted">
            URL principal do site
            <input
              v-model="form.siteUrl"
              class="field-control mt-1.5"
              placeholder="https://www.cagtech.com.br"
            />
          </label>
          <label class="block text-sm text-text-muted">
            CNPJ da empresa
            <input
              v-model="form.cnpj"
              class="field-control mt-1.5"
              placeholder="00.000.000/0001-00"
            />
            <span class="text-xs text-text-muted/70 mt-1 block">
              Exibido no rodapé oficial do site e documentação.
            </span>
          </label>
          <label class="block text-sm text-text-muted">
            Localidade de SEO (Cidade/Estado)
            <input
              v-model="form.seoLocality"
              class="field-control mt-1.5"
              placeholder="Campo Grande, MS"
            />
          </label>
          <label class="block text-sm text-text-muted sm:col-span-2">
            Imagem Open Graph padrão (URL ou caminho relativo)
            <input
              v-model="form.defaultOgImageUrl"
              class="field-control mt-1.5"
              placeholder="/og-default.png"
            />
          </label>
          <div class="sm:col-span-2 pt-2">
            <label class="inline-flex items-center gap-2.5 text-sm text-text-strong cursor-pointer">
              <input
                v-model="form.noIndex"
                type="checkbox"
                class="h-4 w-4 rounded border-stroke bg-surface-raised text-brand-cyan focus:ring-brand-cyan/50"
              />
              <span>Ativar No-index (Bloquear indexação no Google / modo teste)</span>
            </label>
          </div>
        </div>
      </div>

      <!-- TAB 2: CONTATO & REDES -->
      <div v-show="activeTab === 'contato'" class="space-y-4">
        <h3
          class="font-display text-lg font-semibold text-text-strong pb-2 border-b border-stroke/60"
        >
          Informações de Contato e Canais
        </h3>
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="block text-sm text-text-muted">
            E-mail comercial de contato
            <input
              v-model="form.contactEmail"
              type="email"
              class="field-control mt-1.5"
              placeholder="contato@cagtech.com.br"
            />
          </label>
          <label class="block text-sm text-text-muted">
            Telefone comercial
            <input
              v-model="form.businessPhone"
              class="field-control mt-1.5"
              placeholder="+55 67 99888-0000"
            />
          </label>
          <label class="block text-sm text-text-muted">
            WhatsApp (DDI + DDD + Número)
            <input
              v-model="form.whatsappNumber"
              class="field-control mt-1.5"
              placeholder="5567998880000"
            />
          </label>
          <label class="block text-sm text-text-muted">
            Mensagem pré-definida do WhatsApp
            <input
              v-model="form.whatsappMessage"
              class="field-control mt-1.5"
              placeholder="Olá! Gostaria de conversar com a equipe técnica da CAG Tech."
            />
          </label>
          <label class="block text-sm text-text-muted sm:col-span-2">
            Endereço comercial completo
            <input
              v-model="form.businessAddress"
              class="field-control mt-1.5"
              placeholder="Campo Grande, MS · Brasil"
            />
          </label>
          <label class="block text-sm text-text-muted">
            Instagram (URL completa)
            <input
              v-model="form.instagramUrl"
              class="field-control mt-1.5"
              placeholder="https://instagram.com/..."
            />
          </label>
          <label class="block text-sm text-text-muted">
            LinkedIn (URL completa)
            <input
              v-model="form.linkedinUrl"
              class="field-control mt-1.5"
              placeholder="https://linkedin.com/company/..."
            />
          </label>
          <label class="block text-sm text-text-muted sm:col-span-2">
            Facebook (URL completa)
            <input
              v-model="form.facebookUrl"
              class="field-control mt-1.5"
              placeholder="https://facebook.com/..."
            />
          </label>
          <label class="block text-sm text-text-muted sm:col-span-2">
            URL Embed Google Maps (iframe src)
            <textarea
              v-model="form.mapsEmbedUrl"
              rows="2"
              class="field-control mt-1.5 font-code text-xs"
              placeholder="https://www.google.com/maps/embed?..."
            />
          </label>
        </div>
      </div>

      <!-- TAB 3: FORMULÁRIO DE CONTATO (CONFIGURÁVEL) -->
      <div v-show="activeTab === 'form'" class="space-y-6">
        <div>
          <h3
            class="font-display text-lg font-semibold text-text-strong pb-2 border-b border-stroke/60"
          >
            Configuração do Formulário de Conversão
          </h3>
          <p class="mt-2 text-sm text-text-muted">
            Personalize as opções que os leads verão na seção de contato da landing page. Digite uma
            opção por linha.
          </p>
        </div>

        <div class="grid gap-6 sm:grid-cols-2">
          <!-- Tipos de projeto -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="font-body-sm text-[13px] font-semibold text-text-strong">
                Tipo de Projeto Principal (Tags)
              </label>
              <span class="font-code text-[11px] text-brand-cyan">1 por linha</span>
            </div>
            <p class="text-xs text-text-muted">
              Aparecerão como chips selecionáveis (ex.: Sistema Web / SaaS, Aplicativo Mobile).
            </p>
            <textarea
              v-model="form.contactProjectTypesText"
              rows="6"
              class="field-control font-code text-xs leading-relaxed"
              placeholder="Sistema Web / SaaS&#10;Aplicativo Mobile&#10;Integração & APIs&#10;Squad Dedicado"
            />
          </div>

          <!-- Faixas de investimento -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="font-body-sm text-[13px] font-semibold text-text-strong">
                Faixa de Investimento Estimada
              </label>
              <span class="font-code text-[11px] text-brand-cyan">1 por linha</span>
            </div>
            <p class="text-xs text-text-muted">
              Opções do seletor suspenso de orçamento estimado do cliente.
            </p>
            <textarea
              v-model="form.contactBudgetRangesText"
              rows="6"
              class="field-control font-code text-xs leading-relaxed"
              placeholder="Até R$ 20.000 (MVP / Escopo pontual)&#10;R$ 20.000 a R$ 50.000 (Sistema sob medida)&#10;R$ 50.000 a R$ 120.000 (Plataforma complexa / Escala)&#10;Acima de R$ 120.000 / Squad Dedicado contínuo"
            />
          </div>
        </div>

        <!-- Preview da visualização do formulário -->
        <div class="rounded-xl border border-stroke bg-surface-container-lowest/60 p-5 space-y-3">
          <span class="font-mono text-xs uppercase tracking-wider text-brand-cyan block">
            // PRÉVIA DAS OPÇÕES ATIVAS
          </span>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(t, i) in form.contactProjectTypesText.split('\n').filter(Boolean)"
              :key="i"
              class="px-3 py-1 rounded-lg border border-stroke bg-surface text-text-muted font-body-sm text-xs"
            >
              {{ t }}
            </span>
          </div>
        </div>
      </div>

      <!-- TAB 4: TEXTOS DA LANDING -->
      <div v-show="activeTab === 'textos'" class="space-y-4">
        <h3
          class="font-display text-lg font-semibold text-text-strong pb-2 border-b border-stroke/60"
        >
          Seções Customizáveis da Landing
        </h3>
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="block text-sm text-text-muted sm:col-span-2">
            Título da seção Pacotes
            <input v-model="form.packagesIntroTitle" class="field-control mt-1.5" />
          </label>
          <label class="block text-sm text-text-muted sm:col-span-2">
            Texto explicativo de Pacotes
            <textarea v-model="form.packagesIntroBody" rows="2" class="field-control mt-1.5" />
          </label>
          <label class="block text-sm text-text-muted sm:col-span-2">
            Título do Modelo de Parceria / Projeto Inicial
            <input v-model="form.initialProjectTitle" class="field-control mt-1.5" />
          </label>
          <label class="block text-sm text-text-muted sm:col-span-2">
            Texto explicativo do Projeto Inicial
            <textarea v-model="form.initialProjectLead" rows="2" class="field-control mt-1.5" />
          </label>
          <label class="block text-sm text-text-muted sm:col-span-2">
            Entregáveis do Projeto Inicial (um por linha)
            <textarea
              v-model="form.initialProjectBulletsText"
              rows="4"
              class="field-control mt-1.5 font-code text-xs"
            />
          </label>
        </div>
      </div>

      <!-- TAB 5: ANALYTICS & TAGS -->
      <div v-show="activeTab === 'analytics'" class="space-y-4">
        <h3
          class="font-display text-lg font-semibold text-text-strong pb-2 border-b border-stroke/60"
        >
          Métricas e Rastreamento
        </h3>
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="block text-sm text-text-muted">
            Google Analytics 4 (GA4 Measurement ID)
            <input
              v-model="form.ga4MeasurementId"
              class="field-control mt-1.5"
              placeholder="G-XXXXXXXXXX"
            />
          </label>
          <label class="block text-sm text-text-muted">
            Meta Pixel ID (Facebook / Instagram)
            <input
              v-model="form.metaPixelId"
              class="field-control mt-1.5"
              placeholder="123456789012345"
            />
          </label>
          <label class="block text-sm text-text-muted sm:col-span-2">
            Google AdSense (Client ID)
            <input
              v-model="form.googleAdsenseAccount"
              class="field-control mt-1.5"
              placeholder="ca-pub-XXXXXXXXXXXXXXXX"
            />
          </label>
        </div>
      </div>

      <div class="pt-4 border-t border-stroke flex items-center justify-between">
        <p v-if="error" class="text-sm text-danger">{{ error }}</p>
        <span v-else class="text-xs text-text-muted"
          >Todas as alterações refletem imediatamente após salvar.</span
        >

        <button type="submit" class="brand-button cursor-pointer" :disabled="saving">
          <span class="material-symbols-outlined text-[18px]">save</span>
          <span>{{ saving ? 'Salvando…' : 'Salvar configurações' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>
