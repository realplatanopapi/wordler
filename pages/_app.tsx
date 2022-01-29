import { theme } from '@client/theme'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'theme-ui'
import '@client/fonts.css'
import Page from '@client/layouts/page'
import { ApolloProvider } from '@apollo/client'
import {client} from '@client/graphql';

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
