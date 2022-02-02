import { Group } from '@client/api'
import AcceptInvite from '@client/views/accept-invite'
import { getUserFromSsrContext, UserFromSsr, UserFromSsrProps } from '@common/sessions'
import { cookieConfig } from '@server/lib/auth'
import { getGroupWithInviteCode } from '@server/lib/groups'
import { withIronSessionSsr } from 'iron-session/next'
import { NextPage } from 'next'

interface Props extends UserFromSsrProps {
  group: Pick<Group, 'id' | 'name'> | null
  inviteCode: string
  user: UserFromSsr | null
}

export const getServerSideProps = withIronSessionSsr(async context => {
  const userFromSsr = await getUserFromSsrContext(context)
  const inviteCode = context.query.inviteCode as string
  const group = await getGroupWithInviteCode(inviteCode)

  return {
    props: {
      group: group ? {
        id: group.id,
        name: group.name
      } : null,
      inviteCode,
      user: userFromSsr
    }
  }
}, cookieConfig)

const AcceptInvitePage: NextPage<Props> = ({group, user, inviteCode}) => {
  return <AcceptInvite group={group} user={user} inviteCode={inviteCode} />
}

export default AcceptInvitePage
