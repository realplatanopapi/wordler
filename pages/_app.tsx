import { theme } from '@client/theme'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'theme-ui'
import '@client/fonts.css'

function Worlder({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default Worlder
