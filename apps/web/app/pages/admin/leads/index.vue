<script setup lang="ts">
import type { LeadRecord, LeadStatus } from '@cagtech/shared'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

const api = useAdminApi()
const leads = ref<LeadRecord[]>([])
const error = ref('')
const loading = ref(true)
const selected = ref<LeadRecord | null>(null)
const columns: { id: LeadStatus; label: string }[] = [
  { id: 'novo', label: 'Novo' },
  { id: 'conversa', label: 'Em conversa' },
  { id: 'proposta', label: 'Proposta' },
  { id: 'ganho', label: 'Ganho' },
  { id: 'perdido', label: 'Perdido' },
]

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    leads.value = await api.listLeads()
  } catch {
    error.value = 'Não foi possível carregar os leads.'
  } finally {
    loading.value = false
  }
}

const byStatus = (status: LeadStatus) =>
  leads.value.filter((item) => item.status === status).sort((a, b) => a.sortOrder - b.sortOrder)

const formatBudget = (value: number | null) => {
  if (value === null || Number.isNaN(value)) return '—'
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const onDrop = async (status: LeadStatus, event: DragEvent) => {
  event.preventDefault()
  const id = event.dataTransfer?.getData('text/plain')
  if (!id) return
  const lead = leads.value.find((item) => item.id === id)
  if (!lead || lead.status === status) return
  const updated = await api.updateLead(id, { status })
  leads.value = leads.value.map((item) => (item.id === id ? updated : item))
  if (selected.value?.id === id) selected.value = updated
}

const saveNotes = async () => {
  if (!selected.value) return
  const updated = await api.updateLead(selected.value.id, { notes: selected.value.notes })
  leads.value = leads.value.map((item) => (item.id === updated.id ? updated : item))
  selected.value = updated
}

onMounted(() => {
  void load()
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="font-display text-3xl font-semibold text-copy-strong">Leads e orçamentos</h2>
      <p class="mt-1 text-sm text-copy-muted">
        Pipeline único do formulário da landing. Arraste os cards entre as colunas.
      </p>
    </div>

    <p v-if="loading" class="text-sm text-copy-muted">Carregando…</p>
    <p v-else-if="error" class="text-sm text-red-300">{{ error }}</p>

    <div v-else class="grid gap-3 overflow-x-auto pb-4 lg:grid-cols-5">
      <section
        v-for="column in columns"
        :key="column.id"
        class="surface min-w-[220px] p-3"
        @dragover.prevent
        @drop="onDrop(column.id, $event)"
      >
        <h3 class="mb-3 text-xs font-semibold uppercase tracking-wider text-copy-muted">
          {{ column.label }} ({{ byStatus(column.id).length }})
        </h3>
        <button
          v-for="lead in byStatus(column.id)"
          :key="lead.id"
          type="button"
          draggable="true"
          class="mb-2 w-full rounded-control border border-stroke bg-panel-soft/80 p-3 text-left"
          @dragstart="($event as DragEvent).dataTransfer?.setData('text/plain', lead.id)"
          @click="selected = lead"
        >
          <p class="text-sm font-semibold text-copy-strong">{{ lead.fullName }}</p>
          <p class="mt-1 text-xs text-copy-muted">{{ lead.email }}</p>
          <p class="mt-2 text-sm text-brand-cyan">{{ formatBudget(lead.budget) }}</p>
        </button>
      </section>
    </div>

    <aside v-if="selected" class="surface p-5">
      <h3 class="font-display text-xl text-copy-strong">{{ selected.fullName }}</h3>
      <p class="text-sm text-copy-muted">{{ selected.email }}</p>
      <p class="mt-3 text-sm">Orçamento: {{ formatBudget(selected.budget) }}</p>
      <p class="mt-2 text-sm text-copy-base">{{ selected.message }}</p>
      <p class="mt-2 text-xs text-copy-muted">Motivos: {{ selected.reason.join(', ') }}</p>
      <label class="mt-4 block text-sm text-copy-muted">
        Notas internas
        <textarea v-model="selected.notes" rows="3" class="field-control mt-1" />
      </label>
      <div class="mt-3 flex gap-2">
        <button type="button" class="brand-button" @click="saveNotes">Salvar notas</button>
        <button type="button" class="ghost-button" @click="selected = null">Fechar</button>
      </div>
    </aside>
  </div>
</template>
