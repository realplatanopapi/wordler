import { User } from '@prisma/client'
import { getById } from '@server/lib/accounts'
import { cookieConfig } from '@server/lib/auth'
import { createGroup } from '@server/lib/groups'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  const user = await getById(req.session.userId as string)
  const group = await createGroup(user as User, req.body.name as string)

  return res.json({
    data: group,
  })
}

export default withIronSessionApiRoute(handler, cookieConfig)
