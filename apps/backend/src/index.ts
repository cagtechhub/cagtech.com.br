import { serve } from '@hono/node-server'

import { app } from './app.ts'
import { env } from './env.ts'

serve({ fetch: app.fetch, port: env.port }, (info) => {
  console.log(`cagtech-backend listening on ${info.port}`)
})
