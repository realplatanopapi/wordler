import { User } from '@prisma/client'
import { getById } from '@server/lib/accounts'
import { addResultsForUser } from '@server/lib/wordles'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiHandler } from 'next'
import { cookieConfig } from '../../server/lib/auth'

const handler: NextApiHandler = async (req, res) => {
  const user = await getById(req.session.userId as string)

  const result = await addResultsForUser(user as User, req.body.results)

  return res.json({
    data: {
      id: result.id,
      attempts: result.attempts.map((attempt) => {
        return {
          id: attempt.id,
          guesses: attempt.guesses,
        }
      }),
    },
  })
}

export default withIronSessionApiRoute(handler, cookieConfig)
