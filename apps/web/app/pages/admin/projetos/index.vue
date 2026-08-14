<script setup lang="ts">
import type { ProjectRecord } from '@cagtech/shared'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

const api = useAdminApi()
const items = ref<ProjectRecord[]>([])
const error = ref('')
const editing = ref<Partial<ProjectRecord> | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const load = async () => {
  items.value = await api.listProjects()
}

const openNew = () => {
  editing.value = { name: '', clientName: '', siteUrl: '', sortOrder: items.value.length, active: true }
}

const save = async () => {
  if (!editing.value?.name || !editing.value.clientName) return
  const payload = {
    name: editing.value.name,
    clientName: editing.value.clientName,
    siteUrl: editing.value.siteUrl || null,
    sortOrder: Number(editing.value.sortOrder || 0),
    active: editing.value.active !== false,
  }
  const saved = editing.value.id
    ? await api.updateProject(editing.value.id, payload)
    : await api.createProject(payload)
  editing.value = saved
  await load()
}

const onFile = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !editing.value?.id) return
  editing.value = await api.uploadLogo(editing.value.id, file)
  await load()
}

const remove = async (id: string) => {
  await api.deleteProject(id)
  await load()
}

onMounted(() => {
  void load().catch(() => {
    error.value = 'Falha ao carregar projetos.'
  })
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h2 class="font-display text-3xl font-semibold text-copy-strong">Projetos</h2>
        <p class="mt-1 text-sm text-copy-muted">Nome, cliente, URL e logotipo.</p>
      </div>
      <button type="button" class="brand-button" @click="openNew">Novo projeto</button>
    </div>
    <p v-if="error" class="text-sm text-red-300">{{ error }}</p>
    <div class="grid gap-3 sm:grid-cols-2">
      <article v-for="item in items" :key="item.id" class="surface p-4">
        <img v-if="item.logoUrl" :src="item.logoUrl" :alt="item.name" class="mb-3 h-12 w-12 object-contain" />
        <p class="font-semibold text-copy-strong">{{ item.name }}</p>
        <p class="text-sm text-copy-muted">{{ item.clientName }}</p>
        <div class="mt-3 flex gap-2">
          <button type="button" class="ghost-button" @click="editing = { ...item }">Editar</button>
          <button type="button" class="ghost-button" @click="remove(item.id)">Excluir</button>
        </div>
      </article>
    </div>
    <form v-if="editing" class="surface space-y-3 p-5" @submit.prevent="save">
      <input v-model="editing.name" class="field-control" placeholder="Nome do projeto" required />
      <input v-model="editing.clientName" class="field-control" placeholder="Nome do cliente" required />
      <input v-model="editing.siteUrl" class="field-control" placeholder="URL do site" />
      <input v-model.number="editing.sortOrder" type="number" class="field-control" />
      <label class="flex items-center gap-2 text-sm"><input v-model="editing.active" type="checkbox" /> Ativo</label>
      <div v-if="editing.id" class="space-y-2">
        <p class="text-sm text-copy-muted">Logotipo</p>
        <input ref="fileInput" type="file" accept="image/*" @change="onFile" />
      </div>
      <p v-else class="text-xs text-copy-muted">Salve o projeto para enviar o logotipo.</p>
      <div class="flex gap-2">
        <button type="submit" class="brand-button">Salvar</button>
        <button type="button" class="ghost-button" @click="editing = null">Cancelar</button>
      </div>
    </form>
  </div>
</template>
