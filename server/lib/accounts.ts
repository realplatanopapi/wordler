import { User } from "@prisma/client";
import db from "../services/db";

interface AccountData {
  displayName: string
}

export async function getOrCreateUserFromTwitter(twitterId: string, {
  displayName,
}: AccountData): Promise<User> {
  const existingUser = await db.user.findFirst({
    where: {
      twitterId
    }
  })
  if (existingUser) {
    return db.user.update({
      where: {
        id: existingUser.id
      },
      data: {
        displayName
      }
    })
  }

  return await db.user.create({
    data: {
      twitterId,
      displayName
    }
  })
}

export async function getById(id: string): Promise<User | null> {
  return await db.user.findFirst({
    where: {
      id
    }
  })
}