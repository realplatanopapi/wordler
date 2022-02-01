import config from "@server/config"
import axios from "axios"

const twitterConfig = config.get('twitter')
const clientId = twitterConfig.oauthClientId
const clientSecret = twitterConfig.oauthClientSecret

const twitter = axios.create({
  baseURL: 'https://api.twitter.com/2',
  headers: {
    Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString(
      'base64'
    )}`,
  },
  validateStatus: (status) => {
    return status < 500
  },
})

export default twitter