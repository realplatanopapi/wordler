import { WordleGuessResult } from '@prisma/client'
import { formatRelative } from 'date-fns'
import {Box, Text} from 'theme-ui'

interface Props {
  result: {
    user: {
      displayName: string
    }
    attempts: {
      guesses: WordleGuessResult[]
    }[]
    createdAt: string
  }
}

const WordleResult: React.FC<Props> = ({ result }) => {
  const submittedAt = Date.parse(result.createdAt)
  const submittedAtFormatted = formatRelative(submittedAt, new Date())

  return (
    <Box sx={{
      p: 4,
      borderColor: 'muted',
      borderRadius: 4,
      borderStyle: 'solid',
      borderWidth: 1,
    }}>
      <Text as="p">{result.user.displayName}</Text>
      <Text as="p" mb={3} sx={{
        fontSize: 1
      }}>submitted <time>{submittedAtFormatted}</time></Text>
      {result.attempts.map((attempt, index) => {
        return (
          <div key={index}>
            {attempt.guesses.map((guess) => {
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
