import { Group } from "@client/api"
import { useStartGroupMutation } from "@client/__gql__/api"
import { Input } from "theme-ui"

interface Props {
  onSubmit: (group: Group) => any
}

const StartGroupForm: React.FC<Props> = ({onSubmit}) => {
  const [startGroup] = useStartGroupMutation()

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault()
        const form = event.target as HTMLFormElement
        const data = new FormData(form)
        const result = await startGroup({
          variables: {
            name: data.get('name') as string
          }
        })
        const newGroup = result.data?.startGroup

        if (newGroup) {
          onSubmit(newGroup)
        }
      }}
    >
      <Input name="name" placeholder="name your group" required />
      <br />
      <button type="submit">start</button>
    </form>
  )
}

export default StartGroupForm