import { NextApiHandler } from "next";

const handler: NextApiHandler = (req, res) => {
  const clientId = process.env.TWITTER_OAUTH_CLIENT_ID
  const redirectUri = `${process.env.APP_URL}/api/auth/twitter/callback`
  const scope = "users.read%20tweet.read"
  const state = "fake_state"
  const challenge = "fake_challenge"

  res.redirect(
    `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&code_challenge=${challenge}&code_challenge_method=plain`
  )
}

export default handler
