import { User, WordleResult as WordleResultType } from '@client/api'
import React from 'react'
import { Grid } from 'theme-ui'
import WordleResult from './wordle-result'

interface Props {
  currentUser: User
  results: WordleResultType[]
}

const Submissions: React.FC<Props> = ({ currentUser, results }) => {
  return (
    <Grid columns={1} gap={2} mx={-4}>
      {results.map((result) => {
        return (
          <WordleResult key={result.id} currentUser={currentUser} result={result} />
        )
      })}
    </Grid>
  )
}

export default Submissions
