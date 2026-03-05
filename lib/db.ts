import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { Pool, neonConfig } from "@neondatabase/serverless"
import ws from "ws"

// Use WebSocket for Neon serverless in Node.js runtime
neonConfig.webSocketConstructor = ws

function createPrismaClient() {
  const connectionString = process.env.POSTGRES_PRISMA_URL!
  const pool = new Pool({ connectionString })
  const adapter = new PrismaNeon(pool)
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }
export const prisma = globalForPrisma.prisma ?? createPrismaClient()
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
