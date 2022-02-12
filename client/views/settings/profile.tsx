import { useUpdateDisplayNameMutation } from "@client/__gql__/api"
import { UserFromSsr } from "@common/sessions"
import { useState } from "react"
import { toast } from "react-toastify"
import { Box, Button, Heading, Input, Label } from "theme-ui"

import ErrorCodeMessage from "@client/components/error-code-message"
import { getGraphqlErrorCode } from "@client/utils"

interface Props {
  user: UserFromSsr
}

const Profile: React.FC<Props> = ({user}) => {
  const [updateDisplayName, updateDisplayNameResult] = useUpdateDisplayNameMutation({
    onCompleted: () => {
      toast.success('Saved!', {
        toastId: 'displayNameUpdated'
      })
    }
  })
  const [displayName, setDisplayName] = useState(user.displayName || '')

  return (
    <Box>
      <Heading mb={4}>Your profile</Heading>
      <form onSubmit={(event) => {
        event.preventDefault()

        if (updateDisplayNameResult.loading) {
          return
        }

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
        <ErrorCodeMessage code={getGraphqlErrorCode(updateDisplayNameResult.error)} />
        <Input name="displayName" placeholder="avidWordler45" mb={3} value={displayName} onChange={(event) => {
          setDisplayName(event.target.value)
        }} required />
        <Button type="submit" disabled={updateDisplayNameResult.loading}>Save</Button>
      </form>
    </Box>
  )
}

export default Profile