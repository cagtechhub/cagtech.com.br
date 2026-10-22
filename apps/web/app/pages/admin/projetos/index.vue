<script setup lang="ts">
import type { ProjectRecord } from '@cagtech/shared'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
})

const api = useAdminApi()
const notify = useNotify()
const items = ref<ProjectRecord[]>([])
const error = ref('')
const loading = ref(true)
const saving = ref(false)
const uploadingGallery = ref(false)

const editing = ref<
  | (Partial<ProjectRecord> & {
      rawGallery?: string[]
    })
  | null
>(null)

const logoFileInput = ref<HTMLInputElement | null>(null)
const galleryFileInput = ref<HTMLInputElement | null>(null)
const newImageUrl = ref('')

const categoryOptions = [
  'Sistemas Web',
  'Mobile',
  'APIs & Cloud',
  'DevOps & Infra',
  'Automação & IA',
]

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    items.value = await api.listProjects()
  } catch {
    error.value = 'Falha ao carregar a lista de projetos.'
  } finally {
    loading.value = false
  }
}

const openNew = () => {
  editing.value = {
    name: '',
    clientName: '',
    category: 'Sistemas Web',
    description: '',
    siteUrl: '',
    sortOrder: items.value.length,
    active: true,
    gallery: [],
    galleryUrls: [],
  }
}

const openEdit = (item: ProjectRecord) => {
  editing.value = {
    ...item,
    gallery: [...(item.gallery || [])],
    galleryUrls: [...(item.galleryUrls || [])],
  }
}

const save = async () => {
  if (!editing.value?.name || !editing.value.clientName) return
  saving.value = true
  try {
    const payload = {
      name: editing.value.name,
      clientName: editing.value.clientName,
      category: editing.value.category || 'Sistemas Web',
      description: editing.value.description || '',
      siteUrl: editing.value.siteUrl || null,
      sortOrder: Number(editing.value.sortOrder || 0),
      active: editing.value.active !== false,
      gallery: editing.value.gallery || [],
    }

    if (editing.value.id) {
      const saved = await api.updateProject(editing.value.id, payload)
      editing.value = saved
      notify.success('Projeto atualizado', 'As alterações foram salvas com sucesso.')
    } else {
      const created = await api.createProject(payload)
      editing.value = created
      notify.success('Projeto criado', 'Agora você pode enviar logotipos e imagens para a galeria.')
    }
    await load()
  } catch {
    notify.error('Erro ao salvar', 'Não foi possível salvar os dados do projeto.')
  } finally {
    saving.value = false
  }
}

const onLogoFile = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !editing.value?.id) return
  try {
    editing.value = await api.uploadLogo(editing.value.id, file)
    notify.success('Logotipo atualizado', 'Nova imagem de logo processada com sucesso.')
    await load()
  } catch {
    notify.error('Erro no upload', 'Não foi possível enviar o logotipo.')
  }
}

const onGalleryFiles = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files || files.length === 0 || !editing.value?.id) return

  uploadingGallery.value = true
  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file) {
        editing.value = await api.uploadGalleryImage(editing.value.id, file)
      }
    }
    notify.success('Galeria atualizada', 'Imagens adicionadas com sucesso à galeria do projeto.')
    await load()
  } catch {
    notify.error('Falha no upload', 'Erro ao enviar imagens para a galeria.')
  } finally {
    uploadingGallery.value = false
    if (galleryFileInput.value) galleryFileInput.value.value = ''
  }
}

const addImageUrlDirect = () => {
  if (!newImageUrl.value.trim() || !editing.value) return
  const url = newImageUrl.value.trim()
  editing.value.gallery = [...(editing.value.gallery || []), url]
  editing.value.galleryUrls = [...(editing.value.galleryUrls || []), url]
  newImageUrl.value = ''
}

const removeGalleryItem = async (index: number) => {
  if (!editing.value) return
  const path = editing.value.gallery?.[index]
  if (editing.value.id && path) {
    try {
      editing.value = await api.removeGalleryImage(editing.value.id, { path, index })
      notify.success('Imagem removida', 'A imagem foi excluída da galeria.')
      await load()
      return
    } catch {
      // fallback local removal
    }
  }
  editing.value.gallery?.splice(index, 1)
  editing.value.galleryUrls?.splice(index, 1)
}

const remove = async (id: string) => {
  if (!confirm('Deseja realmente excluir este projeto?')) return
  try {
    await api.deleteProject(id)
    if (editing.value?.id === id) editing.value = null
    notify.success('Projeto excluído', 'O item foi removido com sucesso.')
    await load()
  } catch {
    notify.error('Erro ao excluir', 'Não foi possível excluir o projeto.')
  }
}

onMounted(() => {
  void load()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <span class="font-mono text-xs uppercase tracking-[0.14em] text-brand-cyan">
          // PORTFÓLIO &amp; CASES
        </span>
        <h2 class="mt-1 font-display text-3xl font-semibold text-text-strong">
          Projetos e Cases de Sucesso
        </h2>
        <p class="mt-1 text-sm text-text-muted">
          Gerenciamento de cases, logotipo, descrições e galeria de imagens para carrossel.
        </p>
      </div>
      <button
        type="button"
        class="brand-button cursor-pointer self-start sm:self-auto"
        @click="openNew"
      >
        <span class="material-symbols-outlined text-[18px]">add</span>
        <span>Novo projeto</span>
      </button>
    </div>

    <p v-if="loading" class="text-sm text-text-muted">Carregando projetos…</p>
    <p v-else-if="error" class="text-sm text-danger">{{ error }}</p>

    <!-- Cards List -->
    <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="item in items"
        :key="item.id"
        class="surface p-6 flex flex-col justify-between hover:border-stroke-strong transition-all relative group"
      >
        <div>
          <!-- Header card: Category pill + logo -->
          <div class="flex items-start justify-between gap-3 mb-4">
            <span
              class="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-brand-cyan/15 border border-brand-cyan/30 text-brand-cyan"
            >
              {{ item.category || 'Sistemas Web' }}
            </span>
            <span
              v-if="!item.active"
              class="font-mono text-[10px] px-2 py-0.5 rounded bg-danger/15 text-danger border border-danger/30"
            >
              Inativo
            </span>
          </div>

          <div class="flex items-center gap-3.5 mb-3">
            <img
              v-if="item.logoUrl"
              :src="item.logoUrl"
              :alt="item.name"
              class="h-11 w-11 rounded-lg border border-stroke bg-surface-raised object-contain p-1"
            />
            <div
              v-else
              class="h-11 w-11 rounded-lg border border-stroke bg-surface-raised flex items-center justify-center font-display text-xs font-bold text-brand-cyan"
            >
              {{ item.name.slice(0, 2).toUpperCase() }}
            </div>
            <div class="min-w-0">
              <h3 class="font-headline-md text-base font-semibold text-text-strong truncate">
                {{ item.name }}
              </h3>
              <p class="text-xs text-text-muted truncate">{{ item.clientName }}</p>
            </div>
          </div>

          <p
            v-if="item.description"
            class="text-xs text-text-muted leading-relaxed line-clamp-2 mb-4"
          >
            {{ item.description }}
          </p>

          <!-- Gallery count pill -->
          <div
            class="flex items-center gap-2 pt-3 border-t border-stroke/50 text-xs text-text-muted"
          >
            <span class="material-symbols-outlined text-[16px] text-brand-cyan">photo_library</span>
            <span>{{ (item.galleryUrls || item.gallery || []).length }} imagens na galeria</span>
          </div>
        </div>

        <div class="mt-5 pt-3 border-t border-stroke flex items-center justify-between gap-2">
          <a
            v-if="item.siteUrl"
            :href="item.siteUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 text-xs text-brand-cyan hover:underline"
          >
            <span>Visitar site</span>
            <span class="material-symbols-outlined text-[14px]">open_in_new</span>
          </a>
          <div class="flex gap-2 ml-auto">
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
        </div>
      </article>
    </div>

    <!-- Edit / Create Form Drawer or Panel -->
    <section
      v-if="editing"
      class="surface p-6 sm:p-8 space-y-6 border-brand-cyan/40 shadow-glow-primary"
    >
      <div class="flex items-center justify-between border-b border-stroke pb-4">
        <div>
          <span class="font-mono text-xs uppercase tracking-wider text-brand-cyan">
            // {{ editing.id ? 'EDITANDO PROJETO' : 'NOVO PROJETO' }}
          </span>
          <h3 class="font-display text-2xl font-semibold text-text-strong mt-0.5">
            {{ editing.name || 'Novo Projeto' }}
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

      <form class="space-y-6" @submit.prevent="save">
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="block text-sm text-text-muted">
            Nome do projeto *
            <input
              v-model="editing.name"
              class="field-control mt-1.5"
              placeholder="Ex.: Portal Omnichannel de Roteirização"
              required
            />
          </label>
          <label class="block text-sm text-text-muted">
            Nome do cliente / Marca *
            <input
              v-model="editing.clientName"
              class="field-control mt-1.5"
              placeholder="Ex.: LogiTech Brasil"
              required
            />
          </label>
          <label class="block text-sm text-text-muted">
            Categoria do projeto
            <select
              v-model="editing.category"
              class="field-control mt-1.5 bg-surface text-text-strong"
            >
              <option v-for="cat in categoryOptions" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
          </label>
          <label class="block text-sm text-text-muted">
            URL do site / demonstração
            <input
              v-model="editing.siteUrl"
              class="field-control mt-1.5"
              placeholder="https://app.cliente.com.br"
            />
          </label>
          <label class="block text-sm text-text-muted sm:col-span-2">
            Descrição detalhada do case
            <textarea
              v-model="editing.description"
              rows="3"
              class="field-control mt-1.5"
              placeholder="Descreva o desafio, a solução tecnológica e os ganhos obtidos pelo cliente..."
            />
          </label>
          <label class="block text-sm text-text-muted">
            Ordem de exibição (Sort order)
            <input v-model.number="editing.sortOrder" type="number" class="field-control mt-1.5" />
          </label>
          <div class="flex items-center pt-6">
            <label class="inline-flex items-center gap-2.5 text-sm text-text-strong cursor-pointer">
              <input
                v-model="editing.active"
                type="checkbox"
                class="h-4 w-4 rounded border-stroke bg-surface-raised text-brand-cyan focus:ring-brand-cyan/50"
              />
              <span>Projeto ativo (visível na landing page)</span>
            </label>
          </div>
        </div>

        <!-- Logotipo section -->
        <div class="p-5 rounded-xl border border-stroke bg-surface-raised/40 space-y-3">
          <div class="flex items-center justify-between">
            <span class="font-body-sm font-semibold text-text-strong">Logotipo do Projeto</span>
            <span v-if="editing.logoUrl" class="text-xs text-success flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">check_circle</span> Logo enviado
            </span>
          </div>

          <div v-if="editing.id" class="flex flex-wrap items-center gap-4">
            <img
              v-if="editing.logoUrl"
              :src="editing.logoUrl"
              alt="Logo do projeto"
              class="h-14 w-14 rounded-lg border border-stroke bg-surface object-contain p-1.5"
            />
            <div>
              <input
                ref="logoFileInput"
                type="file"
                accept="image/*"
                class="text-xs text-text-muted file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border file:border-stroke file:text-xs file:font-semibold file:bg-surface file:text-text-strong hover:file:bg-surface-raised cursor-pointer"
                @change="onLogoFile"
              />
              <p class="text-[11px] text-text-muted mt-1">Formatos aceitos: PNG, SVG, WebP, JPG.</p>
            </div>
          </div>
          <p v-else class="text-xs text-text-muted">
            Salve o projeto primeiro para habilitar o envio do logotipo.
          </p>
        </div>

        <!-- GALERIA DE IMAGENS DO PROJETO (CARROSSEL) -->
        <div class="p-5 rounded-xl border border-stroke bg-surface-raised/40 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-body-sm font-semibold text-text-strong">
                Galeria de Imagens do Projeto (Carrossel no Site)
              </h4>
              <p class="text-xs text-text-muted">
                Adicione screenshots, mockups ou fotos do produto para serem exibidos em carrossel
                no card do projeto.
              </p>
            </div>
            <span
              class="font-mono text-xs px-2.5 py-1 rounded bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30"
            >
              {{ (editing.galleryUrls || editing.gallery || []).length }} fotos
            </span>
          </div>

          <!-- File upload input for gallery -->
          <div v-if="editing.id" class="space-y-3">
            <div class="flex flex-wrap items-center gap-3">
              <input
                ref="galleryFileInput"
                type="file"
                accept="image/*"
                multiple
                class="text-xs text-text-muted file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border file:border-stroke file:text-xs file:font-semibold file:bg-surface file:text-text-strong hover:file:bg-surface-raised cursor-pointer"
                @change="onGalleryFiles"
              />
              <span v-if="uploadingGallery" class="text-xs text-brand-cyan font-mono animate-pulse">
                Enviando imagens…
              </span>
            </div>

            <!-- Adicionar URL externa opcional -->
            <div class="flex gap-2 pt-2">
              <input
                v-model="newImageUrl"
                class="field-control text-xs h-10"
                placeholder="Ou cole a URL direta de uma imagem externa (https://...)"
              />
              <button
                type="button"
                class="ghost-button h-10 px-4 text-xs whitespace-nowrap cursor-pointer"
                @click="addImageUrlDirect"
              >
                Adicionar URL
              </button>
            </div>

            <!-- Grid de Imagens da Galeria -->
            <div
              v-if="(editing.galleryUrls || editing.gallery || []).length > 0"
              class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-3"
            >
              <div
                v-for="(img, idx) in editing.galleryUrls?.length
                  ? editing.galleryUrls
                  : editing.gallery"
                :key="idx"
                class="relative rounded-lg border border-stroke bg-surface overflow-hidden group aspect-video"
              >
                <img :src="img" alt="Screenshot do projeto" class="w-full h-full object-cover" />
                <button
                  type="button"
                  class="absolute top-1 right-1 h-6 w-6 rounded-md bg-danger text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                  title="Excluir imagem da galeria"
                  @click="removeGalleryItem(idx)"
                >
                  <span class="material-symbols-outlined text-[14px]">delete</span>
                </button>
                <span
                  class="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-white"
                >
                  #{{ idx + 1 }}
                </span>
              </div>
            </div>
          </div>
          <p v-else class="text-xs text-text-muted">
            Salve o projeto primeiro para habilitar o envio de imagens para a galeria.
          </p>
        </div>

        <!-- Buttons -->
        <div class="flex items-center gap-3 pt-2">
          <button type="submit" class="brand-button cursor-pointer" :disabled="saving">
            <span>{{ saving ? 'Salvando…' : 'Salvar projeto' }}</span>
          </button>
          <button type="button" class="ghost-button cursor-pointer" @click="editing = null">
            Fechar
          </button>
        </div>
      </form>
    </section>
  </div>
</template>
