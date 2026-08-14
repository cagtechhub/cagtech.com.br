<script setup lang="ts">
import type { SiteSettings } from '#shared/schemas/settings'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

const api = useAdminApi()
const notify = useNotify()
const error = ref('')
const loading = ref(true)
const saving = ref(false)

const form = reactive({
  siteUrl: '',
  siteName: '',
  seoLocality: '',
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
})

const applySettings = (item: SiteSettings) => {
  form.siteUrl = item.siteUrl
  form.siteName = item.siteName
  form.seoLocality = item.seoLocality
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
    applySettings(await api.updateSettings({ ...form }))
    notify.success(
      'Configurações salvas',
      'Recarregue o site público para ver SEO e analytics.',
    )
  } catch {
    error.value = 'Falha ao salvar configurações.'
  } finally {
    saving.value = false
  }
}

await load()
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <div>
      <h2 class="font-display text-3xl font-semibold text-copy-strong">Configurações do site</h2>
      <p class="mt-1 text-sm text-copy-muted">
        SEO, contato, redes e analytics — usados na landing pública.
      </p>
    </div>

    <p v-if="loading" class="text-sm text-copy-muted">Carregando…</p>
    <p v-else-if="error && !form.siteName" class="text-sm text-red-300">{{ error }}</p>

    <form v-else class="surface space-y-4 p-6" @submit.prevent="onSubmit">
      <div class="grid gap-4 sm:grid-cols-2">
        <label class="block text-sm text-copy-muted sm:col-span-2">
          Nome do site
          <input v-model="form.siteName" class="field-control mt-1" />
        </label>
        <label class="block text-sm text-copy-muted sm:col-span-2">
          URL do site
          <input v-model="form.siteUrl" class="field-control mt-1" placeholder="https://www.cagtech.com.br" />
        </label>
        <label class="block text-sm text-copy-muted">
          Localidade SEO
          <input v-model="form.seoLocality" class="field-control mt-1" />
        </label>
        <label class="inline-flex items-center gap-2 self-end pb-2 text-sm text-copy-base">
          <input v-model="form.noIndex" type="checkbox" class="rounded border-stroke" />
          No-index (bloquear busca)
        </label>
        <label class="block text-sm text-copy-muted sm:col-span-2">
          Endereço comercial
          <input v-model="form.businessAddress" class="field-control mt-1" />
        </label>
        <label class="block text-sm text-copy-muted">
          Telefone
          <input v-model="form.businessPhone" class="field-control mt-1" />
        </label>
        <label class="block text-sm text-copy-muted">
          E-mail de contato
          <input v-model="form.contactEmail" type="email" class="field-control mt-1" />
        </label>
        <label class="block text-sm text-copy-muted">
          WhatsApp (DDI + número)
          <input v-model="form.whatsappNumber" class="field-control mt-1" />
        </label>
        <label class="block text-sm text-copy-muted">
          Mensagem padrão WhatsApp
          <input v-model="form.whatsappMessage" class="field-control mt-1" />
        </label>
        <label class="block text-sm text-copy-muted">
          Instagram
          <input v-model="form.instagramUrl" class="field-control mt-1" />
        </label>
        <label class="block text-sm text-copy-muted">
          Facebook
          <input v-model="form.facebookUrl" class="field-control mt-1" />
        </label>
        <label class="block text-sm text-copy-muted sm:col-span-2">
          LinkedIn
          <input v-model="form.linkedinUrl" class="field-control mt-1" />
        </label>
        <label class="block text-sm text-copy-muted sm:col-span-2">
          Imagem OG padrão (URL ou caminho)
          <input v-model="form.defaultOgImageUrl" class="field-control mt-1" placeholder="/og-default.png" />
        </label>
        <label class="block text-sm text-copy-muted sm:col-span-2">
          Embed do Google Maps (URL do iframe)
          <textarea v-model="form.mapsEmbedUrl" rows="3" class="field-control mt-1" />
        </label>
        <label class="block text-sm text-copy-muted">
          Latitude
          <input v-model="form.geoLatitude" class="field-control mt-1" />
        </label>
        <label class="block text-sm text-copy-muted">
          Longitude
          <input v-model="form.geoLongitude" class="field-control mt-1" />
        </label>
        <label class="block text-sm text-copy-muted">
          GA4 Measurement ID
          <input v-model="form.ga4MeasurementId" class="field-control mt-1" placeholder="G-XXXXXXXXXX" />
        </label>
        <label class="block text-sm text-copy-muted">
          Meta Pixel ID
          <input v-model="form.metaPixelId" class="field-control mt-1" placeholder="123456789012345" />
        </label>
        <label class="block text-sm text-copy-muted sm:col-span-2">
          Google AdSense
          <input v-model="form.googleAdsenseAccount" class="field-control mt-1" />
        </label>
      </div>

      <p v-if="error" class="text-sm text-red-300">{{ error }}</p>

      <button type="submit" class="brand-button" :disabled="saving">
        {{ saving ? 'Salvando…' : 'Salvar configurações' }}
      </button>
    </form>
  </div>
</template>
