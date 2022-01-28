import config from '@server/config'
import { cookieConfig } from '@server/lib/auth'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  const clientId = config.get('twitter.oauthClientId')
  const redirectUri = `${config.get('appUrl')}/api/auth/twitter/callback`
  const scope = 'users.read%20tweet.read'
  const state = 'fake_state'
  const challenge = 'fake_challenge'

  if (req.query.inviteCode) {
    req.session.inviteCode = req.query.inviteCode as string
    await req.session.save()
  }

  res.redirect(
    `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&code_challenge=${challenge}&code_challenge_method=plain`
  )
}

export default withIronSessionApiRoute(handler, cookieConfig)
