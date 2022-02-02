import { useGroupsQuery } from '@client/__gql__/api'
import { UserFromSsrProps } from '@common/sessions'
import Dashboard from './dashboard/dashboard'
import Onboarding from './onboarding'
import Preview from './preview'

const Home: React.FC<UserFromSsrProps> = ({user}) => {
  const groupsResult = useGroupsQuery({
    skip: !user,
  })
  const groups = groupsResult.data?.groups
  const isLoading = groupsResult.loading

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Preview />
  }

  const isInAGroup = groups && groups.length > 0
  if (!isInAGroup) {
    return (
      <Onboarding
        onCompleteOnboarding={() => {
          groupsResult.refetch()
        }}
      />
    )
  }

  return <Dashboard user={user} />
}

export default Home
