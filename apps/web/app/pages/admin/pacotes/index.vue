<script setup lang="ts">
import type { PackageRecord } from '@cagtech/shared'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

const api = useAdminApi()
const notify = useNotify()
const items = ref<PackageRecord[]>([])
const error = ref('')
const loading = ref(true)
const saving = ref(false)
const editing = ref<(Partial<PackageRecord> & { includesText?: string }) | null>(null)

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    items.value = await api.listPackages()
  } catch {
    error.value = 'Falha ao carregar pacotes comerciais.'
  } finally {
    loading.value = false
  }
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
  saving.value = true
  try {
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
    if (editing.value.id) {
      await api.updatePackage(editing.value.id, payload)
      notify.success('Pacote atualizado', 'As alterações foram salvas com sucesso.')
    } else {
      await api.createPackage(payload)
      notify.success('Pacote criado', 'O novo plano comercial foi registrado.')
    }
    editing.value = null
    await load()
  } catch {
    notify.error('Erro ao salvar', 'Não foi possível salvar o pacote.')
  } finally {
    saving.value = false
  }
}

const remove = async (id: string) => {
  if (!confirm('Deseja excluir este pacote comercial?')) return
  try {
    await api.deletePackage(id)
    notify.success('Pacote excluído', 'O item foi removido com sucesso.')
    await load()
  } catch {
    notify.error('Erro ao excluir', 'Não foi possível remover o pacote.')
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
          // TABELA COMERCIAL
        </span>
        <h2 class="mt-1 font-display text-3xl font-semibold text-text-strong">
          Pacotes e Modelos de Investimento
        </h2>
        <p class="mt-1 text-sm text-text-muted">
          Gerenciamento de planos exibidos na seção de investimento da landing.
        </p>
      </div>
      <button
        type="button"
        class="brand-button cursor-pointer self-start sm:self-auto"
        @click="openNew"
      >
        <span class="material-symbols-outlined text-[18px]">add</span>
        <span>Novo pacote</span>
      </button>
    </div>

    <p v-if="loading" class="text-sm text-text-muted">Carregando pacotes…</p>
    <p v-else-if="error" class="text-sm text-danger">{{ error }}</p>

    <!-- Cards Grid -->
    <div v-else class="grid gap-4 md:grid-cols-3">
      <article
        v-for="item in items"
        :key="item.id"
        class="surface p-6 flex flex-col justify-between hover:border-stroke-strong transition-all relative group"
        :class="item.featured ? 'border-brand-violet/60 shadow-glow-accent' : ''"
      >
        <div>
          <div class="flex items-start justify-between gap-2 mb-3">
            <span
              v-if="item.featured"
              class="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-violet text-white tracking-wider uppercase"
            >
              ★ Destaque
            </span>
            <span v-else class="font-mono text-[11px] text-text-muted">
              #{{ item.sortOrder + 1 }}
            </span>
            <span
              v-if="!item.active"
              class="font-mono text-[10px] px-2 py-0.5 rounded bg-danger/15 text-danger border border-danger/30"
            >
              Inativo
            </span>
          </div>

          <h3 class="font-headline-md text-xl font-semibold text-text-strong">
            {{ item.name }}
          </h3>
          <p class="text-xs text-text-muted mt-1">{{ item.subtitle }}</p>

          <p class="font-display text-2xl font-bold text-brand-cyan mt-4">
            {{ item.priceDisplay }}
          </p>
          <p v-if="item.priceFootnote" class="text-[11px] text-text-muted mt-1">
            {{ item.priceFootnote }}
          </p>

          <ul class="mt-4 pt-3 border-t border-stroke/50 space-y-2 text-xs text-text-base">
            <li v-for="(inc, idx) in item.includes" :key="idx" class="flex items-start gap-2">
              <span class="material-symbols-outlined text-success text-[14px] shrink-0 mt-0.5"
                >check_circle</span
              >
              <span>{{ inc }}</span>
            </li>
          </ul>
        </div>

        <div class="mt-6 pt-3 border-t border-stroke flex items-center justify-end gap-2">
          <button
            type="button"
            class="ghost-button h-8 px-3 text-xs cursor-pointer"
            @click="openEdit(item)"
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
            // {{ editing.id ? 'EDITANDO PACOTE' : 'NOVO PACOTE' }}
          </span>
          <h3 class="font-display text-2xl font-semibold text-text-strong mt-0.5">
            {{ editing.name || 'Novo Pacote' }}
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
          <label class="block text-sm text-text-muted">
            Nome do pacote *
            <input
              v-model="editing.name"
              class="field-control mt-1.5"
              placeholder="Ex.: MVP Rápido"
              required
            />
          </label>
          <label class="block text-sm text-text-muted">
            Subtítulo comercial
            <input
              v-model="editing.subtitle"
              class="field-control mt-1.5"
              placeholder="Ex.: Validação rápida de ideia"
            />
          </label>
          <label class="block text-sm text-text-muted">
            Preço exibido *
            <input
              v-model="editing.priceDisplay"
              class="field-control mt-1.5"
              placeholder="Ex.: A partir de R$ 12.000 ou Sob consulta"
              required
            />
          </label>
          <label class="block text-sm text-text-muted">
            Nota de rodapé / Prazo
            <input
              v-model="editing.priceFootnote"
              class="field-control mt-1.5"
              placeholder="Ex.: Prazo médio: 3 a 5 semanas"
            />
          </label>
          <label class="block text-sm text-text-muted sm:col-span-2">
            Entregáveis inclusos (um por linha)
            <textarea
              v-model="editing.includesText"
              rows="6"
              class="field-control mt-1.5 font-code text-xs leading-relaxed"
              placeholder="Prototipagem rápida UI/UX&#10;Frontend moderno responsivo&#10;Backend robusto PostgreSQL&#10;Deploy com SSL"
            />
          </label>
          <label class="block text-sm text-text-muted">
            Ordem de exibição
            <input v-model.number="editing.sortOrder" type="number" class="field-control mt-1.5" />
          </label>
          <div class="flex items-center gap-6 pt-6 sm:col-span-2">
            <label class="inline-flex items-center gap-2.5 text-sm text-text-strong cursor-pointer">
              <input
                v-model="editing.featured"
                type="checkbox"
                class="h-4 w-4 rounded border-stroke bg-surface-raised text-brand-cyan focus:ring-brand-cyan/50"
              />
              <span>Pacote em destaque (borda gradiente e selo "Mais escolhido")</span>
            </label>
            <label class="inline-flex items-center gap-2.5 text-sm text-text-strong cursor-pointer">
              <input
                v-model="editing.active"
                type="checkbox"
                class="h-4 w-4 rounded border-stroke bg-surface-raised text-brand-cyan focus:ring-brand-cyan/50"
              />
              <span>Ativo</span>
            </label>
          </div>
        </div>

        <div class="flex items-center gap-3 pt-4 border-t border-stroke">
          <button type="submit" class="brand-button cursor-pointer" :disabled="saving">
            <span>{{ saving ? 'Salvando…' : 'Salvar pacote' }}</span>
          </button>
          <button type="button" class="ghost-button cursor-pointer" @click="editing = null">
            Cancelar
          </button>
        </div>
      </form>
    </section>
  </div>
</template>
