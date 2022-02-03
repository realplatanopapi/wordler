import { useGroupsQuery } from '@client/__gql__/api'
import { UserFromSsrProps } from '@common/sessions'
import { useRouter } from 'next/router'
import Dashboard from './dashboard/dashboard'
import Onboarding from './onboarding'
import Preview from './preview'

const Home: React.FC<UserFromSsrProps> = ({user}) => {
  const router = useRouter()
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

  const hasDisplayName = Boolean(user.displayName)
  const isInAGroup = groups ? groups.length > 0 : false
  const isOnboarded = hasDisplayName && isInAGroup
  if (!isOnboarded) {
    return (
      <Onboarding
        isInAGroup={isInAGroup}
        user={user}
        onCompleteOnboarding={() => {
          groupsResult.refetch()

          router.replace('/')
        }}
      />
    )
  }

  return <Dashboard user={user} />
}

export default Home
