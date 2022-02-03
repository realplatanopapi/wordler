import { Group } from '@client/api'
import ClipboardCopy from '@client/components/clipboard-copy'
import Link from '@client/components/link'
import StartGroupForm from '@client/views/dashboard/start-group-form'
import { useUpdateDisplayNameMutation } from '@client/__gql__/api'
import { UserFromSsr } from '@common/sessions'
import { useState } from 'react'
import { Box, Button, Heading, Input, Text } from 'theme-ui'

interface Props {
  isInAGroup: boolean
  user: UserFromSsr
  onCompleteOnboarding: () => any
}

const Onboarding: React.FC<Props> = ({ isInAGroup, onCompleteOnboarding, user }) => {
  console.log(isInAGroup)
  const [group, setGroup] = useState<Group | null>(null)
  const [displayName, setDisplayName] = useState<string | null>(user.displayName)
  const hasDisplayName = Boolean(displayName)
  const [updateDisplayName, updateDisplayNameResult] = useUpdateDisplayNameMutation({
    onCompleted: (result) => {
      const displayName = result.updateDisplayName?.displayName as string | null
      setDisplayName(displayName)

      if (isInAGroup) {
        onCompleteOnboarding()
      }
    }
  })
  const isUpdatingName = updateDisplayNameResult.loading

  if (!hasDisplayName) {
    return (
      <form onSubmit={(event) => {
        event.preventDefault()

        if (isUpdatingName) {
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
        { /* @ts-ignore */ }
        <Heading as="label" htmlFor="displayName" sx={{
          display: 'block',
          fontSize: 4,
          mb: 3,
        }}>What do you call yourself?</Heading>
        <Input name="displayName" placeholder="avidWordler45" required mb={3} />
        <Button type="submit">Set your display name</Button>
      </form>
    )
  }

  if (group && group.inviteLink) {
    return (
      <>
        <Text as="p" mb={1}>
          Well done! You&apos;ve started:
        </Text>
        <Heading as="h1" mb={4}>
          {group.name}
        </Heading>
        <Text as="p" mb={4}>
          Copy this link and send it to your friend(s) so they can join:
        </Text>
        <Box
          sx={{
            borderStyle: 'solid',
            borderColor: 'muted',
            borderWidth: 1,
            mb: 4,
            mx: -4,
            p: 4,
          }}
        >
          <Text>{group.inviteLink}</Text>
          <Text mx="3">-</Text>
          <ClipboardCopy textToCopy={group.inviteLink} />
        </Box>
        <Text as="p" mb={4}>
          You&apos;ll be able to invite your friend(s) later also.
        </Text>
        <Button
          sx={{
            cursor: 'pointer',
          }}
          onClick={() => {
            onCompleteOnboarding()
          }}
        >
          start wordle-ing!
        </Button>
      </>
    )
  }

  return (
    <>
      <Heading as="h1" mb={4}>Welcome {displayName}!</Heading>
      <Text as="p" mb={4}>
        Wordler only works if you have friends. You can either:
      </Text>
      <Heading as="h2" mb={3}>
        1. Start a new group to get started.
      </Heading>
      <Text as="p" mb={3}>
        Start your own group and invite your friend(s) to get started.
      </Text>
      <StartGroupForm
        onSubmit={(group) => {
          setGroup(group)
        }}
      />
      <Text
        as="p"
        my={4}
        sx={{
          textAlign: 'center',
        }}
      >
        or
      </Text>
      <Heading as="h2" mb={3}>
        2. Ask a friend to send you an invite link to their group.
      </Heading>
      <Text as="p">This option requires friends.</Text>
      <Text
        as="p"
        my={4}
        sx={{
          textAlign: 'center',
        }}
      >
        or
      </Text>
      <Heading as="h2" mb={3} mt={5}>
        3. Leave.
      </Heading>
      <Text as="p" mb={3}>
        A perfectly valid option.
      </Text>
      <Link href="https://www.youtube.com/watch?v=UqfLVDIZcP8" isExternal>
        Bye!
      </Link>
    </>
  )
}

export default Onboarding
