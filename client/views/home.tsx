import { useWhoamiQuery } from "@client/__gql__/api"
import Dashboard from "./dashboard/dashboard"
import Preview from "./preview"

const Home: React.FC = () => {
  const whoamiResult = useWhoamiQuery()
  const isLoading = whoamiResult.loading

  if (isLoading) {
    return <div>Loading...</div>
  } else if (!whoamiResult.data) {
    return <div>error</div>
  }

  const user = whoamiResult.data.whoami
  if (!user) {
    return <Preview />
  }

  return (
    <Dashboard user={user} />
  )
}

export default Home
