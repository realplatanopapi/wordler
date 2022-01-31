import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import {Link as A, LinkProps as AProps} from 'theme-ui'

type BaseProps = NextLinkProps & Omit<AProps, 'href'>

interface Props extends BaseProps {
  isExternal?: boolean
}

const Link: React.FC<Props> = (props) => {
  const {
    href,
    passHref,
    isExternal,
    ...aProps
  } = props

  const link = <A href={href.toString()} {...aProps} />

  if (isExternal) {
    return link
  }

  return (
    <NextLink passHref={true} href={href}>
      {link}
    </NextLink>
  )
}

export default Link
