import convict from 'convict'

const config = convict<{
  appUrl: string
  authTokenSecret: string
  cookieSecret: {
    auth: string
  }
  databaseUrl: string
  env: 'production' | 'development'
  rollbarToken: string,
  sendgridApiKey: string,
  twitter: {
    apiKey: string
    apiSecret: string
    bearerToken: string
    oauthClientId: string
    oauthClientSecret: string
    oauthStateSecret: string
  }
}>({
  appUrl: {
    format: String,
    env: 'APP_URL',
    default: null,
  },
  authTokenSecret: {
    format: String,
    env: 'AUTH_TOKEN_SECRET',
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
  rollbarToken: {
    format: String,
    env: 'ROLLBAR_TOKEN',
    default: null,
  },
  sendgridApiKey: {
    format: String,
    env: 'SENDGRID_API_KEY',
    default: null
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
    oauthStateSecret: {
      format: String,
      env: 'TWITTER_OAUTH_STATE_SECRET',
      default: null,
    },
  },
})

export default config
