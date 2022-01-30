import { PrismaClient } from '@prisma/client'

if (!global.prismaClient) {
  global.prismaClient = new PrismaClient()
}

const db = global.prismaClient as PrismaClient

export default db
