import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import {Link as A, LinkProps as AProps} from 'theme-ui'

type Props = NextLinkProps & Omit<AProps, 'href'>

const Link: React.FC<Props> = (props) => {
  const {
    href,
    passHref,
    ...aProps
  } = props

  return (
    <NextLink passHref={true} href={href}>
      <A {...aProps} />
    </NextLink>
  )
}

export default Link
