import Home from '@client/views/home'
import { getUserForSsr, UserFromSsrProps } from '@common/sessions'
import { NextPage } from 'next'

export const getServerSideProps = getUserForSsr

const Index: NextPage<UserFromSsrProps> = ({user}) => {
  return <Home user={user} />
}

export default Index
