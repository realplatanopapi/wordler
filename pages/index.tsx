import WordleResult from '@client/components/WordleResult'
import axios from 'axios'
import { withIronSessionSsr } from 'iron-session/next'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Box, Heading, Text } from 'theme-ui'
import { getById } from '../server/lib/accounts'
import { cookieConfig } from '@server/lib/auth'
import { getStartOfWeek, startOfDay, toUTC } from '@common/utils/time'
import DatePicker from '@client/components/DatePicker'
import GroupPicker from '@client/components/GroupPicker'
import { ResultsDocument, ResultsQuery, useCanPostResultsQuery, useGroupsQuery, useLeaderboardQuery, useResultsQuery } from '@client/__gql__/api'
import PostResultsForm from '@client/components/PostResultsForm'
import { client } from '@client/graphql'
import Leaderboard from '@client/components/Leaderboard'
import { useMemo } from 'react'
import { Group } from '@client/api'
import { format } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'

interface HomePageProps {
  user: any | null
  dateStr: string
  [key: string]: any
}

export const getServerSideProps = withIronSessionSsr<HomePageProps>(
  async ({ req, query }) => {
    const dateQuery = query.date as string | undefined
    const startOfWeek = getStartOfWeek(new Date())
    const date = dateQuery ? startOfDay(toUTC(new Date(dateQuery))) : startOfWeek

    const userId = req.session.userId
    if (!userId) {
      return {
        props: {
          dateStr: date.toISOString(),
          user: null,
        },
      }
    }

    const user = await getById(userId)
    if (!user) {
      return {
        props: {
          dateStr: date.toISOString(),
          user: null,
        },
      }
    }

    return {
      props: {
        dateStr: date.toISOString(),
        user: {
          id: user.id,
          displayName: user.displayName,
        },
      },
    }
  },
  cookieConfig
)

const Home: NextPage<HomePageProps> = ({
  dateStr,
  user,
}) => {
  const router = useRouter()
  const groupId = router.query.groupId as string
  const weekOf = new Date(dateStr)
  const canPostResultsQuery = useCanPostResultsQuery()
  const resultsQueryVariables = {
    weekOf,
    groupId
  }
  const leaderboardQuery = useLeaderboardQuery({
    variables: {
      weekOf,
    }
  })
  const groupsQuery = useGroupsQuery()
  const resultsQuery = useResultsQuery({
    variables: resultsQueryVariables
  })

  const canPostResults = canPostResultsQuery.data?.canPostResults === true
  const groups = groupsQuery.data?.groups
  const results = resultsQuery.data?.results
  const leaderboard = leaderboardQuery.data?.leaderboard

  const groupsById: {
    [id: string]: Group
  } | null = useMemo(() => {
    if (!groups) {
      return null
    }

    return groups.reduce((acc, group) => {
      return {
        ...acc,
        [group.id]: group
      }
    }, {})
  },[groups]);
  const selectedGroup = groupId && groupsById ? groupsById[groupId] : null

  return (
    <>
      <Head>
        <title>Wordler</title>
      </Head>
      <Box mb={3}>
        <Text>wordler</Text>
      </Box>
      {!user && (
        <div>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/api/auth/twitter/authorize">
            Sign in with Twitter to share and compare your results
          </a>
        </div>
      )}
      {user && canPostResults && (
        <Box mb={5}>
          <PostResultsForm onSubmit={async (wordleResult) => {
            await canPostResultsQuery.refetch()
            client.cache.updateQuery<ResultsQuery>({
              query: ResultsDocument,
              variables: resultsQueryVariables
            }, (data) => {
              return {
                ...data,
                results: [wordleResult].concat(data?.results || [])
              }
            })
          }} />
        </Box>
      )}
      {groups?.length ? (
        <Box mb={4}>
          <GroupPicker
            selectedGroupId={groupId}
            groups={groups}
            onChange={(newGroupId) => {
              let newQuery = {
                ...router.query,
              }
              if (!newGroupId) {
                delete newQuery.groupId
              } else {
                newQuery.groupId = newGroupId
              }

              router.replace({
                query: newQuery
              })
            }}
          />
        </Box>
      ) : (
        <Text>Not a member of any groups (yet)</Text>
      )}
      <Box mb={4}>
        <Heading as="h1">
          {selectedGroup ? selectedGroup.name : (
            <>
              all results
            </>
          )}
        </Heading>
      </Box>
      <Box mb={4}>
        <Heading as="h2">week of {formatInTimeZone(weekOf, 'UTC', 'MMM dd')}</Heading>
      </Box>
      <Box mb={4}>
        {
          leaderboard && <Leaderboard currentUser={user} leaderboard={leaderboard} />
        }
      </Box>
      <Box mb={5}>
        {results?.map((result: any) => {
          return (
            <Box key={result.id} mb={3}>
              <WordleResult currentUser={user} result={result} />
            </Box>
          )
        })}
      </Box>
      <Box mb={4}>
        <DatePicker selectedDate={startOfDay(toUTC(new Date(dateStr)))} />
      </Box>
      <Box mb={5}>
        <form
          onSubmit={async (event) => {
            event.preventDefault()
            const form = event.target as HTMLFormElement
            const data = new FormData(form)
            const result = await axios.post('/api/groups', {
              name: data.get('name'),
            })
            router.push(`/groups/${result.data.data.id}`)
          }}
        >
          <label>
            <span>start a group</span>
            <br />
            <input name="name" placeholder="name your group" required />
          </label>
          <button type="submit">start</button>
        </form>
      </Box>
    </>
  )
}

export default Home
