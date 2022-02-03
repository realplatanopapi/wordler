import { useSendLoginEmailMutation } from "@client/__gql__/api"
import { useState } from "react"
import { Button, Input, Label, Text, ThemeUIStyleObject } from "theme-ui"

interface Props {
  inviteCode?: string
  sx?: ThemeUIStyleObject
}

const sendLinkButtonLabel = 'Get a link to log in via email'

const LogInWithEmailButton: React.FC<Props> = ({inviteCode, sx}) => {
  const [isShowingEmailInput, setIsShowingEmailInput] = useState(false)
  const [sendLoginEmail, sendLoginEmailResult] = useSendLoginEmailMutation()
  const isSending = sendLoginEmailResult.loading
  const emailSentTo = sendLoginEmailResult.data?.sendLoginEmail
  const didSend = Boolean(emailSentTo)

  if (didSend) {
    return (
      <Text sx={{
        textAlign: 'center'
      }}>
        We emailed a link to log in to <strong>{emailSentTo}</strong>.
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
            email,
            inviteCode,
          }
        })
      }}>
        <Label htmlFor="email" mb={3}>What&apos;s your email address?</Label>
        <Input name="email" type="email" placeholder="avidWordler420@gmail.com" required mb={3} />
        <Button type="submit" sx={sx}>{
          isSending ? 'Sending...' : sendLinkButtonLabel
        }</Button>
      </form>
    )
  }

  return (
    <Button onClick={() => {
      setIsShowingEmailInput(true)
    }} sx={sx}>{sendLinkButtonLabel}</Button>
  )
}

export default LogInWithEmailButton