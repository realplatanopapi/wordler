import { WordleGuessResult, WordleResult } from '@client/api'
import { formatRelative } from 'date-fns'
import { Box, Flex, Text } from 'theme-ui'

interface Props {
  currentUser: {
    id: string
  } | null
  result: WordleResult
}

const getEmojiForGuess = (guess: WordleGuessResult) => {
  if (guess == 'EXACT_MATCH') {
    return '🟩'
  } else if (guess == 'IN_WORD') {
    return '🟨'
  } else {
    return '⬛️'
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
      {result.guesses.map((guesses, attemptIndex) => {
        return (
          <Flex key={attemptIndex} sx={{
            alignItems: 'center',
            mx: -1,
          }}>
            {guesses.map((guess, guessIndex) => {
              return (
                <Box key={guessIndex} mx="6px" my="2px">{getEmojiForGuess(guess)}</Box>
              )
            })}
          </Flex>
        )
      })}
    </Box>
  )
}

export default WordleResult
