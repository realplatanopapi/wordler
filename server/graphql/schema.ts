import { User } from "@prisma/client"
import { getGroupsForUser, startGroup } from "@server/lib/groups"
import { addResultsForUser, canPostResults, getLeaderboard, queryResults } from "@server/lib/wordles"
import { addDays } from "date-fns"
import { GraphQLBoolean, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql"
import {DateType, GroupType, LeaderboardType, UserType, WordleResultType} from './types'

export interface GraphQLContext {
  user: User | null
}

const query = new GraphQLObjectType<any, GraphQLContext>({
  name: 'Query',
  fields: {
    canPostResults: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: (_source, _args, {user}) => {
        if (!user) {
          return false
        }

        return canPostResults(user)
      }
    },
    groups: {
      type: new GraphQLList(new GraphQLNonNull(GroupType)),
      resolve: async(_source, _args, context) => {
        if (!context.user) {
          return null
        }

        return getGroupsForUser(context.user)
      }
    },
    leaderboard: {
      type: new GraphQLNonNull(LeaderboardType),
      args: {
        weekOf: {
          type: new GraphQLNonNull(DateType)
        },
      },
      resolve: (_source, {weekOf}, _context) => {
        const from = weekOf
        const until = addDays(from, 7)

        return getLeaderboard({
          from,
          until
        })
      }
    },
    results: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(WordleResultType))),
      args: {
        weekOf: {
          type: new GraphQLNonNull(DateType)
        },
        groupId: {
          type: GraphQLID
        }
      },
      resolve: async (_, {
        weekOf,
        groupId
      }, {
        user
      }) => {
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
      }
    },
    whoami: {
      type: UserType,
      resolve: (_source, _args, context) => {
        return context.user
      }
    }
  }
})

const mutation = new GraphQLObjectType<any, GraphQLContext>({
  name: 'Mutation',
  fields: {
    postResults: {
      type: WordleResultType,
      args: {
        results: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: (_source, args, context) => {
        if (!context.user) { 
          return null
        }

        return addResultsForUser(context.user, args.results)
      }
    },
    startGroup: {
      type: GroupType,
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: (_source, {name}, {user}) => {
        if (!user) {
          return null
        }

        return startGroup(user, name)
      }
    }
  }
})

const schema = new GraphQLSchema({
  query,
  mutation
})

export default schema
