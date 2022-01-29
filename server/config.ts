import convict from 'convict'

const config = convict<{
  appUrl: string
  cookieSecret: {
    auth: string
  }
  databaseUrl: string
  env: 'production' | 'development'
  twitter: {
    apiKey: string
    apiSecret: string
    bearerToken: string
    oauthClientId: string
    oauthClientSecret: string
  }
}>({
  appUrl: {
    format: String,
    env: 'APP_URL',
    default: null,
  },
  cookieSecret: {
    auth: {
      format: String,
      env: 'COOKIE_SECRET_AUTH',
      default: null,
    },
  },
  databaseUrl: {
    format: String,
    env: 'DATABASE_URL',
    default: null,
  },
  env: {
    format: ['production', 'development'],
    env: 'NODE_ENV',
    default: null,
  },
  twitter: {
    apiKey: {
      format: String,
      env: 'TWITTER_API_KEY',
      default: null,
    },
    apiSecret: {
      format: String,
      env: 'TWITTER_API_SECRET',
      default: null,
    },
    bearerToken: {
      format: String,
      env: 'TWITTER_BEARER_TOKEN',
      default: null,
    },
    oauthClientId: {
      format: String,
      env: 'TWITTER_OAUTH_CLIENT_ID',
      default: null,
    },
    oauthClientSecret: {
      format: String,
      env: 'TWITTER_OAUTH_CLIENT_SECRET',
      default: null,
    },
  },
})

config.validate({
  allowed: 'strict',
})

export default config