import { Group } from '@client/api'
import { copyToClipboard } from '@client/utils'
import React from 'react'
import { Button, Flex, Text } from 'theme-ui'

interface Props {
  groups: Group[]
}

const Groups: React.FC<Props> = ({ groups }) => {
  return (
    <>
      {groups.map((group) => {
        return (
          <Flex key={group.id}>
            <Text>{group.name}</Text> - <Text onClick={() => {
              copyToClipboard(group.inviteLink)
            }}>
              Copy invite link
            </Text>
          </Flex>
        )
      })}
    </>
  )
}

export default Groups
