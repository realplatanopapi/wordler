import { NextApiHandler } from "next";
import axios from 'axios'

const clientId = process.env.TWITTER_OAUTH_CLIENT_ID
const clientSecret = process.env.TWITTER_OAUTH_CLIENT_SECRET

const twitter = axios.create({
  baseURL: 'https://api.twitter.com/2',
  headers: {
    'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
  },
  validateStatus: status => {
    return status < 500
  }
})

const handler: NextApiHandler = async (req, res) => {
  const {code, state} = req.query

  const params = new URLSearchParams();
  params.append('code', code as string);
  params.append('grant_type', 'authorization_code');
  params.append('client_id', process.env.TWITTER_OAUTH_CLIENT_ID as string);
  params.append('code_verifier', 'fake_challenge');
  params.append('redirect_uri', `${process.env.APP_URL}/api/auth/twitter/callback`);

  const createTokenResponse = await twitter.post('oauth2/token', params)
  if (createTokenResponse.status != 200) {
    res.json(createTokenResponse.data)
  } else {
    const {access_token} = createTokenResponse.data
    const userResponse = await twitter.get('users/me', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    })
    const {id, username} = userResponse.data

    res.json({
      id,
      username
    })
  }
}

export default handler
