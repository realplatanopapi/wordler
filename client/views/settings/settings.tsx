import Link from "@client/components/link"
import { UserFromSsr } from "@common/sessions"
import { Box, Heading } from "theme-ui"

interface Props {
  user: UserFromSsr
}

const Settings: React.FC<Props> = ({user}) => {
  return (
    <Box>
      <Heading mb={4}>Signed in as {user.displayName}</Heading>
      <Box>
        <Link href="/settings/profile">Profile</Link>
      </Box>
    </Box>
  )
}

export default Settings