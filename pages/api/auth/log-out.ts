import config from '@server/config'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiHandler } from 'next'
import { cookieConfig } from '@server/lib/sessions'
import { withLogging } from '@server/api/middleware/with-logging'

const handler: NextApiHandler = async (req, res) => {
  req.session.destroy()
  res.redirect(config.get('appUrl'))
}

export default withLogging(withIronSessionApiRoute(handler, cookieConfig))
