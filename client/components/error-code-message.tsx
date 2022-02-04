import { ERROR_CODE_MESSAGES } from '@client/utils'
import { Text, ThemeUIStyleObject } from 'theme-ui'

interface Props {
  code?: string | null
  sx?: ThemeUIStyleObject
}

const ErrorCodeMessage: React.FC<Props> = ({ code, sx }) => {
  if (!code) {
    return null
  }

  const message = ERROR_CODE_MESSAGES[code] || 'Something went wrong.'
  return (
    <Text as="p" color="red" mb={3} sx={sx}>
      {message}
    </Text>
  )
}

export default ErrorCodeMessage
