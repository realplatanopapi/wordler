import { withLogging } from "@server/api/middleware/with-logging";
import { ErrorWithCode } from "@server/errors";
import { getById } from "@server/lib/accounts";
import { authenticateWithToken } from "@server/lib/auth";
import { joinGroup } from "@server/lib/groups";
import { cookieConfig } from "@server/lib/sessions";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  let token = req.query.token
  if (typeof token !== 'string') {
    res.redirect('/')
    return
  }

  token = decodeURIComponent(token)

  let user
  try {
    user = await authenticateWithToken(token)
  } catch (error) {
    if (error instanceof ErrorWithCode) {
      res.redirect(`/?errorCode=${error.code}`)
      return
    }

    throw error
  }

  if (!user) {
    res.redirect('/')
    return
  }

  const userId = user.id
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

export default withLogging(withIronSessionApiRoute(handler, cookieConfig))
