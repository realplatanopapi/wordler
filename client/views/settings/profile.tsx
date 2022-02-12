import { useUpdateDisplayNameMutation } from "@client/__gql__/api"
import { UserFromSsr } from "@common/sessions"
import { useState } from "react"
import { Box, Button, Heading, Input, Label } from "theme-ui"

interface Props {
  user: UserFromSsr
}

const Profile: React.FC<Props> = ({user}) => {
  const [updateDisplayName, updateDisplayNameResult] = useUpdateDisplayNameMutation()
  const [displayName, setDisplayName] = useState(user.displayName || '')

  return (
    <Box>
      <Heading mb={4}>Your profile</Heading>
      <form onSubmit={(event) => {
        event.preventDefault()

        const form = event.target as HTMLFormElement
        const data = new FormData(form)
        const displayName = data.get('displayName') as string
        updateDisplayName({
          variables: {
            displayName
          }
        })
      }}>
        <Label htmlFor="displayName" mb={3}>Update your username</Label>
        <Input name="displayName" placeholder="avidWordler45" mb={3} value={displayName} onChange={(event) => {
          setDisplayName(event.target.value)
        }} required />
        <Button type="submit">Save</Button>
      </form>
    </Box>
  )
}

export default Profile