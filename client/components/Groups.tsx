import { Group } from '@client/api'
import React from 'react'
import { Flex, Text } from 'theme-ui'

interface Props {
  groups: Group[]
}

const Groups: React.FC<Props> = ({ groups }) => {
  return (
    <>
      {groups.map((group) => {
        return (
          <Flex key={group.id}>
            <Text>{group.name}</Text> - {group.inviteLink}
          </Flex>
        )
      })}
    </>
  )
}

export default Groups
