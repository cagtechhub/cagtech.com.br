import { randomUUID } from 'node:crypto'

import {
  createLeadSchema,
  faqInputSchema,
  packageInputSchema,
  projectInputSchema,
  testimonialInputSchema,
  updateLeadSchema,
  updateSiteSettingsSchema,
  type LeadRecord,
  type LeadStatus,
  type PackageRecord,
  type ProjectRecord,
} from '@cagtech/shared'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { HTTPException } from 'hono/http-exception'

import { env } from './env.ts'
import { prisma } from './infrastructure/prisma/client.ts'
import { publicLogoUrl, requireAdmin, storageClient, type AdminUser } from './lib/auth.ts'
import { mapSettings, parseReasons } from './lib/mappers.ts'

type Variables = { admin: AdminUser }

const app = new Hono<{ Variables: Variables }>()

const origins = new Set(
  [env.webOrigin, 'http://localhost:3000', 'http://127.0.0.1:3000']
    .map((item) => item.replace(/\/$/, ''))
    .filter(Boolean),
)

app.use(
  '*',
  cors({
    origin: (origin) => (origin && origins.has(origin.replace(/\/$/, '')) ? origin : ''),
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
)

app.onError((error, c) => {
  if (error instanceof HTTPException) {
    return c.json({ message: error.message }, error.status)
  }
  console.error(error)
  return c.json({ message: 'Erro interno' }, 500)
})

app.get('/health', (c) => c.json({ ok: true, service: 'cagtech-backend' }))

function jsonIncludes(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => String(item)) : []
}

function mapPackage(row: {
  id: string
  name: string
  subtitle: string
  priceDisplay: string
  priceFootnote: string | null
  includes: unknown
  featured: boolean
  sortOrder: number
  active: boolean
}): PackageRecord {
  return {
    id: row.id,
    name: row.name,
    subtitle: row.subtitle,
    priceDisplay: row.priceDisplay,
    priceFootnote: row.priceFootnote,
    includes: jsonIncludes(row.includes),
    featured: row.featured,
    sortOrder: row.sortOrder,
    active: row.active,
  }
}

function mapProject(row: {
  id: string
  name: string
  siteUrl: string | null
  clientName: string
  logoPath: string | null
  sortOrder: number
  active: boolean
}): ProjectRecord {
  return {
    id: row.id,
    name: row.name,
    siteUrl: row.siteUrl,
    clientName: row.clientName,
    logoPath: row.logoPath,
    logoUrl: publicLogoUrl(row.logoPath),
    sortOrder: row.sortOrder,
    active: row.active,
  }
}

function mapLead(row: {
  id: string
  fullName: string
  email: string
  reason: string | null
  budget: { toNumber?: () => number } | number | null
  message: string | null
  status: LeadStatus
  sortOrder: number
  notes: string | null
  createdAt: Date
  updatedAt: Date
}): LeadRecord {
  const budget =
    row.budget == null
      ? null
      : typeof row.budget === 'number'
        ? row.budget
        : Number(row.budget.toNumber?.() ?? row.budget)
  return {
    id: row.id,
    fullName: row.fullName,
    email: row.email,
    reason: parseReasons(row.reason),
    budget: Number.isNaN(budget) ? null : budget,
    message: row.message ?? '',
    status: row.status,
    sortOrder: row.sortOrder,
    notes: row.notes,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

async function getSettingsOrThrow() {
  const existing = await prisma.siteSettings.findFirst()
  if (existing) return existing
  return prisma.siteSettings.create({
    data: { id: 'default', siteName: 'CAG Tech', seoLocality: 'Campo Grande, MS' },
  })
}

app.get('/public/settings', async (c) => {
  const row = await getSettingsOrThrow()
  return c.json(mapSettings(row))
})

app.get('/public/landing', async (c) => {
  const [settings, packages, projects, testimonials, faqs] = await Promise.all([
    getSettingsOrThrow(),
    prisma.package.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.project.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.testimonial.findMany({
      where: { active: true },
      orderBy: { sortOrder: 'asc' },
      include: { project: true },
    }),
    prisma.faq.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
  ])

  return c.json({
    settings: {
      packagesIntroTitle: settings.packagesIntroTitle,
      packagesIntroBody: settings.packagesIntroBody,
      initialProjectTitle: settings.initialProjectTitle,
      initialProjectLead: settings.initialProjectLead,
      initialProjectBullets: jsonIncludes(settings.initialProjectBullets),
    },
    packages: packages.map(mapPackage),
    projects: projects.map(mapProject),
    testimonials: testimonials.map((item) => ({
      id: item.id,
      title: item.title,
      body: item.body,
      projectId: item.projectId,
      sortOrder: item.sortOrder,
      active: item.active,
      project: {
        id: item.project.id,
        name: item.project.name,
        clientName: item.project.clientName,
        siteUrl: item.project.siteUrl,
        logoUrl: publicLogoUrl(item.project.logoPath),
      },
    })),
    faqs: faqs.map((item) => ({
      id: item.id,
      question: item.question,
      answer: item.answer,
      sortOrder: item.sortOrder,
      active: item.active,
    })),
  })
})

app.post('/public/contacts', async (c) => {
  const parsed = createLeadSchema.safeParse(await c.req.json())
  if (!parsed.success) {
    throw new HTTPException(400, { message: 'Dados do formulário incompletos' })
  }
  await prisma.contact.create({
    data: {
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      reason: JSON.stringify(parsed.data.reason),
      budget: parsed.data.budget,
      message: parsed.data.message,
      status: 'novo',
    },
  })
  return c.json({ success: true })
})

const admin = new Hono<{ Variables: Variables }>()
admin.use('*', requireAdmin)

admin.get('/dashboard', async (c) => {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const [contactsNew, contactsTotal, packagesCount, projectsCount, settings] = await Promise.all([
    prisma.contact.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.contact.count(),
    prisma.package.count(),
    prisma.project.count(),
    getSettingsOrThrow(),
  ])
  return c.json({
    contactsNew,
    contactsTotal,
    packagesCount,
    projectsCount,
    siteName: settings.siteName,
    noIndex: settings.noIndex,
  })
})

admin.get('/settings', async (c) => c.json(mapSettings(await getSettingsOrThrow())))

admin.put('/settings', async (c) => {
  const parsed = updateSiteSettingsSchema.safeParse(await c.req.json())
  if (!parsed.success) {
    throw new HTTPException(400, { message: 'Payload inválido' })
  }
  await getSettingsOrThrow()
  const updated = await prisma.siteSettings.update({
    where: { id: 'default' },
    data: parsed.data,
  })
  return c.json(mapSettings(updated))
})

admin.get('/leads', async (c) => {
  const rows = await prisma.contact.findMany({
    orderBy: [{ status: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
  })
  return c.json(rows.map(mapLead))
})

admin.patch('/leads/:id', async (c) => {
  const parsed = updateLeadSchema.safeParse(await c.req.json())
  if (!parsed.success) {
    throw new HTTPException(400, { message: 'Payload inválido' })
  }
  const updated = await prisma.contact.update({
    where: { id: c.req.param('id') },
    data: parsed.data,
  })
  return c.json(mapLead(updated))
})

admin.get('/packages', async (c) => {
  const rows = await prisma.package.findMany({ orderBy: { sortOrder: 'asc' } })
  return c.json(rows.map(mapPackage))
})

admin.post('/packages', async (c) => {
  const parsed = packageInputSchema.safeParse(await c.req.json())
  if (!parsed.success) throw new HTTPException(400, { message: 'Payload inválido' })
  const created = await prisma.package.create({ data: parsed.data })
  return c.json(mapPackage(created), 201)
})

admin.put('/packages/:id', async (c) => {
  const parsed = packageInputSchema.partial().safeParse(await c.req.json())
  if (!parsed.success) throw new HTTPException(400, { message: 'Payload inválido' })
  const updated = await prisma.package.update({
    where: { id: c.req.param('id') },
    data: parsed.data,
  })
  return c.json(mapPackage(updated))
})

admin.delete('/packages/:id', async (c) => {
  await prisma.package.delete({ where: { id: c.req.param('id') } })
  return c.json({ ok: true })
})

admin.get('/projects', async (c) => {
  const rows = await prisma.project.findMany({ orderBy: { sortOrder: 'asc' } })
  return c.json(rows.map(mapProject))
})

admin.post('/projects', async (c) => {
  const parsed = projectInputSchema.safeParse(await c.req.json())
  if (!parsed.success) throw new HTTPException(400, { message: 'Payload inválido' })
  const created = await prisma.project.create({ data: parsed.data })
  return c.json(mapProject(created), 201)
})

admin.put('/projects/:id', async (c) => {
  const parsed = projectInputSchema.partial().safeParse(await c.req.json())
  if (!parsed.success) throw new HTTPException(400, { message: 'Payload inválido' })
  const updated = await prisma.project.update({
    where: { id: c.req.param('id') },
    data: parsed.data,
  })
  return c.json(mapProject(updated))
})

admin.delete('/projects/:id', async (c) => {
  await prisma.project.delete({ where: { id: c.req.param('id') } })
  return c.json({ ok: true })
})

admin.post('/projects/:id/logo', async (c) => {
  const body = await c.req.parseBody()
  const file = body.file
  if (!(file instanceof File)) {
    throw new HTTPException(400, { message: 'Arquivo ausente' })
  }
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
  const path = `${c.req.param('id')}/${randomUUID()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())
  const supabase = storageClient()
  await supabase.storage.createBucket('project-logos', { public: true }).catch(() => undefined)
  const { error } = await supabase.storage.from('project-logos').upload(path, buffer, {
    contentType: file.type || 'image/png',
    upsert: true,
  })
  if (error) {
    throw new HTTPException(500, { message: error.message })
  }
  const updated = await prisma.project.update({
    where: { id: c.req.param('id') },
    data: { logoPath: path },
  })
  return c.json(mapProject(updated))
})

admin.get('/testimonials', async (c) => {
  const rows = await prisma.testimonial.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { project: true },
  })
  return c.json(
    rows.map((item) => ({
      id: item.id,
      title: item.title,
      body: item.body,
      projectId: item.projectId,
      sortOrder: item.sortOrder,
      active: item.active,
      project: {
        id: item.project.id,
        name: item.project.name,
        clientName: item.project.clientName,
        siteUrl: item.project.siteUrl,
        logoUrl: publicLogoUrl(item.project.logoPath),
      },
    })),
  )
})

admin.post('/testimonials', async (c) => {
  const parsed = testimonialInputSchema.safeParse(await c.req.json())
  if (!parsed.success) throw new HTTPException(400, { message: 'Payload inválido' })
  const created = await prisma.testimonial.create({
    data: parsed.data,
    include: { project: true },
  })
  return c.json(created, 201)
})

admin.put('/testimonials/:id', async (c) => {
  const parsed = testimonialInputSchema.partial().safeParse(await c.req.json())
  if (!parsed.success) throw new HTTPException(400, { message: 'Payload inválido' })
  const updated = await prisma.testimonial.update({
    where: { id: c.req.param('id') },
    data: parsed.data,
    include: { project: true },
  })
  return c.json(updated)
})

admin.delete('/testimonials/:id', async (c) => {
  await prisma.testimonial.delete({ where: { id: c.req.param('id') } })
  return c.json({ ok: true })
})

admin.get('/faqs', async (c) => {
  const rows = await prisma.faq.findMany({ orderBy: { sortOrder: 'asc' } })
  return c.json(rows)
})

admin.post('/faqs', async (c) => {
  const parsed = faqInputSchema.safeParse(await c.req.json())
  if (!parsed.success) throw new HTTPException(400, { message: 'Payload inválido' })
  const created = await prisma.faq.create({ data: parsed.data })
  return c.json(created, 201)
})

admin.put('/faqs/:id', async (c) => {
  const parsed = faqInputSchema.partial().safeParse(await c.req.json())
  if (!parsed.success) throw new HTTPException(400, { message: 'Payload inválido' })
  const updated = await prisma.faq.update({
    where: { id: c.req.param('id') },
    data: parsed.data,
  })
  return c.json(updated)
})

admin.delete('/faqs/:id', async (c) => {
  await prisma.faq.delete({ where: { id: c.req.param('id') } })
  return c.json({ ok: true })
})

app.route('/admin', admin)

export { app }
