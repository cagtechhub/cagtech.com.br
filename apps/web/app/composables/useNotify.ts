import { storeToRefs } from 'pinia'

import type { NotifyPushOptions } from '~/types/notify'

/**
 * Notificações globais (popup). Requer `<NotifyStack />` no layout (ex.: `default.vue`).
 */
export function useNotify() {
  const store = useNotifyStore()
  const { toasts } = storeToRefs(store)

  return {
    toasts,
    push: (options: NotifyPushOptions) => store.push(options),
    dismiss: (id: string) => store.dismiss(id),
    success: (title: string, message?: string, durationMs?: number) =>
      store.success(title, message, durationMs),
    error: (title: string, message?: string, durationMs?: number) =>
      store.error(title, message, durationMs),
    warning: (title: string, message?: string, durationMs?: number) =>
      store.warning(title, message, durationMs),
    info: (title: string, message?: string, durationMs?: number) =>
      store.info(title, message, durationMs),
  }
}
