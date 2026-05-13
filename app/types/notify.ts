export type NotifyVariant = 'success' | 'error' | 'warning' | 'info'

export interface NotifyPushOptions {
  title: string
  message?: string
  variant: NotifyVariant
  /** Tempo até sumir; `0` mantém até fechar manualmente. Padrão varia por tipo. */
  durationMs?: number
}

export interface NotifyToastRecord extends Required<Pick<NotifyPushOptions, 'title' | 'variant'>> {
  id: string
  message?: string
  durationMs: number
}
