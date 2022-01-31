import { useGroupWithInviteCodeQuery } from "@client/__gql__/api"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { Flex, Heading, Text } from "theme-ui"

const AcceptInvite: React.FC = () => {
  const router = useRouter()
  const inviteCode = router.query.inviteCode as string
  const groupQuery = useGroupWithInviteCodeQuery({
    variables: {
      inviteCode
    }
  })
  
  const group = groupQuery.data?.groupWithInviteCode

  if (groupQuery.loading) {
    return (
      <Text>Loading...</Text>
    )
  } else if (!group) {
    return <Text>errr</Text>
  }

  return (
    <>
    <Head>
      <title>Join my Wordler group!</title>
    </Head>
    <Flex sx={{
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
    }}>
      <div>
        <Text as="p" mb={1}>Congratulations! You&apos;ve been invited to join:</Text>
        <Heading as="h1" mb={3}>{group.name}</Heading>
        <Link href={`/api/auth/twitter/authorize?inviteCode=${inviteCode}`}>
          sign in with twitter to join
        </Link>
      </div>
    </Flex>
    </>
  )
}

export default AcceptInvite
