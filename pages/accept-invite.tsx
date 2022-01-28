import { cookieConfig } from '@server/lib/auth'
import { getGroupByInviteCode } from '@server/lib/groups'
import { withIronSessionSsr } from 'iron-session/next'
import { NextPage } from 'next'

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
    <div>
      <h1>You&apos;ve been invited to join {group.name}</h1>
      <a href={`/api/auth/twitter/authorize?inviteCode=${inviteCode}`}>
        sign in with twitter to join the group
      </a>
    </div>
  )
}

export default AcceptInvitePage
