import { UserFromSsr } from "@common/sessions"
import { Box } from "theme-ui"

interface Props {
  user: UserFromSsr
}

const Settings: React.FC<Props> = ({user}) => {
  return (
    <Box>
      Settings
    </Box>
  )
}

export default Settings