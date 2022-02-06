import config from '@server/config'
import Rollbar from 'rollbar'

if (!global.rollbar) {
  global.rollbar = new Rollbar({
    accessToken: config.get('rollbarToken'),
    captureUncaught: true,
    captureUnhandledRejections: true,
  })
}

const rollbar = global.rollbar

export default rollbar
