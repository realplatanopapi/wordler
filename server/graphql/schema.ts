import { User } from "@prisma/client"
import { getGroupsForUser } from "@server/lib/groups"
import { queryResults } from "@server/lib/wordles"
import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql"
import {DateType, GroupType, WordleResultType} from './types'

export interface GraphQLContext {
  user: User | null
}

const query = new GraphQLObjectType<any, GraphQLContext>({
  name: 'Query',
  fields: {
    groups: {
      type: new GraphQLList(new GraphQLNonNull(GroupType)),
      resolve: async(_source, _args, context) => {
        if (!context.user) {
          return null
        }

        return getGroupsForUser(context.user)
      }
    },
    results: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(WordleResultType))),
      args: {
        date: {
          type: DateType
        },
        groupId: {
          type: GraphQLID
        }
      },
      resolve: async (_, {
        date,
        groupId
      }, {
        user
      }) => {
        const results = await queryResults({
          groupId,
          userId: user?.id,
          date,
          take: 50,
        })

        return results.data
      }
    }
  }
})

const schema = new GraphQLSchema({
  query,
})

export default schema
