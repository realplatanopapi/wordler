import { useGroupsQuery, useWhoamiQuery } from '@client/__gql__/api'
import Dashboard from './dashboard/dashboard'
import Onboarding from './onboarding'
import Preview from './preview'

const Home: React.FC = () => {
  const whoamiResult = useWhoamiQuery()
  const user = whoamiResult.data?.whoami

  const groupsResult = useGroupsQuery({
    skip: !user,
  })
  const groups = groupsResult.data?.groups

  const isLoading = whoamiResult.loading || groupsResult.loading

  if (isLoading) {
    return <div>Loading...</div>
  } else if (!whoamiResult.data) {
    return <div>error</div>
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
