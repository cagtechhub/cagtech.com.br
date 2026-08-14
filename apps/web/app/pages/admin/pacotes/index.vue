<script setup lang="ts">
import type { PackageRecord } from '@cagtech/shared'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

const api = useAdminApi()
const items = ref<PackageRecord[]>([])
const error = ref('')
const editing = ref<Partial<PackageRecord> & { includesText?: string } | null>(null)

const load = async () => {
  items.value = await api.listPackages()
}

const openNew = () => {
  editing.value = {
    name: '',
    subtitle: '',
    priceDisplay: '',
    priceFootnote: '',
    includes: [],
    includesText: '',
    featured: false,
    sortOrder: items.value.length,
    active: true,
  }
}

const openEdit = (item: PackageRecord) => {
  editing.value = { ...item, includesText: item.includes.join('\n') }
}

const save = async () => {
  if (!editing.value?.name || !editing.value.priceDisplay) return
  const payload = {
    name: editing.value.name,
    subtitle: editing.value.subtitle || '',
    priceDisplay: editing.value.priceDisplay,
    priceFootnote: editing.value.priceFootnote || null,
    includes: String(editing.value.includesText || '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean),
    featured: Boolean(editing.value.featured),
    sortOrder: Number(editing.value.sortOrder || 0),
    active: editing.value.active !== false,
  }
  if (editing.value.id) await api.updatePackage(editing.value.id, payload)
  else await api.createPackage(payload)
  editing.value = null
  await load()
}

const remove = async (id: string) => {
  await api.deletePackage(id)
  await load()
}

onMounted(() => {
  void load().catch(() => {
    error.value = 'Falha ao carregar pacotes.'
  })
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h2 class="font-display text-3xl font-semibold text-copy-strong">Pacotes</h2>
        <p class="mt-1 text-sm text-copy-muted">Seção Pacotes e investimento.</p>
      </div>
      <button type="button" class="brand-button" @click="openNew">Novo pacote</button>
    </div>
    <p v-if="error" class="text-sm text-red-300">{{ error }}</p>
    <div class="space-y-3">
      <article v-for="item in items" :key="item.id" class="surface flex items-start justify-between gap-4 p-4">
        <div>
          <p class="font-semibold text-copy-strong">{{ item.name }}</p>
          <p class="text-sm text-brand-cyan">{{ item.priceDisplay }}</p>
        </div>
        <div class="flex gap-2">
          <button type="button" class="ghost-button" @click="openEdit(item)">Editar</button>
          <button type="button" class="ghost-button" @click="remove(item.id)">Excluir</button>
        </div>
      </article>
    </div>
    <form v-if="editing" class="surface space-y-3 p-5" @submit.prevent="save">
      <input v-model="editing.name" class="field-control" placeholder="Nome" required />
      <input v-model="editing.subtitle" class="field-control" placeholder="Subtítulo" />
      <input v-model="editing.priceDisplay" class="field-control" placeholder="Preço exibido" required />
      <input v-model="editing.priceFootnote" class="field-control" placeholder="Nota de rodapé" />
      <textarea v-model="editing.includesText" rows="5" class="field-control" placeholder="Itens inclusos (um por linha)" />
      <label class="flex items-center gap-2 text-sm"><input v-model="editing.featured" type="checkbox" /> Destaque</label>
      <label class="flex items-center gap-2 text-sm"><input v-model="editing.active" type="checkbox" /> Ativo</label>
      <input v-model.number="editing.sortOrder" type="number" class="field-control" placeholder="Ordem" />
      <div class="flex gap-2">
        <button type="submit" class="brand-button">Salvar</button>
        <button type="button" class="ghost-button" @click="editing = null">Cancelar</button>
      </div>
    </form>
  </div>
</template>
