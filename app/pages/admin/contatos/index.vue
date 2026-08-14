<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

const api = useAdminApi()
const contacts = ref<ContactRecord[]>([])
const error = ref('')
const loading = ref(true)
const selected = ref<ContactRecord | null>(null)

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    contacts.value = await api.listContacts()
  } catch {
    error.value = 'Não foi possível carregar os contatos.'
  } finally {
    loading.value = false
  }
}

const formatDate = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatBudget = (value: number | null) => {
  if (value === null || Number.isNaN(value)) return '—'
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

onMounted(() => {
  void load()
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="font-display text-3xl font-semibold text-copy-strong">Contatos</h2>
      <p class="mt-1 text-sm text-copy-muted">Leads enviados pelo formulário da landing.</p>
    </div>

    <p v-if="loading" class="text-sm text-copy-muted">Carregando…</p>
    <div v-else-if="error" class="space-y-3">
      <p class="text-sm text-red-300">{{ error }}</p>
      <button type="button" class="ghost-button" @click="load">Tentar novamente</button>
    </div>

    <p v-else-if="contacts.length === 0" class="text-sm text-copy-muted">Nenhum contato ainda.</p>

    <div v-else class="overflow-x-auto surface">
      <table class="min-w-full text-left text-sm">
        <thead class="border-b border-stroke text-xs uppercase tracking-wider text-copy-muted">
          <tr>
            <th class="px-4 py-3 font-medium">Nome</th>
            <th class="px-4 py-3 font-medium">E-mail</th>
            <th class="px-4 py-3 font-medium">Orçamento</th>
            <th class="px-4 py-3 font-medium">Data</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in contacts"
            :key="item.id"
            class="cursor-pointer border-b border-stroke/60 last:border-0 hover:bg-white/5"
            @click="selected = item"
          >
            <td class="px-4 py-3 text-copy-strong">{{ item.fullName }}</td>
            <td class="px-4 py-3">{{ item.email }}</td>
            <td class="px-4 py-3">{{ formatBudget(item.budget) }}</td>
            <td class="px-4 py-3 text-copy-muted">{{ formatDate(item.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="selected" class="surface space-y-3 p-5">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h3 class="font-display text-lg font-semibold text-copy-strong">{{ selected.fullName }}</h3>
          <p class="text-sm text-copy-muted">{{ selected.email }} · {{ formatDate(selected.createdAt) }}</p>
        </div>
        <button type="button" class="ghost-button" @click="selected = null">Fechar</button>
      </div>
      <p class="text-sm">
        <span class="text-copy-muted">Orçamento:</span>
        {{ formatBudget(selected.budget) }}
      </p>
      <p v-if="selected.reason.length" class="text-sm">
        <span class="text-copy-muted">Motivo:</span>
        {{ selected.reason.join(', ') }}
      </p>
      <p class="whitespace-pre-wrap text-sm text-copy-base">{{ selected.message }}</p>
    </div>
  </div>
</template>
