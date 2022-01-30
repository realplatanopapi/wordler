interface Props {
  selectedGroupId?: string
  groups: any[],
  onChange: (groupId: string | null) => any
}

const GroupPicker: React.FC<Props> = ({
  selectedGroupId,
  groups,
  onChange,
}) => {
  const value = selectedGroupId || ''
  return (
    <select name="group" onChange={(event) => {
      const newGroupId = event.target.value
      if (!newGroupId.length) {
        return onChange(null)
      }

      onChange(newGroupId)
    }} value={value}>
      <option value="">View results from all your groups</option>
      {
        groups.map(group => {
          return (
            <option key={group.id} value={group.id}>{group.name}</option>
          )
        })
      }
    </select>
  )
}

export default GroupPicker
