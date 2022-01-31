import { Group } from '@client/api'
import { copyToClipboard } from '@client/utils'
import React from 'react'
import { Heading, Flex, Text } from 'theme-ui'
import ClipboardCopy from '../../components/clipboard-copy'
import StartGroupForm from './start-group-form'

interface Props {
  groups: Group[]
  onStartGroup: () => any
}

const Groups: React.FC<Props> = ({ groups, onStartGroup }) => {
  return (
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
      <Heading as="h3" mb={3} mt={4}>
        Start a new group
      </Heading>
      <StartGroupForm onSubmit={onStartGroup} />
    </>
  )
}

export default Groups
