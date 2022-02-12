import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import { Link as A, LinkProps as AProps, ThemeUIStyleObject } from 'theme-ui'

type BaseProps = NextLinkProps & Omit<AProps, 'href'>

export interface LinkProps extends BaseProps {
  isExternal?: boolean
  sx?: ThemeUIStyleObject
}

const Link: React.FC<LinkProps> = (props) => {
  const { href, passHref, isExternal, ...aProps } = props

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
