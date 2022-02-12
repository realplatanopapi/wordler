import { Group } from '@client/api'
import ErrorCodeMessage from '@client/components/error-code-message'
import { getGraphqlErrorCode } from '@client/utils'
import { useStartGroupMutation } from '@client/__gql__/api'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { Button, Input } from 'theme-ui'

interface Props {
  onSubmit: (group: Group) => any
}

const StartGroupForm: React.FC<Props> = ({ onSubmit }) => {
  const [groupName, setGroupName] = useState('')

  const [startGroup, startGroupResult] = useStartGroupMutation({
    onCompleted: (data) => {
      const { startGroup: group } = data
      if (group) {
        setGroupName('')
        toast.success('Group started!', {
          toastId: 'groupStarted'
        })
        onSubmit(group)
      }
    },
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const form = event.target as HTMLFormElement
        const data = new FormData(form)
        startGroup({
          variables: {
            name: data.get('name') as string,
          },
        })
      }}
    >
      <ErrorCodeMessage code={getGraphqlErrorCode(startGroupResult.error)} />
      <Input name="name" placeholder="name your group" value={groupName} onChange={(event) => {
        setGroupName(event.target.value)
      }} required />
      <br />
      <Button type="submit">Start</Button>
    </form>
  )
}

export default StartGroupForm
