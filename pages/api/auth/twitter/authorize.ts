import config from '@server/config'
import { cookieConfig } from '@server/lib/sessions'
import cryptoRandomString from 'crypto-random-string'
import { sealData } from 'iron-session'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiHandler } from 'next'
import { TwitterStateData } from './types'

const handler: NextApiHandler = async (req, res) => {
  const clientId = config.get('twitter.oauthClientId')
  const redirectUri = `${config.get('appUrl')}/api/auth/twitter/callback`
  const scope = 'users.read%20tweet.read'
  const challenge = cryptoRandomString({
    length: 32,
  })
  const state = await sealData(
    {
      challenge,
    } as TwitterStateData,
    {
      password: config.get('twitter.oauthStateSecret'),

      // Make valid for 5 minutes
      ttl: 60 * 5,
    }
  )

  if (req.query.inviteCode) {
    req.session.inviteCode = req.query.inviteCode as string
    await req.session.save()
  }

  res.redirect(
    `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&code_challenge=${challenge}&code_challenge_method=plain`
  )
}

export default withIronSessionApiRoute(handler, cookieConfig)
