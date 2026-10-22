<script setup lang="ts">
import type { LeadRecord, LeadStatus } from '@cagtech/shared'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

const api = useAdminApi()
const notify = useNotify()
const leads = ref<LeadRecord[]>([])
const error = ref('')
const loading = ref(true)
const selected = ref<LeadRecord | null>(null)

const columns: { id: LeadStatus; label: string; badge: string }[] = [
  { id: 'novo', label: 'Novo', badge: 'bg-brand-cyan/15 text-brand-cyan border-brand-cyan/30' },
  {
    id: 'conversa',
    label: 'Em conversa',
    badge: 'bg-brand-violet/15 text-brand-violet border-brand-violet/30',
  },
  {
    id: 'proposta',
    label: 'Proposta',
    badge: 'bg-secondary/15 text-secondary border-secondary/30',
  },
  { id: 'ganho', label: 'Ganho', badge: 'bg-success/15 text-success border-success/30' },
  { id: 'perdido', label: 'Perdido', badge: 'bg-danger/15 text-danger border-danger/30' },
]

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    leads.value = await api.listLeads()
  } catch {
    error.value = 'Não foi possível carregar a lista de leads.'
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
  try {
    const updated = await api.updateLead(id, { status })
    leads.value = leads.value.map((item) => (item.id === id ? updated : item))
    if (selected.value?.id === id) selected.value = updated
    notify.success('Status atualizado', `Lead movido para "${status}".`)
  } catch {
    notify.error('Erro ao atualizar', 'Não foi possível alterar a etapa do lead.')
  }
}

const saveNotes = async () => {
  if (!selected.value) return
  try {
    const updated = await api.updateLead(selected.value.id, { notes: selected.value.notes })
    leads.value = leads.value.map((item) => (item.id === updated.id ? updated : item))
    selected.value = updated
    notify.success('Notas salvas', 'Anotações internas registradas com sucesso.')
  } catch {
    notify.error('Erro ao salvar', 'Não foi possível registrar as notas.')
  }
}

onMounted(() => {
  void load()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <span class="font-mono text-xs uppercase tracking-[0.14em] text-brand-cyan">
        // FUNIL DE CONVERSÃO
      </span>
      <h2 class="mt-1 font-display text-3xl font-semibold text-text-strong">
        Leads e Orçamentos Solicitados
      </h2>
      <p class="mt-1 text-sm text-text-muted">
        Pipeline comercial unificado. Arraste os cards entre as colunas para atualizar a etapa.
      </p>
    </div>

    <p v-if="loading" class="text-sm text-text-muted">Carregando funil…</p>
    <p v-else-if="error" class="text-sm text-danger">{{ error }}</p>

    <!-- Kanban Columns Grid -->
    <div v-else class="grid gap-4 overflow-x-auto pb-4 lg:grid-cols-5 items-start">
      <section
        v-for="column in columns"
        :key="column.id"
        class="surface min-w-[240px] p-4 bg-surface-container-lowest/80 border-stroke flex flex-col min-h-[460px]"
        @dragover.prevent
        @drop="onDrop(column.id, $event)"
      >
        <div class="flex items-center justify-between mb-4 pb-2 border-b border-stroke/60">
          <div class="flex items-center gap-2">
            <span
              :class="[
                'h-2 w-2 rounded-full',
                column.id === 'ganho'
                  ? 'bg-success'
                  : column.id === 'perdido'
                    ? 'bg-danger'
                    : 'bg-brand-cyan',
              ]"
            />
            <h3
              class="font-body-sm text-xs font-semibold uppercase tracking-wider text-text-strong"
            >
              {{ column.label }}
            </h3>
          </div>
          <span
            :class="[
              'font-mono text-[11px] px-2 py-0.5 rounded-full border font-bold',
              column.badge,
            ]"
          >
            {{ byStatus(column.id).length }}
          </span>
        </div>

        <div class="space-y-2.5 flex-1">
          <button
            v-for="lead in byStatus(column.id)"
            :key="lead.id"
            type="button"
            draggable="true"
            class="w-full rounded-xl border border-stroke bg-surface p-3.5 text-left hover:border-brand-cyan/50 hover:bg-surface-raised transition-all cursor-grab active:cursor-grabbing shadow-sm group"
            @dragstart="($event as DragEvent).dataTransfer?.setData('text/plain', lead.id)"
            @click="selected = lead"
          >
            <div class="flex items-start justify-between gap-2">
              <p
                class="font-semibold text-sm text-text-strong group-hover:text-brand-cyan transition-colors truncate"
              >
                {{ lead.fullName }}
              </p>
              <span class="material-symbols-outlined text-text-muted text-[14px]"
                >drag_indicator</span
              >
            </div>
            <p class="mt-1 text-xs text-text-muted truncate font-code">{{ lead.email }}</p>
            <div class="mt-3 pt-2 border-t border-stroke/50 flex items-center justify-between">
              <span class="font-mono text-xs font-semibold text-brand-cyan">
                {{ formatBudget(lead.budget) }}
              </span>
              <span class="text-[10px] text-text-muted">
                {{ new Date(lead.createdAt).toLocaleDateString('pt-BR') }}
              </span>
            </div>
          </button>
        </div>
      </section>
    </div>

    <!-- Details Modal / Panel -->
    <aside
      v-if="selected"
      class="surface p-6 sm:p-8 space-y-5 border-brand-cyan/40 shadow-glow-primary max-w-3xl"
    >
      <div class="flex items-start justify-between border-b border-stroke pb-4">
        <div>
          <span class="font-mono text-xs uppercase tracking-wider text-brand-cyan">
            // DETALHES DO LEAD
          </span>
          <h3 class="font-display text-2xl font-semibold text-text-strong mt-0.5">
            {{ selected.fullName }}
          </h3>
          <p class="text-sm font-code text-text-muted">{{ selected.email }}</p>
        </div>
        <button
          type="button"
          class="grid h-9 w-9 place-items-center rounded-lg text-text-muted hover:bg-surface-raised hover:text-text-strong cursor-pointer"
          @click="selected = null"
        >
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 text-sm">
        <div class="p-3.5 rounded-xl border border-stroke bg-surface-raised">
          <span class="font-mono text-xs text-text-muted block">Orçamento estimado</span>
          <span class="font-metric-num text-xl font-bold text-brand-cyan mt-1 block">
            {{ formatBudget(selected.budget) }}
          </span>
        </div>
        <div class="p-3.5 rounded-xl border border-stroke bg-surface-raised">
          <span class="font-mono text-xs text-text-muted block">Status atual</span>
          <span class="font-body-sm font-semibold text-text-strong mt-1 block capitalize">
            {{ selected.status }}
          </span>
        </div>
      </div>

      <div>
        <span class="font-mono text-xs text-text-muted block mb-1"
          >Tags / Motivos selecionados:</span
        >
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="(r, idx) in selected.reason"
            :key="idx"
            class="px-2.5 py-1 rounded-md bg-white/[0.04] border border-stroke text-xs text-text-base"
          >
            {{ r }}
          </span>
        </div>
      </div>

      <div>
        <span class="font-mono text-xs text-text-muted block mb-1"
          >Mensagem enviada pelo cliente:</span
        >
        <div
          class="p-4 rounded-xl border border-stroke bg-surface-container-lowest text-text-base text-sm leading-relaxed whitespace-pre-wrap"
        >
          {{ selected.message }}
        </div>
      </div>

      <div class="space-y-2 pt-2 border-t border-stroke">
        <label class="block text-sm font-semibold text-text-strong">
          Anotações internas do time
        </label>
        <textarea
          v-model="selected.notes"
          rows="3"
          class="field-control"
          placeholder="Registre informações sobre reuniões, proposta enviada, negociação ou acordos..."
        />
      </div>

      <div class="flex gap-3 pt-2">
        <button type="button" class="brand-button cursor-pointer" @click="saveNotes">
          <span>Salvar anotações</span>
        </button>
        <button type="button" class="ghost-button cursor-pointer" @click="selected = null">
          <span>Fechar</span>
        </button>
      </div>
    </aside>
  </div>
</template>
