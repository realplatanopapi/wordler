import Link from "@client/components/link"
import { Section } from "@client/layouts/page"
import { UserFromSsr } from "@common/sessions"
import { Box, Heading, Text } from "theme-ui"

interface Props {
  user: UserFromSsr
}

const Settings: React.FC<Props> = ({user}) => {
  return (
    <Box>
      <Heading mb={4}>Signed in as {user.displayName}</Heading>
      <Box mb={3}>
        <Link href="/settings/profile">Profile</Link>
      </Box>
      <Box mb={3}>
        <Link href="/settings/groups">Groups</Link>
      </Box>
      <Section sx={{
        mt: 5
      }}>
        <Text as="p" mb={2}>
          Signed in as {user.displayName}.
        </Text>
        <Text as="p">
          <Link isExternal href="/api/auth/log-out">
            Sign out
          </Link>
        </Text>
      </Section>
    </Box>
  )
}

export default Settings