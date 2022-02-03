import { NextApiHandler } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { getOrCreateUserFromTwitter } from '@server/lib/accounts'
import { cookieConfig } from '@server/lib/sessions'
import { joinGroup } from '@server/lib/groups'
import config from '@server/config'
import { unsealData } from 'iron-session'
import { TwitterStateData } from './types'
import twitter from '@server/services/twitter'

const handler: NextApiHandler = async (req, res) => {
  const { code, state } = req.query
  const { challenge } = await unsealData<TwitterStateData>(state as string, {
    password: config.get('twitter.oauthStateSecret'),
  })

  const params = new URLSearchParams()
  params.append('code', code as string)
  params.append('grant_type', 'authorization_code')
  params.append('client_id', config.get('twitter.oauthClientId'))
  params.append('code_verifier', challenge)
  params.append(
    'redirect_uri',
    `${config.get('appUrl')}/api/auth/twitter/callback`
  )

  const createTokenResponse = await twitter.post('oauth2/token', params)
  if (createTokenResponse.status != 200) {
    res.json(createTokenResponse.data)
  } else {
    const { access_token } = createTokenResponse.data
    const userResponse = await twitter.get('users/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
    const { id, username } = userResponse.data.data
    const user = await getOrCreateUserFromTwitter(id, {
      displayName: username,
    })

    if (req.session.inviteCode) {
      await joinGroup(user, req.session.inviteCode)
      delete req.session.inviteCode
    }

    req.session.userId = user.id
    await req.session.save()

    res.redirect(config.get('appUrl'))
  }
}

export default withIronSessionApiRoute(handler, cookieConfig)
