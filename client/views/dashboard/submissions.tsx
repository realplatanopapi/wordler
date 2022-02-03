import { WordleResult as WordleResultType } from '@client/api'
import { UserFromSsr } from '@common/sessions'
import { format, startOfDay } from 'date-fns'
import React from 'react'
import { Box, Grid, Heading } from 'theme-ui'
import WordleResult from './wordle-result'

interface Props {
  currentUser: UserFromSsr
  results: WordleResultType[]
}

interface ResultsByDay {
  [key: string]: WordleResultType[]
}

const groupResultsByDay = (results: WordleResultType[]): ResultsByDay => {
  return results.reduce<ResultsByDay>((byDay, result) => {
    const day = startOfDay(new Date(result.createdAt)).toISOString()
    const resultsForDay = byDay[day] || []

    return {
      ...byDay,
      [day]: resultsForDay.concat(result)
    }
  }, {})
}

const Submissions: React.FC<Props> = ({ currentUser, results }) => {
  const grouped = groupResultsByDay(results)
  const today = startOfDay(new Date())

  return (
    <Box>
      {
        Object.keys(grouped).map(day => {
          const resultsForDay = grouped[day]
          const dayDate = startOfDay(new Date(day))
          const isToday = dayDate.valueOf() === today.valueOf()

          return (
            <Box key={day}>
              <Heading as="h4" my={4}>{isToday ? 'Today' : format(dayDate, 'EEEE')}</Heading>
              <Grid columns={[1, 2]} gap={4} mx={-4}>
              {
                resultsForDay.map(result => {
                  return (
                    <WordleResult key={result.id} currentUser={currentUser} result={result} />
                  ) 
                })
              }
              </Grid>
            </Box>
          )
        })
      }
    </Box>
  )
}

export default Submissions
