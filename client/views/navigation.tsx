import Link from "@client/components/Link"
import { Box } from "theme-ui"

const Navigation: React.FC = () => {
  return (
    <Box as="nav">
      <Link href="/">Wordler</Link>
    </Box>
  )
}

export default Navigation
