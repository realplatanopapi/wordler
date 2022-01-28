import { merge, Theme } from 'theme-ui'
import {base} from '@theme-ui/presets'

export const theme: Theme = merge(base, {
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
  }
})
