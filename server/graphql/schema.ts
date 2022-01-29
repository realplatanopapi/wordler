import { User } from "@prisma/client"
import { queryResults } from "@server/lib/wordles"
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql"
import {WordleResultType} from './types'

export interface GraphQLContext {
  user: User | null
}

const query = new GraphQLObjectType<any, GraphQLContext>({
  name: 'Query',
  fields: {
    results: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(WordleResultType))),
      args: {
        date: {
          type: GraphQLString
        },
        groupId: {
          type: GraphQLString
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
