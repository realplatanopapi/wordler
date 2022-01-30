import { theme } from '@client/theme'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'theme-ui'
import Page from '@client/layouts/page'
import { ApolloProvider } from '@apollo/client'
import {client} from '@client/graphql';

import '@client/base.css'

function Worlder({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Page>
          <Component {...pageProps} />
        </Page>
      </ThemeProvider>
    </ApolloProvider>
  )
}

export default Worlder
