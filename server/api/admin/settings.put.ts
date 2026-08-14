import { updateSiteSettingsSchema } from '#shared/schemas/settings'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)
  const parsed = updateSiteSettingsSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Dados inválidos',
      message: parsed.error.issues.map((issue) => issue.message).join('; '),
    })
  }

  return await updateSiteSettings(event, parsed.data)
})
