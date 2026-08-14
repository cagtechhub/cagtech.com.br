export type AdminDashboardStats = {
  contactsNew: number
  contactsTotal: number
  siteName: string
  noIndex: boolean
}

export type ContactRecord = {
  id: string
  fullName: string
  email: string
  reason: string[]
  budget: number | null
  message: string
  createdAt: string
}
