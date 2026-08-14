import { z } from 'zod'

export const packageInputSchema = z.object({
  name: z.string().trim().min(1).max(120),
  subtitle: z.string().trim().max(240).default(''),
  priceDisplay: z.string().trim().min(1).max(80),
  priceFootnote: z.string().trim().max(400).optional().nullable(),
  includes: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  active: z.boolean().default(true),
})

export const projectInputSchema = z.object({
  name: z.string().trim().min(1).max(160),
  siteUrl: z.string().trim().max(500).optional().nullable(),
  clientName: z.string().trim().min(1).max(160),
  sortOrder: z.number().int().default(0),
  active: z.boolean().default(true),
})

export const testimonialInputSchema = z.object({
  title: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(4000),
  projectId: z.string().uuid(),
  sortOrder: z.number().int().default(0),
  active: z.boolean().default(true),
})

export const faqInputSchema = z.object({
  question: z.string().trim().min(1).max(400),
  answer: z.string().trim().min(1).max(4000),
  sortOrder: z.number().int().default(0),
  active: z.boolean().default(true),
})

export type PackageInput = z.infer<typeof packageInputSchema>
export type ProjectInput = z.infer<typeof projectInputSchema>
export type TestimonialInput = z.infer<typeof testimonialInputSchema>
export type FaqInput = z.infer<typeof faqInputSchema>

export type PackageRecord = PackageInput & { id: string }
export type ProjectRecord = ProjectInput & {
  id: string
  logoPath: string | null
  logoUrl: string | null
}
export type TestimonialRecord = {
  id: string
  title: string
  body: string
  projectId: string
  sortOrder: number
  active: boolean
  project?: Pick<ProjectRecord, 'id' | 'name' | 'clientName' | 'siteUrl' | 'logoUrl'>
}
export type FaqRecord = FaqInput & { id: string }

export type LandingContent = {
  settings: {
    packagesIntroTitle: string
    packagesIntroBody: string
    initialProjectTitle: string
    initialProjectLead: string
    initialProjectBullets: string[]
  }
  packages: PackageRecord[]
  projects: ProjectRecord[]
  testimonials: TestimonialRecord[]
  faqs: FaqRecord[]
}
