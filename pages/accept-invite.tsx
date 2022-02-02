import AcceptInvite from '@client/views/accept-invite'
import { getUserForSsr, UserFromSsrProps } from '@common/sessions'
import { NextPage } from 'next'

export const getServerSideProps = getUserForSsr

const AcceptInvitePage: NextPage<UserFromSsrProps> = ({user}) => {
  return <AcceptInvite user={user} />
}

export default AcceptInvitePage
