import React from 'react'
import { Heading, Flex, Text } from 'theme-ui'
import ClipboardCopy from '@client/components/clipboard-copy'
import StartGroupForm from './start-group-form'
import { Section } from '@client/layouts/page'
import { useGroupsQuery } from '@client/__gql__/api'


const Groups: React.FC = () => {
  const groupsQuery = useGroupsQuery()
  const groups = groupsQuery.data?.groups

  return (
    <Section heading="Your groups">
      {groups ? (
        <>
          {groups.map((group) => {
            return (
              <Flex mb={3} key={group.id}>
                <Text>{group.name}</Text>
                {group.inviteLink && (
                  <>
                    <Text mx={2}>-</Text>
                    <ClipboardCopy
                      textToCopy={group.inviteLink}
                      label="Copy invite link"
                    />
                  </>
                )}
              </Flex>
            )
          })}
          <Heading as="h4" mb={3} mt={5}>
            Start a new group
          </Heading>
          <StartGroupForm onSubmit={() => groupsQuery.refetch()} />
        </>
      ) : (
        'Loading your groups...'
      )}
    </Section>
  )
}

export default Groups
