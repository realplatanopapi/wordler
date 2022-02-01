import { merge, Theme } from 'theme-ui'
import { system as baseTheme } from '@theme-ui/presets'

const primaryColor = '#57AC4B'

export const theme: Theme = merge(baseTheme, {
  colors: {
    primary: primaryColor,
    modes: {
      dark: {
        background: '#141414',
        primary: primaryColor,
        muted: '#7a7a7a',
      },
      light: {
        primary: primaryColor,
        muted: '#dadada',
      },
    },
  },
  layout: {
    container: {
      maxWidth: 960,
      p: 4,
    },
  },
  forms: {
    input: {
      fontFamily: 'body',
    },
  },
})
