import { theme } from '@client/theme'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'theme-ui'
import Page from '@client/layouts/page'
import { ApolloProvider } from '@apollo/client'
import { client } from '@client/graphql'
import Navigation from '@client/views/navigation'

import '@client/base.css'
import Head from 'next/head'
import { useRouter } from 'next/router'
import ToastContainer from '@client/components/toast-container'

function Worlder({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const errorCode = router.query.errorCode as string | undefined

  return (
    <>
      <Head>
        <title>Wordler</title>
      </Head>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <Page header={<Navigation errorCode={errorCode} />}>
            <Component {...pageProps} />
          </Page>
        </ThemeProvider>
      </ApolloProvider>
      <ToastContainer />
    </>
  )
}

export default Worlder
