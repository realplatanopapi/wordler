import WordleResult from '@client/components/WordleResult'
import axios from 'axios'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Box, Grid, Heading, Text } from 'theme-ui'
import DatePicker from '@client/components/DatePicker'
import GroupPicker from '@client/components/GroupPicker'
import {
  ResultsDocument,
  ResultsQuery,
  useCanPostResultsQuery,
  useGroupsQuery,
  useLeaderboardQuery,
  useResultsQuery,
  useWhoamiQuery,
} from '@client/__gql__/api'
import PostResultsForm from '@client/components/PostResultsForm'
import { client } from '@client/graphql'
import Leaderboard from '@client/components/Leaderboard'
import { useMemo } from 'react'
import { Group } from '@client/api'
import { formatInTimeZone } from 'date-fns-tz'
import { Section } from '@client/layouts/page'

const Home: NextPage = () => {
  const router = useRouter()
  const groupId = router.query.groupId as string
  const weekOfStr = router.query.weekOf
  const weekOf = weekOfStr ? new Date(weekOfStr as string) : new Date()
  const whoamiQuery = useWhoamiQuery()
  const canPostResultsQuery = useCanPostResultsQuery()
  const resultsQueryVariables = {
    weekOf,
    groupId,
  }
  const leaderboardQuery = useLeaderboardQuery({
    variables: {
      weekOf,
    },
  })
  const groupsQuery = useGroupsQuery()
  const resultsQuery = useResultsQuery({
    variables: resultsQueryVariables,
  })

  const user = whoamiQuery.data?.whoami || null
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
        [group.id]: group,
      }
    }, {})
  }, [groups])
  const selectedGroup = groupId && groupsById ? groupsById[groupId] : null

  return (
    <>
      <Head>
        <title>Wordler</title>
      </Head>
      <Box mb={1}>
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
        <Section>
          <PostResultsForm
            onSubmit={async (wordleResult) => {
              await canPostResultsQuery.refetch()
              client.cache.updateQuery<ResultsQuery>(
                {
                  query: ResultsDocument,
                  variables: resultsQueryVariables,
                },
                (data) => {
                  return {
                    ...data,
                    results: [wordleResult].concat(data?.results || []),
                  }
                }
              )
            }}
          />
        </Section>
      )}
      {groups && groups.length > 1 && (
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
                query: newQuery,
              })
            }}
          />
        </Box>
      )}
      <Heading as="h1" mb={3}>
        {selectedGroup ? selectedGroup.name : 'all results'}
      </Heading>
      <Section heading={`week of ${formatInTimeZone(weekOf, 'UTC', 'MMM dd')}`}>
        <Box mb={4}>
          {leaderboard && (
            <Leaderboard currentUser={user} leaderboard={leaderboard} />
          )}
        </Box>
      </Section>
      {results && results.length > 0 && (
        <Section heading="submissions">
          <Grid columns={1} gap={2} mx={-4}>
            {results.map((result: any) => {
              return (
                <WordleResult
                  key={result.id}
                  currentUser={user}
                  result={result}
                />
              )
            })}
          </Grid>
        </Section>
      )}
      <Section>
        <DatePicker selectedDate={weekOf} />
      </Section>
      <Section>
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
      </Section>
      {user && (
        <Section>
          <Text as="p" mb={2}>
            Signed in as {user.displayName}
          </Text>
          <Text as="p">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/api/auth/logout">Sign out</a>
          </Text>
        </Section>
      )}
    </>
  )
}

export default Home
