import { User } from '@prisma/client'
import { ErrorWithCode } from '@server/errors'
import { NOT_AUTHORIZED } from '@server/errors/codes'
import { updateDisplayName } from '@server/lib/accounts'
import { sendLogInEmail } from '@server/lib/auth'
import {
  getGroupWithInviteCode,
  getGroupsForUser,
  startGroup,
  joinGroup,
} from '@server/lib/groups'
import {
  addResultsForUser,
  canPostResults,
  getLeaderboard,
  queryResults,
} from '@server/lib/wordles'
import { addDays, addMinutes, subMinutes } from 'date-fns'
import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql'
import sanitize from 'sanitize-html'
import {
  DateType,
  GroupType,
  LeaderboardType,
  UserType,
  WordleResultType,
} from './types'

export interface GraphQLContext {
  user: User | null
}

const query = new GraphQLObjectType<any, GraphQLContext>({
  name: 'Query',
  fields: {
    canPostResults: {
      type: new GraphQLNonNull(GraphQLBoolean),
      args: {
        timezoneOffset: {
          type: new GraphQLNonNull(GraphQLInt)
        } 
      },
      resolve: (_source, {timezoneOffset}, { user }) => {
        if (!user) {
          return false
        }

        return canPostResults(user, timezoneOffset)
      },
    },
    groups: {
      type: new GraphQLList(new GraphQLNonNull(GroupType)),
      resolve: async (_source, _args, context) => {
        if (!context.user) {
          return null
        }

        return getGroupsForUser(context.user)
      },
    },
    groupWithInviteCode: {
      type: GroupType,
      args: {
        inviteCode: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (_source, { inviteCode }) => {
        return getGroupWithInviteCode(inviteCode)
      },
    },
    leaderboard: {
      type: new GraphQLNonNull(LeaderboardType),
      args: {
        weekOf: {
          type: new GraphQLNonNull(DateType),
        },
        groupId: {
          type: GraphQLID,
        },
      },
      resolve: (_source, { weekOf, groupId }, {user}) => {
        const from = weekOf
        const until = addDays(from, 7)

        return getLeaderboard({
          from,
          until,
          groupId,
          userId: user?.id,
        })
      },
    },
    results: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(WordleResultType))
      ),
      args: {
        weekOf: {
          type: new GraphQLNonNull(DateType),
        },
        groupId: {
          type: GraphQLID,
        },
      },
      resolve: async (_, { weekOf, groupId }, { user }) => {
        const from = weekOf
        const until = addDays(from, 7)

        const results = await queryResults({
          groupId,
          userId: user?.id,
          from,
          until,
          take: 50,
        })

        return results.data
      },
    },
    whoami: {
      type: UserType,
      resolve: (_source, _args, context) => {
        return context.user
      },
    },
  },
})

const mutation = new GraphQLObjectType<any, GraphQLContext>({
  name: 'Mutation',
  fields: {
    postResults: {
      type: WordleResultType,
      args: {
        results: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (_source, { results }, context) => {
        if (!context.user) {
          return null
        }

        return addResultsForUser(context.user, sanitize(results))
      },
    },
    joinGroup: {
      type: GroupType,
      args: {
        inviteCode: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (_source, { inviteCode }, { user }) => {
        if (!user) {
          return null
        }

        return joinGroup(user, sanitize(inviteCode))
      },
    },
    sendLoginEmail: {
      type: GraphQLBoolean,
      args: {
        email: {
          type: new GraphQLNonNull(GraphQLString),
        }
      },
      resolve: async (_source, {email}) => {
        await sendLogInEmail(sanitize(email))
        return true
      }
    },
    startGroup: {
      type: GroupType,
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (_source, { name }, { user }) => {
        if (!user) {
          return null
        }

        return startGroup(user, sanitize(name))
      },
    },
    updateDisplayName: {
      type: UserType,
      args: {
        displayName: {
          type: new GraphQLNonNull(GraphQLString),
        }
      },
      resolve: (_source, {displayName}, {user}) => {
        if (!user) {
          throw new ErrorWithCode(NOT_AUTHORIZED)
        }

        return updateDisplayName(user, displayName)
      }
    }
  },
})

const schema = new GraphQLSchema({
  query,
  mutation,
})

export default schema
