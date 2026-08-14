<script setup lang="ts">
import type { FaqRecord } from '@cagtech/shared'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

const api = useAdminApi()
const items = ref<FaqRecord[]>([])
const editing = ref<Partial<FaqRecord> | null>(null)
const error = ref('')

const load = async () => {
  items.value = await api.listFaqs()
}

const save = async () => {
  if (!editing.value?.question || !editing.value.answer) return
  const payload = {
    question: editing.value.question,
    answer: editing.value.answer,
    sortOrder: Number(editing.value.sortOrder || 0),
    active: editing.value.active !== false,
  }
  if (editing.value.id) await api.updateFaq(editing.value.id, payload)
  else await api.createFaq(payload)
  editing.value = null
  await load()
}

onMounted(() => {
  void load().catch(() => {
    error.value = 'Falha ao carregar FAQ.'
  })
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h2 class="font-display text-3xl font-semibold text-copy-strong">Perguntas e respostas</h2>
        <p class="mt-1 text-sm text-copy-muted">FAQ da landing e do schema SEO.</p>
      </div>
      <button
        type="button"
        class="brand-button"
        @click="editing = { question: '', answer: '', sortOrder: items.length, active: true }"
      >
        Nova pergunta
      </button>
    </div>
    <p v-if="error" class="text-sm text-red-300">{{ error }}</p>
    <article v-for="item in items" :key="item.id" class="surface p-4">
      <p class="font-semibold text-copy-strong">{{ item.question }}</p>
      <div class="mt-3 flex gap-2">
        <button type="button" class="ghost-button" @click="editing = { ...item }">Editar</button>
        <button type="button" class="ghost-button" @click="api.deleteFaq(item.id).then(load)">Excluir</button>
      </div>
    </article>
    <form v-if="editing" class="surface space-y-3 p-5" @submit.prevent="save">
      <input v-model="editing.question" class="field-control" placeholder="Pergunta" required />
      <textarea v-model="editing.answer" rows="4" class="field-control" placeholder="Resposta" required />
      <input v-model.number="editing.sortOrder" type="number" class="field-control" />
      <label class="flex items-center gap-2 text-sm"><input v-model="editing.active" type="checkbox" /> Ativa</label>
      <div class="flex gap-2">
        <button type="submit" class="brand-button">Salvar</button>
        <button type="button" class="ghost-button" @click="editing = null">Cancelar</button>
      </div>
    </form>
  </div>
</template>
