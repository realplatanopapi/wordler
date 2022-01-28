import {withIronSessionApiRoute} from 'iron-session/next'
import { NextApiHandler } from 'next';
import { cookieConfig } from "../../../server/lib/auth";

const handler: NextApiHandler = async (req, res) => {
  req.session.destroy()
  res.redirect(process.env.APP_URL as string)
}

export default withIronSessionApiRoute(handler, cookieConfig);
