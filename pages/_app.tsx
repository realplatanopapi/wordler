import type { AppProps } from 'next/app'

function Worlder({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default Worlder
