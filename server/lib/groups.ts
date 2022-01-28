import cryptoRandomString from 'crypto-random-string';
import { Group, GroupRole, User } from "@prisma/client";
import db from "@server/services/db";

export function createGroup(user: User, name: string) {
  return db.group.create({
    data: {
      name,
      inviteCodes: {
        create: [
          {
            createdById: user.id,
            code: genGroupInviteCodeString()
          } 
        ]
      },
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

export function getGroupsForUser(user: User) {
  return db.group.findMany({
    where: {
      memberships: {
        some: {
          userId: user.id
        }
      }
    }
  })
}

export async function createGroupInviteCode(user: User, group: Group) {
  const canCreateGroup = (await db.groupMembership.findFirst({
    where: {
      role: GroupRole.ADMIN,
      userId: user.id,
      groupId: group.id
    }
  })) !== null

  if (!canCreateGroup) {
    return null
  }

  const code = genGroupInviteCodeString()

  return db.groupInviteCode.create({
    data: {
      createdById: user.id,
      groupId: group.id,
      code,
    }
  })
}

export function getGroupInviteCode(group: Group) {
  return db.groupInviteCode.findFirst({
    where: {
      groupId: group.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export function getGroupByInviteCode(inviteCode: string) {
  return db.group.findFirst({
    where: {
      inviteCodes: {
        some: {
          code: inviteCode
        }
      }
    }
  })
}

function genGroupInviteCodeString(): string {
  return cryptoRandomString({
    length: 32,
    type: 'url-safe'
  })
}

export async function joinGroup(user: User, inviteCode: string) {
  const inviteCodeRecord = await db.groupInviteCode.findFirst({
    where: {
      code: inviteCode
    }
  })
  if (!inviteCodeRecord) {
    return null
  }

  const isUserAMember = await db.group.findFirst({
    where: {
      memberships: {
        some: {
          userId: user.id
        }
      }
    }
  })
  if (isUserAMember) {
    return isUserAMember
  }

  const {group} = await db.groupMembership.create({
    data: {
      role: GroupRole.MEMBER,
      groupId: inviteCodeRecord.groupId,
      userId: user.id
    },
    include: {
      group: true
    }
  })

  return group
}