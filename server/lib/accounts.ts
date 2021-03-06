import { User } from '@prisma/client'
import db from '../services/db'

interface AccountData {
  displayName: string
}

export interface UserWithEmail extends User {
  email: string
}

export async function getOrCreateUserFromEmail(
  email: string
): Promise<UserWithEmail> {
  const user = await db.user.upsert({
    where: {
      email,
    },
    create: {
      email
    },
    update: {
      email
    }
  })

  return user as UserWithEmail
}

export async function getOrCreateUserFromTwitter(
  twitterId: string,
  { displayName }: AccountData
): Promise<User> {
  const existingUser = await db.user.findFirst({
    where: {
      twitterId,
    },
  })
  if (existingUser) {
    return db.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        displayName,
      },
    })
  }

  return await db.user.create({
    data: {
      twitterId,
      displayName,
    },
  })
}

export async function getById(id: string): Promise<User | null> {
  return await db.user.findFirst({
    where: {
      id,
    },
  })
}

export async function updateDisplayName(user: User, displayName: string) {
  return await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      displayName
    }
  })
}