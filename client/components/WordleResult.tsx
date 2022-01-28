import { WordleGuessResult } from "@prisma/client";

interface Props {
  result: {
    attempts: {
      guesses: WordleGuessResult[]
    }[]
  }
}

const WordleResult: React.FC<Props> = ({
  result
}) => {
  return (
    <div>
      {
        result.attempts.map((attempt, index) => {
          return (
            <div key={index}>
              {
                attempt.guesses.map(guess => {
                  if (guess == 'EXACT_MATCH') {
                    return '🟩'
                  } else if (guess == 'IN_WORD') {
                    return '🟨'
                  } else {
                    return '⬛️'
                  }
                })
              }
            </div>
          )
        })
      }
    </div>
  )
}

export default WordleResult
