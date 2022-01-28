import { theme } from '@client/theme'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'theme-ui'
import '@client/fonts.css'
import Page from '@client/layouts/page'

function Worlder({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Page>
        <Component {...pageProps} />
      </Page>
    </ThemeProvider>
  )
}

export default Worlder
