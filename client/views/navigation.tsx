import ErrorCodeMessage from '@client/components/error-code-message'
import Link, {LinkProps} from '@client/components/link'
import { Flex } from 'theme-ui'

interface Props {
  errorCode?: string | null
}

const NavLink: React.FC<LinkProps> = (props) => {
  return (
    <Link sx={{
      fontWeight: '900',
      textDecoration: 'none'
    }} {...props} />
  )
}

const Navigation: React.FC<Props> = ({ errorCode }) => {
  return (
    <>
      <Flex as="nav" sx={{
        mb: 4,
        justifyContent: 'space-between'
      }}>
        <NavLink
          href="/"
        >
          Wordler
        </NavLink>
        <NavLink href="/settings">
          Settings
        </NavLink>
      </Flex>
      {errorCode ? (
        <ErrorCodeMessage
          code={errorCode}
          sx={{
            borderColor: 'red',
            borderRadius: 4,
            borderStyle: 'solid',
            borderWidth: 1,
            mt: 4,
            mb: 4,
            p: 4,
            fontSize: 3,
          }}
        />
      ) : null}
    </>
  )
}

export default Navigation
