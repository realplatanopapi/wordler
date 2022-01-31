import { WordleGuessResult } from '@client/api'
import { formatRelative } from 'date-fns'
import { Box, Text } from 'theme-ui'

interface Props {
  currentUser: {
    id: string
  } | null
  result: {
    user: {
      id: string
      displayName: string
    }
    guesses: WordleGuessResult[][]
    createdAt: string
  }
}

const WordleResult: React.FC<Props> = ({ currentUser, result }) => {
  const submittedAt = Date.parse(result.createdAt)
  const submittedAtFormatted = formatRelative(submittedAt, new Date())
  const isResultForCurrentUser = currentUser?.id == result.user.id

  return (
    <Box
      sx={{
        p: 4,
        borderColor: 'muted',
        borderRadius: 4,
        borderStyle: 'solid',
        borderWidth: 1,
      }}
    >
      <Text
        as="p"
        sx={{
          fontWeight: isResultForCurrentUser ? 'bold' : 'normal',
        }}
      >
        {result.user.displayName}
        {isResultForCurrentUser ? ' (you)' : ''}
      </Text>
      <Text
        as="p"
        mb={3}
        sx={{
          fontSize: 1,
        }}
      >
        submitted <time>{submittedAtFormatted}</time>
      </Text>
      {result.guesses.map((guesses, index) => {
        return (
          <div key={index}>
            {guesses.map((guess) => {
              if (guess == 'EXACT_MATCH') {
                return '🟩'
              } else if (guess == 'IN_WORD') {
                return '🟨'
              } else {
                return '⬛️'
              }
            })}
          </div>
        )
      })}
    </Box>
  )
}

export default WordleResult
