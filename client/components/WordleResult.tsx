import { WordleGuessResult } from '@prisma/client'
import { formatRelative } from 'date-fns'
import {Text} from 'theme-ui'

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
    <div>
      <Text as="p">{result.user.displayName}</Text>
      <Text as="p" sx={{
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
    </div>
  )
}

export default WordleResult
