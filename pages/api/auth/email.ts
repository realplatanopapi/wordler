import { EmailAuthTokenPayload } from "@server/lib/auth";
import { cookieConfig } from "@server/lib/sessions";
import { unsealData } from "iron-session";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  const token = req.query.token
  if (typeof token !== 'string') {
    res.redirect('/')
    return
  }

  const {userId} = await unsealData<EmailAuthTokenPayload>(token, cookieConfig)
  req.session.userId = userId
  await req.session.save()
  
  res.redirect('/')
}

export default withIronSessionApiRoute(handler, cookieConfig)
