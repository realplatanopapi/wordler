import cryptoRandomString from 'crypto-random-string'
import { Group, GroupRole, User } from '@prisma/client'
import db from '@server/services/db'
import slugify from 'slugify'
import config from '@server/config'
import { ErrorWithCode } from '@server/errors';
import { BAD_INPUT, NAME_ALREADY_TAKEN } from '@server/errors/codes'

export async function startGroup(user: User, name: string) {
  const nameTrimmed = name.trim()
  if (nameTrimmed.length === 0) {
    throw new ErrorWithCode(BAD_INPUT)
  }

  const slug = slugify(nameTrimmed, {
    lower: true,
    replacement: '_',
    strict: true,
    trim: true,
  })

  const isNameTaken = await isGroupSlugTaken(slug)
  if (isNameTaken) {
    throw new ErrorWithCode(NAME_ALREADY_TAKEN)
  }

  return db.group.create({
    data: {
      name: nameTrimmed,
      slug,
      inviteCodes: {
        create: [
          {
            createdById: user.id,
            code: genGroupInviteCodeString(),
          },
        ],
      },
      memberships: {
        create: [
          {
            role: GroupRole.ADMIN,
            userId: user.id,
          },
        ],
      },
    },
  })
}

export async function isGroupSlugTaken(slug: string) {
  const count = await db.group.count({
    where: {
      slug,
    },
  })

  return count > 0
}

export function getGroupById(id: string) {
  return db.group.findFirst({
    where: {
      id,
    },
  })
}

export function getGroupBySlug(slug: string) {
  return db.group.findFirst({
    where: {
      slug,
    },
  })
}

export function getGroupsForUser(user: User) {
  return db.group.findMany({
    where: {
      memberships: {
        some: {
          userId: user.id,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })
}

export async function createGroupInviteCode(user: User, group: Group) {
  const canCreateGroup =
    (await db.groupMembership.findFirst({
      where: {
        role: GroupRole.ADMIN,
        userId: user.id,
        groupId: group.id,
      },
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
    },
  })
}

export function getGroupInviteCode(group: Group) {
  return db.groupInviteCode.findFirst({
    where: {
      groupId: group.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function getGroupWithInviteCode(inviteCode: string) {
  return db.group.findFirst({
    where: {
      inviteCodes: {
        some: {
          code: inviteCode,
        },
      },
    },
  })
}

function genGroupInviteCodeString(): string {
  return cryptoRandomString({
    length: 32,
    type: 'url-safe',
  })
}

export async function joinGroup(user: User, inviteCode: string) {
  const inviteCodeRecord = await db.groupInviteCode.findFirst({
    where: {
      code: inviteCode,
    },
  })
  if (!inviteCodeRecord) {
    return null
  }

  const isUserAMember = await db.group.findFirst({
    where: {
      memberships: {
        some: {
          userId: user.id,
        },
      },
    },
  })
  if (isUserAMember) {
    return isUserAMember
  }

  const { group } = await db.groupMembership.create({
    data: {
      role: GroupRole.MEMBER,
      groupId: inviteCodeRecord.groupId,
      userId: user.id,
    },
    include: {
      group: true,
    },
  })

  return group
}

export async function checkIsMemberOfGroup(
  group: Group,
  user: User
): Promise<boolean> {
  const membership = await db.groupMembership.findFirst({
    where: {
      groupId: group.id,
      userId: user.id,
    },
  })

  return Boolean(membership)
}

export async function getInviteLink(group: Group): Promise<string | null> {
  const inviteCode = await getGroupInviteCode(group)
  if (!inviteCode) {
    return null
  }

  return `${config.get('appUrl')}/accept-invite?inviteCode=${inviteCode.code}`
}
