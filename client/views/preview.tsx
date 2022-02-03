import Link from '@client/components/link'
import { Box, Button, Heading, Text } from 'theme-ui'
import LogInWithEmailButton from './login-with-email-button'

const Preview: React.FC = () => {
  return (
    <Box sx={{
      py: [4, 6]
    }}>
      <Heading as="h1" sx={{
        fontSize: 6,
        mb: 4
      }}>
        Play Wordle with friends.
      </Heading>
      { /* @ts-ignore */}
      <Button as="a" href="/api/auth/twitter/authorize" sx={{
        fontSize: 3,
      }}>
        Sign in with Twitter
      </Button>
      <Box>
        <Text as="p" my={4}>or</Text>
      </Box>
      <Box>
        <LogInWithEmailButton sx={{
          fontSize: 3
        }} /> 
      </Box>
      <Box mt={6}>
        <Box mb={3}>
          <Text>
            Created by <Link isExternal href="https://twitter.com/realplatanopapi">@realplatanopapi</Link>
          </Text>
        </Box>
        <Box>
          <Text>
            <Link isExternal href="https://github.com/realplatanopapi/wordler">View source</Link>
          </Text>
        </Box>
      </Box>
    </Box>
  )
}

export default Preview
