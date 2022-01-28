import { User } from '@prisma/client';
import { getById } from '@server/lib/accounts';
import { addResultsForUser } from '@server/lib/wordles';
import {withIronSessionApiRoute} from 'iron-session/next'
import { NextApiHandler } from 'next';
import { cookieConfig } from "../../server/lib/auth";

const handler: NextApiHandler = async (req, res) => {
  const user = await getById(req.session.userId)

  const result = await addResultsForUser(user as User, req.body.results)

  return res.json({
    data: result
  })
}

export default withIronSessionApiRoute(handler, cookieConfig);
