import { PrismaClient, User } from '@prisma/client';
import { IronSessionData } from 'iron-session'

declare module 'iron-session' {
  interface IronSessionData {
    inviteCode?: string
    userId?: string
  }
}

declare global {
  var prismaClient: PrismaClient | undefined
}
