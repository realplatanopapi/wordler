import Link from '@client/components/link'
import {
  useGroupWithInviteCodeQuery,
  useJoinGroupMutation,
  useWhoamiQuery,
} from '@client/__gql__/api'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Button, Flex, Heading, Text } from 'theme-ui'

const AcceptInvite: React.FC = () => {
  const router = useRouter()
  const inviteCode = router.query.inviteCode as string
  const [joinGroup, joinGroupResult] = useJoinGroupMutation({
    onCompleted: (data) => {
      const { joinGroup: group } = data
      if (group) {
        router.replace({
          pathname: '/',
          query: {
            groupId: group.id,
          },
        })
      }
    },
  })
  const whoamiQuery = useWhoamiQuery()
  const groupQuery = useGroupWithInviteCodeQuery({
    variables: {
      inviteCode,
    },
  })

  const group = groupQuery.data?.groupWithInviteCode
  const user = whoamiQuery.data?.whoami

  if (groupQuery.loading || whoamiQuery.loading) {
    return <Text>Loading...</Text>
  } else if (!group) {
    return <Text>errr</Text>
  }

  return (
    <>
      <Head>
        <title>Join my Wordler group!</title>
      </Head>
      <Flex
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          py: 6,
          textAlign: 'center',
        }}
      >
        <div>
          <Text as="p" mb={1}>
            Congratulations! You&apos;ve been invited to join:
          </Text>
          <Heading
            as="h1"
            mb={3}
            sx={{
              fontSize: 6,
            }}
          >
            {group.name}
          </Heading>
          {user ? (
            <Button
              onClick={() => {
                if (joinGroupResult.loading) {
                  return
                }

                joinGroup({
                  variables: {
                    inviteCode,
                  },
                })
              }}
            >
              {joinGroupResult.loading
                ? 'Joining...'
                : 'Click to join the group'}
            </Button>
          ) : (
            <Button
              as={Link}
              // @ts-ignore
              href={`/api/auth/twitter/authorize?inviteCode=${inviteCode}`}
            >
              Sign in with twitter to join the group
            </Button>
          )}
        </div>
      </Flex>
    </>
  )
}

export default AcceptInvite
