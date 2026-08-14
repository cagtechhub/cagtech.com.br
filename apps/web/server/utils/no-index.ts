/** Alinhado ao tratamento de `noIndex` em `runtimeConfig.public` (Nuxt / env). */
export function noIndexFromRuntimeConfig(config: { public?: Record<string, unknown> }): boolean {
  const v = config.public?.noIndex
  return v === true || v === 'true' || v === '1'
}
