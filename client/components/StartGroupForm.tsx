import { useStartGroupMutation } from "@client/__gql__/api"

interface Props {
  onSubmit: () => any
}

const StartGroupForm: React.FC<Props> = ({onSubmit}) => {
  const [startGroup] = useStartGroupMutation()

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault()
        const form = event.target as HTMLFormElement
        const data = new FormData(form)
        await startGroup({
          variables: {
            name: data.get('name') as string
          }
        })
        onSubmit()
      }}
    >
      <input name="name" placeholder="name your group" required />
      <button type="submit">start</button>
    </form>
  )
}

export default StartGroupForm