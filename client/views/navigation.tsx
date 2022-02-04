import ErrorCodeMessage from '@client/components/error-code-message'
import Link from '@client/components/link'
import { Box } from 'theme-ui'

interface Props {
  errorCode?: string | null
}

const Navigation: React.FC<Props> = ({errorCode}) => {
  return (
    <Box as="nav" mb={4}>
      <Link href="/" sx={{
        fontWeight: '900',
        textDecoration: 'none',
      }}>Wordler</Link>
      {
        errorCode ? (
          <ErrorCodeMessage code={errorCode} sx={{
            borderColor: 'red',
            borderRadius: 4,
            borderStyle: 'solid',
            borderWidth: 1,
            mt: 4,
            p: 4,
            fontSize: 3
          }} />
        ) : null
      }
    </Box>
  )
}

export default Navigation
