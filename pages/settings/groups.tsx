import Groups from '@client/views/settings/groups'
import { getUserForSsr, UserFromSsrProps } from '@common/sessions'
import { NextPage } from 'next'

export const getServerSideProps = getUserForSsr

const GroupsPage: NextPage<UserFromSsrProps> = ({user}) => {
  if (!user) {
    return null
  }

  return <Groups />
}

export default GroupsPage
