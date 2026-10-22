<script setup lang="ts">
import type { ProjectRecord, TestimonialRecord } from '@cagtech/shared'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

const api = useAdminApi()
const notify = useNotify()
const items = ref<TestimonialRecord[]>([])
const projects = ref<ProjectRecord[]>([])
const editing = ref<Partial<TestimonialRecord> | null>(null)
const error = ref('')
const loading = ref(true)
const saving = ref(false)

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    ;[items.value, projects.value] = await Promise.all([api.listTestimonials(), api.listProjects()])
  } catch {
    error.value = 'Falha ao carregar depoimentos.'
  } finally {
    loading.value = false
  }
}

const openNew = () => {
  editing.value = {
    title: '',
    body: '',
    projectId: projects.value[0]?.id || '',
    sortOrder: items.value.length,
    active: true,
  }
}

const save = async () => {
  if (!editing.value?.title || !editing.value.body || !editing.value.projectId) return
  saving.value = true
  try {
    const payload = {
      title: editing.value.title,
      body: editing.value.body,
      projectId: editing.value.projectId,
      sortOrder: Number(editing.value.sortOrder || 0),
      active: editing.value.active !== false,
    }
    if (editing.value.id) {
      await api.updateTestimonial(editing.value.id, payload)
      notify.success('Depoimento atualizado', 'O depoimento foi salvo com sucesso.')
    } else {
      await api.createTestimonial(payload)
      notify.success('Depoimento criado', 'Novo depoimento registrado.')
    }
    editing.value = null
    await load()
  } catch {
    notify.error('Erro ao salvar', 'Não foi possível salvar o depoimento.')
  } finally {
    saving.value = false
  }
}

const remove = async (id: string) => {
  if (!confirm('Deseja excluir este depoimento?')) return
  try {
    await api.deleteTestimonial(id)
    notify.success('Depoimento excluído', 'Item removido.')
    await load()
  } catch {
    notify.error('Erro ao excluir', 'Não foi possível remover o depoimento.')
  }
}

onMounted(() => {
  void load()
})
</script>

<template>
  <div class="space-y-6 max-w-5xl">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <span class="font-mono text-xs uppercase tracking-[0.14em] text-brand-cyan">
          // PROVA SOCIAL
        </span>
        <h2 class="mt-1 font-display text-3xl font-semibold text-text-strong">
          Depoimentos e Avaliações de Clientes
        </h2>
        <p class="mt-1 text-sm text-text-muted">
          Gerenciamento de citações, feedbacks de CTOs e líderes parceiros.
        </p>
      </div>
      <button
        type="button"
        class="brand-button cursor-pointer self-start sm:self-auto"
        @click="openNew"
      >
        <span class="material-symbols-outlined text-[18px]">add</span>
        <span>Novo depoimento</span>
      </button>
    </div>

    <p v-if="loading" class="text-sm text-text-muted">Carregando depoimentos…</p>
    <p v-else-if="error" class="text-sm text-danger">{{ error }}</p>

    <!-- Cards Grid -->
    <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="item in items"
        :key="item.id"
        class="surface p-6 flex flex-col justify-between hover:border-stroke-strong transition-all relative group"
      >
        <div>
          <div class="flex items-center justify-between text-warning mb-3">
            <div class="flex gap-1">
              <span v-for="s in 5" :key="s" class="material-symbols-outlined text-[16px]"
                >star</span
              >
            </div>
            <span
              v-if="!item.active"
              class="font-mono text-[10px] px-2 py-0.5 rounded bg-danger/15 text-danger border border-danger/30"
            >
              Inativo
            </span>
          </div>

          <h3 class="font-headline-md text-lg font-semibold text-text-strong mb-2">
            {{ item.title }}
          </h3>
          <p class="text-xs text-text-muted leading-relaxed line-clamp-3 mb-4">"{{ item.body }}"</p>
        </div>

        <div class="pt-4 border-t border-stroke flex items-center justify-between">
          <div class="min-w-0 pr-2">
            <p class="text-xs font-semibold text-text-strong truncate">
              {{ item.project?.clientName || 'Cliente' }}
            </p>
            <p class="text-[11px] text-brand-cyan truncate">
              {{ item.project?.name }}
            </p>
          </div>
          <div class="flex gap-2 shrink-0">
            <button
              type="button"
              class="ghost-button h-8 px-3 text-xs cursor-pointer"
              @click="editing = { ...item }"
            >
              Editar
            </button>
            <button
              type="button"
              class="ghost-button h-8 px-2.5 text-xs text-danger/80 hover:text-danger hover:border-danger/40 cursor-pointer"
              @click="remove(item.id)"
            >
              <span class="material-symbols-outlined text-[16px]">delete</span>
            </button>
          </div>
        </div>
      </article>
    </div>

    <!-- Edit Form Panel -->
    <section
      v-if="editing"
      class="surface p-6 sm:p-8 space-y-6 border-brand-cyan/40 shadow-glow-primary"
    >
      <div class="flex items-center justify-between border-b border-stroke pb-4">
        <div>
          <span class="font-mono text-xs uppercase tracking-wider text-brand-cyan">
            // {{ editing.id ? 'EDITANDO DEPOIMENTO' : 'NOVO DEPOIMENTO' }}
          </span>
          <h3 class="font-display text-2xl font-semibold text-text-strong mt-0.5">
            {{ editing.title || 'Novo Depoimento' }}
          </h3>
        </div>
        <button
          type="button"
          class="grid h-9 w-9 place-items-center rounded-lg text-text-muted hover:bg-surface-raised hover:text-text-strong cursor-pointer"
          @click="editing = null"
        >
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <form class="space-y-4" @submit.prevent="save">
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="block text-sm text-text-muted sm:col-span-2">
            Título / Resumo do feedback *
            <input
              v-model="editing.title"
              class="field-control mt-1.5"
              placeholder="Ex.: Projeto fluido do início ao fim."
              required
            />
          </label>
          <label class="block text-sm text-text-muted sm:col-span-2">
            Depoimento completo *
            <textarea
              v-model="editing.body"
              rows="4"
              class="field-control mt-1.5"
              placeholder="Descreva a experiência do cliente..."
              required
            />
          </label>
          <label class="block text-sm text-text-muted">
            Vincular ao projeto / cliente *
            <select
              v-model="editing.projectId"
              class="field-control mt-1.5 bg-surface text-text-strong"
              required
            >
              <option disabled value="">Selecione um projeto</option>
              <option v-for="project in projects" :key="project.id" :value="project.id">
                {{ project.name }} ({{ project.clientName }})
              </option>
            </select>
          </label>
          <label class="block text-sm text-text-muted">
            Ordem de exibição
            <input v-model.number="editing.sortOrder" type="number" class="field-control mt-1.5" />
          </label>
          <div class="sm:col-span-2 pt-2">
            <label class="inline-flex items-center gap-2.5 text-sm text-text-strong cursor-pointer">
              <input
                v-model="editing.active"
                type="checkbox"
                class="h-4 w-4 rounded border-stroke bg-surface-raised text-brand-cyan focus:ring-brand-cyan/50"
              />
              <span>Depoimento ativo (visível na landing page)</span>
            </label>
          </div>
        </div>

        <div class="flex items-center gap-3 pt-4 border-t border-stroke">
          <button type="submit" class="brand-button cursor-pointer" :disabled="saving">
            <span>{{ saving ? 'Salvando…' : 'Salvar depoimento' }}</span>
          </button>
          <button type="button" class="ghost-button cursor-pointer" @click="editing = null">
            Cancelar
          </button>
        </div>
      </form>
    </section>
  </div>
</template>
