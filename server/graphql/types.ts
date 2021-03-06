import { Group, WordleResult } from '@prisma/client'
import { getById } from '@server/lib/accounts'
import {
  GraphQLEnumType,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLString,
  Kind,
} from 'graphql'
import { GraphQLContext } from './schema'
import { WordleGuessResult } from '@server/lib/wordles'
import { checkIsMemberOfGroup, getInviteLink } from '@server/lib/groups'

export const DateType = new GraphQLScalarType<Date | null, string>({
  name: 'Date',
  serialize(value: any) {
    return new Date(value).toISOString()
  },
  parseValue(value) {
    return value ? new Date(value as string) : null
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value)
    }

    return null
  },
})

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    displayName: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
})

export const GroupType = new GraphQLObjectType<Group, GraphQLContext>({
  name: 'Group',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    inviteLink: {
      type: GraphQLString,
      resolve: async (group, _args, context) => {
        if (!context.user) {
          return null
        }

        const isMemberOfGroup = await checkIsMemberOfGroup(group, context.user)
        if (!isMemberOfGroup) {
          return null
        }

        return getInviteLink(group)
      },
    },
  },
})

export const WordleGuessResultType = new GraphQLEnumType({
  name: 'WordleGuessResult',
  values: {
    EXACT_MATCH: {
      value: WordleGuessResult.EXACT_MATCH,
    },
    IN_WORD: {
      value: WordleGuessResult.IN_WORD,
    },
    NOT_IN_WORD: {
      value: WordleGuessResult.NOT_IN_WORD,
    },
  },
})

export const WordleResultType = new GraphQLObjectType<
  WordleResult,
  GraphQLContext
>({
  name: 'WordleResult',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    createdAt: {
      type: new GraphQLNonNull(DateType),
    },
    attemptsUsed: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    maxAttempts: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    score: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    guesses: {
      type: new GraphQLNonNull(
        new GraphQLList(
          new GraphQLNonNull(
            new GraphQLList(new GraphQLNonNull(WordleGuessResultType))
          )
        )
      ),
    },
    user: {
      type: new GraphQLNonNull(UserType),
      resolve: async (result) => {
        return await getById(result.userId)
      },
    },
  },
})

export const LeaderboardEntryType = new GraphQLObjectType({
  name: 'LeaderboardEntry',
  fields: {
    score: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    user: {
      type: new GraphQLNonNull(UserType),
    },
  },
})

export const LeaderboardType = new GraphQLObjectType({
  name: 'Leaderboard',
  fields: {
    entries: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(LeaderboardEntryType))
      ),
    },
  },
})
