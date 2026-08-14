import { z } from 'zod'

export const leadStatuses = ['novo', 'conversa', 'proposta', 'ganho', 'perdido'] as const
export type LeadStatus = (typeof leadStatuses)[number]

export const createLeadSchema = z.object({
  fullName: z.string().trim().min(1).max(200),
  email: z.string().trim().email(),
  reason: z.array(z.string()).min(1),
  budget: z.number().min(1250).max(25000),
  message: z.string().trim().min(1).max(1000),
})

export const updateLeadSchema = z.object({
  status: z.enum(leadStatuses).optional(),
  sortOrder: z.number().int().optional(),
  notes: z.string().max(4000).optional().nullable(),
})

export type CreateLeadInput = z.infer<typeof createLeadSchema>
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>

export type LeadRecord = {
  id: string
  fullName: string
  email: string
  reason: string[]
  budget: number | null
  message: string
  status: LeadStatus
  sortOrder: number
  notes: string | null
  createdAt: string
  updatedAt: string
}
