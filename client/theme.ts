import { merge, Theme } from 'theme-ui'
import {system as baseTheme} from '@theme-ui/presets'

const primaryColor = '#57AC4B'

export const theme: Theme = merge(baseTheme, {
  colors: {
    muted: '#dadada',
    primary: primaryColor,
    modes: {
      dark: {
        primary: primaryColor
      },
      light: {
        primary: primaryColor
      }
    }
  },
  layout: {
    container: {
      maxWidth: 800,
      p: 4
    }
  },
  forms: {
    input: {
      fontFamily: 'body',
    }
  }
})
