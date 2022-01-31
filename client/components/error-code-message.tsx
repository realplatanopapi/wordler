import { ERROR_CODE_MESSAGES } from '@client/utils'
import { Text } from 'theme-ui'

interface Props {
  code?: string | null
}

const ErrorCodeMessage: React.FC<Props> = ({ code }) => {
  if (!code) {
    return null
  }

  const message = ERROR_CODE_MESSAGES[code] || 'Something went wrong.'
  return (
    <Text as="p" color="red" mb={3}>
      {message}
    </Text>
  )
}

export default ErrorCodeMessage
