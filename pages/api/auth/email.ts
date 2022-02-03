import { getById } from "@server/lib/accounts";
import { EmailAuthTokenPayload } from "@server/lib/auth";
import { getGroupWithInviteCode, joinGroup } from "@server/lib/groups";
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

  console.log(req.query)

  const {userId} = await unsealData<EmailAuthTokenPayload>(token, cookieConfig)
  req.session.userId = userId
  await req.session.save()

  const inviteCode = req.query.inviteCode
  if (typeof inviteCode === 'string') {
    const user = await getById(userId)
    if (user) {
      await joinGroup(user, inviteCode)
    }
  }

  res.redirect('/')
}

export default withIronSessionApiRoute(handler, cookieConfig)
