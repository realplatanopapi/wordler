import Link from '@client/components/link'
import { Box } from 'theme-ui'

const Navigation: React.FC = () => {
  return (
    <Box as="nav" mb={4}>
      <Link href="/" sx={{
        fontWeight: '900',
        textDecoration: 'none',
      }}>Wordler</Link>
    </Box>
  )
}

export default Navigation
