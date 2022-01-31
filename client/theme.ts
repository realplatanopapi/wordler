import { merge, Theme } from 'theme-ui'
import {base} from '@theme-ui/presets'

export const theme: Theme = merge(base, {
  colors: {
    muted: '#dadada'
  },
  fonts: {
    body: "'Cutive Mono', monospace",
    heading: "'Cutive Mono', monospace",
    monospace: 'Menlo, monospace',
  },
  layout: {
    container: {
      maxWidth: 800,
      p: 4
    }
  },
  buttons: {
    primary: {
      background: 'black',
      color: 'white',
      fontFamily: 'body'
    }
  },
  forms: {
    input: {
      fontFamily: 'body',
    }
  }
})
