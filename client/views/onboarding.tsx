import { Group } from '@client/api'
import ClipboardCopy from '@client/components/clipboard-copy'
import Link from '@client/components/link'
import StartGroupForm from '@client/views/dashboard/start-group-form'
import { useState } from 'react'
import { Box, Button, Flex, Heading, Text } from 'theme-ui'

interface Props {
  onCompleteOnboarding: () => any
}

const Onboarding: React.FC<Props> = ({ onCompleteOnboarding }) => {
  const [group, setGroup] = useState<Group | null>(null)

  if (group && group.inviteLink) {
    return (
      <>
        <Text as="p" mb={1}>
          Well done! You&apos;ve started:
        </Text>
        <Heading as="h1" mb={4}>
          {group.name}
        </Heading>
        <Text as="p" mb={3}>
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
        <Text as="p" mb={3}>
          You&apos;ll be able to invite your friend(s) later also.
        </Text>
        <Flex
          sx={{
            justifyContent: 'center',
          }}
        >
          <Button
            onClick={() => {
              onCompleteOnboarding()
            }}
          >
            start wordle-ing
          </Button>
        </Flex>
      </>
    )
  }

  return (
    <>
      <Text as="p" mb={3}>
        Worldler only works if you have friends. You can either:
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
        mb={5}
        mt={6}
        sx={{
          textAlign: 'center',
        }}
      >
        or
      </Text>
      <Heading as="h2" mb={3}>
        2. Ask a friend to send you an invite link to their group.
      </Heading>
      <Text as="p">If you have any that is.</Text>
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
        No friends? Leaving is a perfectly valid option.
      </Text>
      <Link href="https://www.youtube.com/watch?v=UqfLVDIZcP8" isExternal>
        Bye!
      </Link>
    </>
  )
}

export default Onboarding
