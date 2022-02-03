import { Group } from '@client/api'
import {
  useGroupWithInviteCodeQuery,
  useJoinGroupMutation,
} from '@client/__gql__/api'
import { UserFromSsrProps } from '@common/sessions'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Box, Button, Flex, Heading, Text } from 'theme-ui'
import LogInWithEmailButton from './login-with-email-button'

interface Props extends UserFromSsrProps {
  group: Pick<Group, 'id' | 'name'> | null
  inviteCode: string
}

const AcceptInvite: React.FC<Props> = ({ inviteCode, group, user }) => {
  const router = useRouter()
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
        {group ? (
          <Box>
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
              <>
                <Button
                  as="a"
                  // @ts-ignore
                  href={`/api/auth/twitter/authorize?inviteCode=${inviteCode}`}
                >
                  Sign in with twitter to join the group
                </Button>
                <Text as="p" my={4}>
                  or
                </Text>
                <LogInWithEmailButton inviteCode={inviteCode} />
              </>
            )}
          </Box>
        ) : (
          <Box>
            <Heading>Could not find this group.</Heading>
          </Box>
        )}
      </Flex>
    </>
  )
}

export default AcceptInvite
