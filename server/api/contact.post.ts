import { createSupabaseServerClient } from '../utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const fullName = String(body?.fullName ?? '').trim()
  const email = String(body?.email ?? '').trim()
  const message = String(body?.message ?? '').trim()
  const budget = Number(body?.budget)
  const reason = Array.isArray(body?.reason) ? body.reason : []

  if (!fullName || !email || !message || Number.isNaN(budget)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Dados do formulário incompletos',
    })
  }

  const supabase = createSupabaseServerClient()

  const { error } = await supabase.from('contacts').insert({
    full_name: fullName,
    email,
    reason: JSON.stringify(reason),
    budget,
    message,
  })

  if (error) {
    console.error('[contact.post] Supabase:', error.message, error.details, error.hint)

    const isSchemaPermission =
      error.code === '42501' || /permission denied for schema/i.test(error.message)

    throw createError({
      statusCode: isSchemaPermission ? 503 : 500,
      statusMessage: isSchemaPermission
        ? 'Banco sem permissão no schema configurado'
        : 'Não foi possível salvar o contato',
      message: isSchemaPermission
        ? 'No Supabase: exponha o schema em API → Exposed schemas e execute supabase/migrations/001_cagtech_contacts.sql (GRANTs).'
        : error.message,
    })
  }

  return { success: true }
})
