import { useSendLoginEmailMutation } from "@client/__gql__/api"
import { useState } from "react"
import { Button, Input, Text, ThemeUIStyleObject } from "theme-ui"

interface Props {
  sx?: ThemeUIStyleObject
}

const LogInWithEmailButton: React.FC<Props> = ({sx}) => {
  const [isShowingEmailInput, setIsShowingEmailInput] = useState(false)
  const [didSend, setDidSend] = useState(false)
  const [sendLoginEmail, sendLoginEmailResult] = useSendLoginEmailMutation({
    onCompleted: () => {
      setDidSend(true)
    }
  })
  const isSending = sendLoginEmailResult.loading

  if (didSend) {
    return (
      <Text sx={{
        textAlign: 'center'
      }}>
        Sent!
      </Text>
    )
  }

  if (isShowingEmailInput) {
    return (
      <form onSubmit={(event) => {
        event.preventDefault()
        if (isSending) {
          return
        }

        const form = event.target as HTMLFormElement
        const data = new FormData(form)
        const email = data.get('email') as string
        sendLoginEmail({
          variables: {
            email
          }
        })
      }}>
        <Input name="email" type="email" placeholder="avid-wordler@gmail.com" required />
        <Button type="submit" sx={sx}>{
          isSending ? 'Sending...' : 'Send link to login'
        }</Button>
      </form>
    )
  }

  return (
    <Button onClick={() => {
      setIsShowingEmailInput(true)
    }} sx={sx}>Send link to login</Button>
  )
}

export default LogInWithEmailButton