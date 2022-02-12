import Profile from '@client/views/settings/profile'
import { getUserForSsr, UserFromSsrProps } from '@common/sessions'
import { NextPage } from 'next'

export const getServerSideProps = getUserForSsr

const ProfilePage: NextPage<UserFromSsrProps> = ({user}) => {
  if (!user) {
    return null
  }

  return <Profile user={user} />
}

export default ProfilePage
