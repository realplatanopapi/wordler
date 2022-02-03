import config from '@server/config'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiHandler } from 'next'
import { cookieConfig } from '@server/lib/sessions'

const handler: NextApiHandler = async (req, res) => {
  req.session.destroy()
  res.redirect(config.get('appUrl'))
}

export default withIronSessionApiRoute(handler, cookieConfig)
