import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  console.log(body)
  const supabase = createClient(config.private.supabaseUrl, config.private.supabaseKey)
  const { data, error } = await supabase
    .schema(config.private.supabaseSchema)
    .from('contacts')
    .insert({
      full_name: body.fullName,
      email: body.email,
      reason: JSON.stringify(body.reason || []),
      budget: body.budget,
      message: body.message,
    })
  console.log(data)

  if (error) {
    return { success: false, error: error.message, details: error.details }
  }

  return { success: true, data }
})
