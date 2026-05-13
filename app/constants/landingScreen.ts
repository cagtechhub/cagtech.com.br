/**
 * IDs de seção da home: única fonte de verdade para âncoras e menu.
 * Importe `LANDING_ANCHOR` nos `<section>` e derive `href` com `landingHref`.
 */
export const LANDING_ANCHOR = {
  home: 'home',
  services: 'services',
  work: 'work',
  process: 'process',
  about: 'about',
  contact: 'contact',
} as const

export type LandingAnchorId = (typeof LANDING_ANCHOR)[keyof typeof LANDING_ANCHOR]

export function landingHref(id: LandingAnchorId): string {
  return `#${id}`
}

export const LANDING_NAV_ITEMS = [
  { id: LANDING_ANCHOR.home, label: 'Início' },
  { id: LANDING_ANCHOR.services, label: 'Serviços' },
  { id: LANDING_ANCHOR.work, label: 'Trabalhos' },
  { id: LANDING_ANCHOR.process, label: 'Processo' },
  { id: LANDING_ANCHOR.about, label: 'Sobre' },
  { id: LANDING_ANCHOR.contact, label: 'Contato' },
] as const satisfies ReadonlyArray<{ id: LandingAnchorId; label: string }>
