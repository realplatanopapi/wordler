import Settings from '@client/views/settings/settings'
import { getUserForSsr, UserFromSsrProps } from '@common/sessions'
import { NextPage } from 'next'

export const getServerSideProps = getUserForSsr

const SettingsPage: NextPage<UserFromSsrProps> = ({user}) => {
  if (!user) {
    return null
  }

  return <Settings user={user} />
}

export default SettingsPage
