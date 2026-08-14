export interface LandingNavItem {
  label: string
  href: string
}

export interface LandingService {
  title: string
  description: string
  icon: string
}

export interface LandingDifferentiator {
  title: string
  description: string
  icon: string
}

export interface LandingTestimonial {
  title: string
  quote: string
  name: string
  role: string
  siteUrl?: string
  logoUrl?: string
}

export interface LandingFaqItem {
  question: string
  answer: string
}

export interface LandingSocialLink {
  label: string
  href: string
}

/** Destaque do modelo de parceria (domínio, hospedagem, gestão). */
export interface LandingInitialProject {
  title: string
  lead: string
  bullets: string[]
}

/** Pacotes comerciais (valores indicativos editáveis na store). */
export interface LandingPackage {
  name: string
  subtitle: string
  /** Ex.: `R$ 2.490` ou `R$ X.XXX` enquanto não houver tabela fechada. */
  priceDisplay: string
  priceFootnote?: string
  includes: string[]
  featured?: boolean
}
