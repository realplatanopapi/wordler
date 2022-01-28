import { cookieConfig } from '@server/lib/auth'
import { getGroupByInviteCode } from '@server/lib/groups'
import { withIronSessionSsr } from 'iron-session/next'
import { NextPage } from 'next'
import { Flex, Heading, Link, Text } from 'theme-ui'

interface Props {
  group: {
    name: string
  }
  inviteCode: string
  [key: string]: any
}

export const getServerSideProps = withIronSessionSsr<Props>(
  async ({ req, query }) => {
    const inviteCode = query.inviteCode as string
    const group = await getGroupByInviteCode(inviteCode)
    if (!group) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        inviteCode,
        group: {
          name: group.name,
        },
      },
    }
  },
  cookieConfig
)

const AcceptInvitePage: NextPage<Props> = ({ group, inviteCode }) => {
  return (
    <Flex sx={{
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
    }}>
      <div>
        <Text>You&apos;ve been invited to join a group</Text>
        <Heading as="h1" mb={3}>{group.name}</Heading>
        <Link href={`/api/auth/twitter/authorize?inviteCode=${inviteCode}`}>
          sign in with twitter to join
        </Link>
      </div>
    </Flex>
  )
}

export default AcceptInvitePage
