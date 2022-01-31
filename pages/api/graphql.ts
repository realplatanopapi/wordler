import { ApolloServer, ApolloError } from 'apollo-server-micro'
import schema, { GraphQLContext } from '@server/graphql/schema'
import { NextApiHandler, NextApiRequest } from 'next'
import { getById } from '@server/lib/accounts'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { withIronSessionApiRoute } from 'iron-session/next'
import { cookieConfig } from '@server/lib/auth'
import { ErrorWithCode } from '@server/errors/error_with_code'

export const config = {
  api: {
    bodyParser: false,
  },
}

const server = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  context: async ({
    req,
  }: {
    req: NextApiRequest
  }): Promise<GraphQLContext> => {
    const { userId } = req.session
    const user = userId ? await getById(userId) : null

    return {
      user,
    }
  },
  formatError: (error) => {
    const {originalError} = error
    if (originalError instanceof ErrorWithCode) {
      return new ApolloError(originalError.message, originalError.code)
    }

    return error 
  }
})

const startServer = server.start()

async function getHandler(): Promise<NextApiHandler> {
  await startServer

  let handler: NextApiHandler | null = null
  if (!handler) {
    handler = await server.createHandler({
      path: '/api/graphql',
    })
    handler = withIronSessionApiRoute(handler, cookieConfig)
  }

  return handler
}

const handler: NextApiHandler = async (req, res) => {
  const graphqlHandler = await getHandler()
  return graphqlHandler(req, res)
}

export default handler
