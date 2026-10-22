<script setup lang="ts">
import type { FaqRecord } from '@cagtech/shared'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

const api = useAdminApi()
const notify = useNotify()
const items = ref<FaqRecord[]>([])
const editing = ref<Partial<FaqRecord> | null>(null)
const error = ref('')
const loading = ref(true)
const saving = ref(false)

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    items.value = await api.listFaqs()
  } catch {
    error.value = 'Falha ao carregar as dúvidas frequentes.'
  } finally {
    loading.value = false
  }
}

const openNew = () => {
  editing.value = {
    question: '',
    answer: '',
    sortOrder: items.value.length,
    active: true,
  }
}

const save = async () => {
  if (!editing.value?.question || !editing.value.answer) return
  saving.value = true
  try {
    const payload = {
      question: editing.value.question,
      answer: editing.value.answer,
      sortOrder: Number(editing.value.sortOrder || 0),
      active: editing.value.active !== false,
    }
    if (editing.value.id) {
      await api.updateFaq(editing.value.id, payload)
      notify.success('FAQ atualizado', 'A pergunta e resposta foram salvas.')
    } else {
      await api.createFaq(payload)
      notify.success('FAQ criado', 'Nova dúvida adicionada ao catálogo.')
    }
    editing.value = null
    await load()
  } catch {
    notify.error('Erro ao salvar', 'Não foi possível salvar o FAQ.')
  } finally {
    saving.value = false
  }
}

const remove = async (id: string) => {
  if (!confirm('Deseja excluir esta pergunta do FAQ?')) return
  try {
    await api.deleteFaq(id)
    notify.success('FAQ excluído', 'Item removido.')
    await load()
  } catch {
    notify.error('Erro ao excluir', 'Não foi possível remover o FAQ.')
  }
}

onMounted(() => {
  void load()
})
</script>

<template>
  <div class="space-y-6 max-w-4xl">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <span class="font-mono text-xs uppercase tracking-[0.14em] text-brand-cyan">
          // SUPORTE &amp; CONTEÚDO
        </span>
        <h2 class="mt-1 font-display text-3xl font-semibold text-text-strong">
          Perguntas Frequentes (FAQ)
        </h2>
        <p class="mt-1 text-sm text-text-muted">
          Gerenciamento do accordion de dúvidas e dados estruturados Schema.org para SEO.
        </p>
      </div>
      <button
        type="button"
        class="brand-button cursor-pointer self-start sm:self-auto"
        @click="openNew"
      >
        <span class="material-symbols-outlined text-[18px]">add</span>
        <span>Nova pergunta</span>
      </button>
    </div>

    <p v-if="loading" class="text-sm text-text-muted">Carregando perguntas…</p>
    <p v-else-if="error" class="text-sm text-danger">{{ error }}</p>

    <!-- FAQ Accordion List in Admin -->
    <div v-else class="space-y-3">
      <article
        v-for="(item, idx) in items"
        :key="item.id"
        class="surface p-5 hover:border-stroke-strong transition-all relative group flex flex-col justify-between"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-start gap-3 min-w-0">
            <span class="font-mono text-xs text-brand-cyan font-bold pt-0.5">
              {{ String(idx + 1).padStart(2, '0') }}
            </span>
            <div class="min-w-0">
              <h3 class="font-headline-md text-base font-semibold text-text-strong">
                {{ item.question }}
              </h3>
              <p class="text-xs text-text-muted mt-2 leading-relaxed whitespace-pre-wrap">
                {{ item.answer }}
              </p>
            </div>
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
            // {{ editing.id ? 'EDITANDO PERGUNTA' : 'NOVA PERGUNTA' }}
          </span>
          <h3 class="font-display text-2xl font-semibold text-text-strong mt-0.5">
            {{ editing.question || 'Nova Pergunta' }}
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
        <label class="block text-sm text-text-muted">
          Pergunta *
          <input
            v-model="editing.question"
            class="field-control mt-1.5"
            placeholder="Ex.: O código-fonte pertence à minha empresa?"
            required
          />
        </label>
        <label class="block text-sm text-text-muted">
          Resposta explicativa detalhada *
          <textarea
            v-model="editing.answer"
            rows="5"
            class="field-control mt-1.5 leading-relaxed"
            placeholder="Descreva a resposta completa para o cliente..."
            required
          />
        </label>
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="block text-sm text-text-muted">
            Ordem de exibição
            <input v-model.number="editing.sortOrder" type="number" class="field-control mt-1.5" />
          </label>
          <div class="flex items-center pt-6">
            <label class="inline-flex items-center gap-2.5 text-sm text-text-strong cursor-pointer">
              <input
                v-model="editing.active"
                type="checkbox"
                class="h-4 w-4 rounded border-stroke bg-surface-raised text-brand-cyan focus:ring-brand-cyan/50"
              />
              <span>Pergunta ativa (visível no FAQ)</span>
            </label>
          </div>
        </div>

        <div class="flex items-center gap-3 pt-4 border-t border-stroke">
          <button type="submit" class="brand-button cursor-pointer" :disabled="saving">
            <span>{{ saving ? 'Salvando…' : 'Salvar pergunta' }}</span>
          </button>
          <button type="button" class="ghost-button cursor-pointer" @click="editing = null">
            Cancelar
          </button>
        </div>
      </form>
    </section>
  </div>
</template>
