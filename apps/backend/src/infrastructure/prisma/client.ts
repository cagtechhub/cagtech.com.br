import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './output/client.ts'
import pg from 'pg'

import { env } from '../../env.ts'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createClient() {
  const pool = new pg.Pool({ connectionString: env.databaseUrl })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
