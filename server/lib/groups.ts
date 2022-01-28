import { GroupRole, User } from "@prisma/client";
import db from "@server/services/db";

export function createGroup(user: User, name: string) {
  return db.group.create({
    data: {
      name,
      memberships: {
        create: [
          {
            role: GroupRole.ADMIN,
            userId: user.id
          }
        ]
      }
    }
  })
}

export function getGroupById(id: string) {
  return db.group.findFirst({
    where: {
      id
    }
  })
}