import { defineStore } from 'pinia'

import type { NotifyPushOptions, NotifyToastRecord, NotifyVariant } from '~/types/notify'

const DEFAULT_DURATION: Record<NotifyVariant, number> = {
  success: 4_500,
  error: 9_000,
  warning: 6_500,
  info: 5_000,
}

const MAX_VISIBLE = 5

function createToastId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

export const useNotifyStore = defineStore('notify', () => {
  const toasts = ref<NotifyToastRecord[]>([])
  const timers = new Map<string, ReturnType<typeof setTimeout>>()

  function clearTimer(id: string): void {
    const t = timers.get(id)
    if (t !== undefined) {
      clearTimeout(t)
      timers.delete(id)
    }
  }

  function dismiss(id: string): void {
    clearTimer(id)
    toasts.value = toasts.value.filter((item) => item.id !== id)
  }

  function push(options: NotifyPushOptions): string {
    const id = createToastId()
    const durationMs =
      options.durationMs !== undefined ? options.durationMs : DEFAULT_DURATION[options.variant]

    const record: NotifyToastRecord = {
      id,
      title: options.title,
      message: options.message,
      variant: options.variant,
      durationMs,
    }

    let next = [...toasts.value, record]
    if (next.length > MAX_VISIBLE) {
      const overflow = next.length - MAX_VISIBLE
      const removed = next.slice(0, overflow)
      for (const r of removed) {
        clearTimer(r.id)
      }
      next = next.slice(-MAX_VISIBLE)
    }
    toasts.value = next

    if (durationMs > 0) {
      clearTimer(id)
      timers.set(
        id,
        setTimeout(() => {
          dismiss(id)
        }, durationMs),
      )
    }

    return id
  }

  function success(title: string, message?: string, durationMs?: number): string {
    return push({ variant: 'success', title, message, durationMs })
  }

  function error(title: string, message?: string, durationMs?: number): string {
    return push({ variant: 'error', title, message, durationMs })
  }

  function warning(title: string, message?: string, durationMs?: number): string {
    return push({ variant: 'warning', title, message, durationMs })
  }

  function info(title: string, message?: string, durationMs?: number): string {
    return push({ variant: 'info', title, message, durationMs })
  }

  return {
    toasts,
    push,
    dismiss,
    success,
    error,
    warning,
    info,
  }
})
