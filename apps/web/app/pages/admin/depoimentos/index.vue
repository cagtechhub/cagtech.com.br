<script setup lang="ts">
import type { ProjectRecord, TestimonialRecord } from '@cagtech/shared'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

const api = useAdminApi()
const items = ref<TestimonialRecord[]>([])
const projects = ref<ProjectRecord[]>([])
const editing = ref<Partial<TestimonialRecord> | null>(null)
const error = ref('')

const load = async () => {
  ;[items.value, projects.value] = await Promise.all([api.listTestimonials(), api.listProjects()])
}

const save = async () => {
  if (!editing.value?.title || !editing.value.body || !editing.value.projectId) return
  const payload = {
    title: editing.value.title,
    body: editing.value.body,
    projectId: editing.value.projectId,
    sortOrder: Number(editing.value.sortOrder || 0),
    active: editing.value.active !== false,
  }
  if (editing.value.id) await api.updateTestimonial(editing.value.id, payload)
  else await api.createTestimonial(payload)
  editing.value = null
  await load()
}

onMounted(() => {
  void load().catch(() => {
    error.value = 'Falha ao carregar depoimentos.'
  })
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h2 class="font-display text-3xl font-semibold text-copy-strong">Depoimentos</h2>
        <p class="mt-1 text-sm text-copy-muted">Título, descrição e vínculo com o projeto.</p>
      </div>
      <button
        type="button"
        class="brand-button"
        @click="editing = { title: '', body: '', projectId: projects[0]?.id, sortOrder: items.length, active: true }"
      >
        Novo
      </button>
    </div>
    <p v-if="error" class="text-sm text-red-300">{{ error }}</p>
    <article v-for="item in items" :key="item.id" class="surface p-4">
      <p class="font-semibold text-copy-strong">{{ item.title }}</p>
      <p class="text-sm text-copy-muted">{{ item.project?.name }} — {{ item.project?.clientName }}</p>
      <div class="mt-3 flex gap-2">
        <button type="button" class="ghost-button" @click="editing = { ...item }">Editar</button>
        <button
          type="button"
          class="ghost-button"
          @click="api.deleteTestimonial(item.id).then(load)"
        >
          Excluir
        </button>
      </div>
    </article>
    <form v-if="editing" class="surface space-y-3 p-5" @submit.prevent="save">
      <input v-model="editing.title" class="field-control" placeholder="Título" required />
      <textarea v-model="editing.body" rows="4" class="field-control" placeholder="Descrição" required />
      <select v-model="editing.projectId" class="field-control" required>
        <option disabled value="">Projeto</option>
        <option v-for="project in projects" :key="project.id" :value="project.id">
          {{ project.name }} ({{ project.clientName }})
        </option>
      </select>
      <input v-model.number="editing.sortOrder" type="number" class="field-control" />
      <label class="flex items-center gap-2 text-sm"><input v-model="editing.active" type="checkbox" /> Ativo</label>
      <div class="flex gap-2">
        <button type="submit" class="brand-button">Salvar</button>
        <button type="button" class="ghost-button" @click="editing = null">Cancelar</button>
      </div>
    </form>
  </div>
</template>
