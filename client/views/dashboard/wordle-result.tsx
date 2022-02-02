import { WordleGuessResult, WordleResult } from '@client/api'
import { format } from 'date-fns'
import { Box, Flex, Grid, Text } from 'theme-ui'

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

const renderAttribute = (content: React.ReactNode) => {
  return (
    <Text
      as="p"
      mb={3}
      sx={{
        fontSize: 1,
      }}
    >
      {content}
    </Text>
  )
}

const WordleResult: React.FC<Props> = ({ currentUser, result }) => {
  const submittedAt = Date.parse(result.createdAt)
  const submittedAtFormatted = format(submittedAt, 'h:mm aaaa')
  const isResultForCurrentUser = currentUser?.id == result.user.id

  return (
    <Grid
      columns={[1, 2]}
      sx={{
        p: 4,
        borderColor: 'muted',
        borderRadius: 4,
        borderStyle: 'solid',
        borderWidth: 1,
      }}
    >
      <Box>
        <Text
          mb={3}
          as="p"
          sx={{
            fontWeight: isResultForCurrentUser ? 'bold' : 'normal',
          }}
        >
          {result.user.displayName}
          {isResultForCurrentUser ? ' (you)' : ''}
        </Text>
        {renderAttribute(<><strong>{result.score}</strong> points</>)}
        {renderAttribute(<>{result.attemptsUsed} / {result.maxAttempts} attempts</>)}
      </Box>
      <Box>
        {result.guesses.map((guesses, attemptIndex) => {
          return (
            <Flex
              key={attemptIndex}
              sx={{
                alignItems: 'center',
                mx: -1,
              }}
            >
              {guesses.map((guess, guessIndex) => {
                return (
                  <Text key={guessIndex} sx={{
                    fontSize: -1,
                    mx: '4px',
                    my: '2px',
                  }}>
                    {getEmojiForGuess(guess)}
                  </Text>
                )
              })}
            </Flex>
          )
        })}
      </Box>
    </Grid>
  )
}

export default WordleResult
