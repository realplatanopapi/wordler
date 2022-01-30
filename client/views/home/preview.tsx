import Link from "@client/components/Link"

const Preview: React.FC = () => {
  return (
    <Link href="/api/auth/twitter/authorize" isExternal>
      Sign in with Twitter
    </Link>
  )
}

export default Preview